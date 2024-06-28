"use client";
import uniq from 'lodash/uniq';
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { SarsCov2Context, SarsCov2Estimate } from "./sc2-context";
import { useBestFitCurve } from "@/components/customs/visualizations/line-fitting/use-best-fit-curve";
import { generateRange, typedGroupBy, typedObjectEntries, typedObjectFromEntries, typedObjectKeys } from "@/lib/utils";
import { dateToMonthCount } from "@/lib/time-utils";
import parseISO from "date-fns/parseISO";

type CountrySeroprevalenceBreakdown = Record<string, Array<{
  xAxisValue: number;
  yAxisValue: number;
}>>

interface ModelledSarsCov2SeroprevalenceContextType {
  countrySeroprevalenceDataBreakdown: CountrySeroprevalenceBreakdown;
  countryModelledSeroprevalenceBreakdown: CountrySeroprevalenceBreakdown;
}

const initialModelledSarsCov2SeroprevalenceContext = {
  countrySeroprevalenceDataBreakdown: {},
  countryModelledSeroprevalenceBreakdown: {}
};

export const ModelledSarsCov2SeroprevalenceContext = createContext<
  ModelledSarsCov2SeroprevalenceContextType
>(initialModelledSarsCov2SeroprevalenceContext);

interface ModelledSarsCov2SeroprevalenceProviderProps {
  children: React.ReactNode;
}

type AcceptableSarsCov2EstimateWithSeroprevalence = Omit<SarsCov2Estimate, "samplingMidDate"|"whoRegion"|"denominatorValue"|"numeratorValue"|"seroprevalence"> & {
  samplingMidDate: NonNullable<SarsCov2Estimate["samplingMidDate"]>;
  whoRegion: NonNullable<SarsCov2Estimate["whoRegion"]>;
  denominatorValue: NonNullable<SarsCov2Estimate["denominatorValue"]>;
} & {
  numeratorValue: SarsCov2Estimate["numeratorValue"];
  seroprevalence: NonNullable<SarsCov2Estimate["seroprevalence"]>;
}

const isAcceptableSarsCov2EstimateWithSeroprevalence = (estimate: AcceptableSarsCov2Estimate): estimate is AcceptableSarsCov2EstimateWithSeroprevalence =>
  estimate.seroprevalence !== null && estimate.seroprevalence !== undefined;

type AcceptableSarsCov2EstimateWithNumerator = Omit<SarsCov2Estimate, "samplingMidDate"|"whoRegion"|"denominatorValue"|"numeratorValue"|"seroprevalence"> & {
  samplingMidDate: NonNullable<SarsCov2Estimate["samplingMidDate"]>;
  whoRegion: NonNullable<SarsCov2Estimate["whoRegion"]>;
  denominatorValue: NonNullable<SarsCov2Estimate["denominatorValue"]>;
} & {
  numeratorValue: NonNullable<SarsCov2Estimate["numeratorValue"]>;
  seroprevalence: SarsCov2Estimate["seroprevalence"]
}

const isAcceptableSarsCov2EstimateWithNumerator = (estimate: AcceptableSarsCov2Estimate): estimate is AcceptableSarsCov2EstimateWithNumerator =>
  estimate.numeratorValue !== null && estimate.numeratorValue !== undefined;

type AcceptableSarsCov2Estimate = AcceptableSarsCov2EstimateWithSeroprevalence | AcceptableSarsCov2EstimateWithNumerator;

export const ModelledSarsCov2SeroprevalenceProvider = (props: ModelledSarsCov2SeroprevalenceProviderProps) => {
  const { filteredData } = useContext(SarsCov2Context);
  const { generateBestFitCurve } = useBestFitCurve();

  const consideredData = useMemo(() => filteredData
    .filter((dataPoint: SarsCov2Estimate): dataPoint is AcceptableSarsCov2Estimate => 
        !!dataPoint.samplingMidDate
        && !!dataPoint.whoRegion
        && dataPoint.denominatorValue !== null && dataPoint.denominatorValue !== undefined
        && (
          (dataPoint.numeratorValue !== null && dataPoint.numeratorValue !== undefined)
          || (dataPoint.seroprevalence !== null && dataPoint.seroprevalence !== undefined)
        )
    ),
    [filteredData]
  );

  const countrySeroprevalenceDataBreakdown = useMemo(() => {
    if(consideredData.length === 0) {
      return {};
    }

    const dataBrokenDownByCountry = typedGroupBy(consideredData, (dataPoint) => dataPoint.countryAlphaThreeCode);
    const allCountryAlphaThreeCodes = typedObjectKeys(dataBrokenDownByCountry);

    return typedObjectFromEntries(allCountryAlphaThreeCodes
      .map((countryAlphaThreeCode): [string, AcceptableSarsCov2Estimate[]] => [
        countryAlphaThreeCode, dataBrokenDownByCountry[countryAlphaThreeCode]
      ])
      .map(([countryAlphaThreeCode, dataForCountry]): [
        string,
        Array<{xAxisValue: number, yAxisValue: number}>
      ] => [
        countryAlphaThreeCode,
        dataForCountry.map((dataPoint) => {
          const seroprevalenceDecimalValue = isAcceptableSarsCov2EstimateWithNumerator(dataPoint)
            ? dataPoint.numeratorValue / dataPoint.denominatorValue
            : (dataPoint.seroprevalence * dataPoint.denominatorValue) / dataPoint.denominatorValue

          return {
            xAxisValue: dateToMonthCount(parseISO(dataPoint.samplingMidDate)),
            yAxisValue: seroprevalenceDecimalValue
          }
        })
      ])
    )
  }, [consideredData])

  const countryModelledSeroprevalenceBreakdown = useMemo(() => {
    return typedObjectFromEntries(
      typedObjectEntries(countrySeroprevalenceDataBreakdown)
        .map(([countryAlphaThreeCode, dataForCountry]) => {
          const { xAxisValueToYAxisValue } = generateBestFitCurve({
            data: dataForCountry,
            maximumPolynomialOrder: 2
          });

          const allXAxisValuesForPrimaryKey = uniq(dataForCountry.map(({ xAxisValue }) => xAxisValue));
          const smallestXAxisValueForPrimaryKey = Math.min(...allXAxisValuesForPrimaryKey);
          const largestXAxisValueForPrimaryKey = Math.max(...allXAxisValuesForPrimaryKey);

          const modelledDataForCountry = generateRange({
            startInclusive: smallestXAxisValueForPrimaryKey,
            endInclusive: largestXAxisValueForPrimaryKey,
            stepSize: 1
          })
            .map((xAxisValue) => {
              let yAxisValue = xAxisValueToYAxisValue({ xAxisValue });

              return {
                xAxisValue: xAxisValue,
                yAxisValue: yAxisValue
              }
            })
            .filter((element) =>
              element.yAxisValue <= 100 &&
              element.yAxisValue >= 0
            )
            .filter((element, index, array) => {
              if(index === 0 && array.length === 1) {
                return true;
              }
              if(index === 0 && array.length > 1) {
                const secondElement = array[1];

                return element.yAxisValue <= secondElement.yAxisValue;
              }

              const previousElement = array[index - 1]

              return element.yAxisValue >= previousElement.yAxisValue;
            })

          return [
            countryAlphaThreeCode,
            modelledDataForCountry
          ]
        })
    )
  }, [countrySeroprevalenceDataBreakdown, generateBestFitCurve])

  return (
    <ModelledSarsCov2SeroprevalenceContext.Provider
      value={{
        countrySeroprevalenceDataBreakdown: countrySeroprevalenceDataBreakdown,
        countryModelledSeroprevalenceBreakdown: countryModelledSeroprevalenceBreakdown
      }}
    >
      {props.children}
    </ModelledSarsCov2SeroprevalenceContext.Provider>
  );
}