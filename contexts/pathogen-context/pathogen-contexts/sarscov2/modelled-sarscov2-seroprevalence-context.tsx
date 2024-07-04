"use client";
import uniq from 'lodash/uniq';
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { SarsCov2Context, SarsCov2Estimate } from "./sc2-context";
import { useBestFitCurve } from "@/components/customs/visualizations/line-fitting/use-best-fit-curve";
import { generateRange, typedGroupBy, typedObjectEntries, typedObjectFromEntries, typedObjectKeys } from "@/lib/utils";
import { dateToMonthCount, monthEnumFromMonthIndex } from "@/lib/time-utils";
import parseISO from "date-fns/parseISO";
import { pipe } from "fp-ts/lib/function.js";
import { GbdSubRegion, GbdSuperRegion, UnRegion, WhoRegion } from '@/gql/graphql';
import { MonthlySarsCov2CountryInformationContext } from './monthly-sarscov2-country-information-context';
import { filterDataForSarsCov2SeroprevalenceModelling } from './modelled-sarscov2-seroprevalence-context/data-filtering';
import { generateCountrySeroprevalenceDataBreakdown } from './modelled-sarscov2-seroprevalence-context/country-seroprevalence-breakdown-helper';
import { generateDataPointsForGroup } from './modelled-sarscov2-seroprevalence-context/generate-data-points-for-group';
import { fitModellingCurve } from './modelled-sarscov2-seroprevalence-context/fit-modelling-curve';

export type CountryModelledSeroprevalenceBreakdown = Record<string, {
  whoRegion: WhoRegion | undefined;
  data: Array<{
    xAxisValue: number;
    modelledYAxisValue: number;
    rawYAxisValue: number | undefined;
  }>;
}>;

interface ModelledSarsCov2SeroprevalenceContextType {
  countryModelledSeroprevalenceBreakdown: CountryModelledSeroprevalenceBreakdown;
}

const initialModelledSarsCov2SeroprevalenceContext = {
  countryModelledSeroprevalenceBreakdown: {}
};

export const ModelledSarsCov2SeroprevalenceContext = createContext<
  ModelledSarsCov2SeroprevalenceContextType
>(initialModelledSarsCov2SeroprevalenceContext);

interface ModelledSarsCov2SeroprevalenceProviderProps {
  children: React.ReactNode;
}


export const ModelledSarsCov2SeroprevalenceProvider = (props: ModelledSarsCov2SeroprevalenceProviderProps) => {
  const { filteredData } = useContext(SarsCov2Context);
  const { lookupOptimizedSarsCov2CountryInformation } = useContext(MonthlySarsCov2CountryInformationContext);
  const { generateBestFitCurve } = useBestFitCurve();

  const { filteredDataForModelling } = useMemo(() =>
    filterDataForSarsCov2SeroprevalenceModelling({ data: filteredData })
  , [ filteredData ]);

  const { countryModelledSeroprevalenceBreakdown } = useMemo(() =>
    generateCountrySeroprevalenceDataBreakdown({
      filteredDataForModelling,
      lookupOptimizedSarsCov2CountryInformation
    })
  , [ filteredDataForModelling, lookupOptimizedSarsCov2CountryInformation ])

  const { dataPoints: dataPointsForWorld } = useMemo(() => pipe({
    groupingKey: "global" as const,
    countryModelledSeroprevalenceBreakdown
  },
    generateDataPointsForGroup<"global", "Global">,
    fitModellingCurve
  ), [ countryModelledSeroprevalenceBreakdown ]);

  const { dataPoints: dataPointsForWhoRegions } = useMemo(() => pipe({
    groupingKey: "whoRegion" as const,
    countryModelledSeroprevalenceBreakdown
  },
    generateDataPointsForGroup<"whoRegion", WhoRegion>,
    fitModellingCurve
  ), [ countryModelledSeroprevalenceBreakdown ]);

  console.log('dataPointsForWhoRegions', dataPointsForWhoRegions);

  const { dataPoints: dataPointsForUnRegions } = useMemo(() => pipe({
    groupingKey: "unRegion" as const,
    countryModelledSeroprevalenceBreakdown
  },
    generateDataPointsForGroup<"unRegion", UnRegion>,
    fitModellingCurve
  ), [ countryModelledSeroprevalenceBreakdown ]);

  const { dataPoints: dataPointsForGbdSuperRegions } = useMemo(() => pipe({
    groupingKey: "gbdSuperRegion" as const,
    countryModelledSeroprevalenceBreakdown
  },
    generateDataPointsForGroup<"gbdSuperRegion", GbdSuperRegion>,
    fitModellingCurve
  ), [ countryModelledSeroprevalenceBreakdown ]);

  const { dataPoints: dataPointsForGbdSubRegions } = useMemo(() => pipe({
    groupingKey: "gbdSubRegion" as const,
    countryModelledSeroprevalenceBreakdown
  },
    generateDataPointsForGroup<"gbdSubRegion", GbdSubRegion>,
    fitModellingCurve
  ), [ countryModelledSeroprevalenceBreakdown ]);

  //const countryModelledSeroprevalenceBreakdown = useMemo(() => {
  //  return typedObjectFromEntries(
  //    typedObjectEntries(countrySeroprevalenceDataBreakdown)
  //      .map(([countryAlphaThreeCode, dataForCountry]) => {
  //        const { xAxisValueToYAxisValue } = generateBestFitCurve({
  //          data: dataForCountry.data,
  //          maximumPolynomialOrder: 2
  //        });

  //        const allXAxisValuesForPrimaryKey = uniq(dataForCountry.data.map(({ xAxisValue }) => xAxisValue));
  //        const smallestXAxisValueForPrimaryKey = Math.min(...allXAxisValuesForPrimaryKey);
  //        const largestXAxisValueForPrimaryKey = Math.max(...allXAxisValuesForPrimaryKey);

  //        const modelledDataForCountry = generateRange({
  //          startInclusive: smallestXAxisValueForPrimaryKey,
  //          endInclusive: largestXAxisValueForPrimaryKey,
  //          stepSize: 1
  //        })
  //          .map((xAxisValue) => {
  //            let yAxisValue = xAxisValueToYAxisValue({ xAxisValue });

  //            return {
  //              xAxisValue: xAxisValue,
  //              modelledYAxisValue: yAxisValue,
  //              rawYAxisValue: dataForCountry.data.find((element) => element.xAxisValue === xAxisValue)?.yAxisValue
  //            }
  //          })
  //          .filter((element) =>
  //            element.modelledYAxisValue <= 100 &&
  //            element.modelledYAxisValue >= 0
  //          )
  //          .filter((element, index, array) => {
  //            if(index === 0 && array.length === 1) {
  //              return true;
  //            }
  //            if(index === 0 && array.length > 1) {
  //              const secondElement = array[1];

  //              return element.modelledYAxisValue <= secondElement.modelledYAxisValue;
  //            }

  //            const previousElement = array[index - 1]

  //            return element.modelledYAxisValue >= previousElement.modelledYAxisValue;
  //          })

  //        return [
  //          countryAlphaThreeCode,
  //          {
  //            whoRegion: dataForCountry.whoRegion,
  //            data: modelledDataForCountry
  //          }
  //        ]
  //      })
  //  )
  //}, [countrySeroprevalenceDataBreakdown, generateBestFitCurve])

  return (
    <ModelledSarsCov2SeroprevalenceContext.Provider
      value={{
        //countryModelledSeroprevalenceBreakdown: countryModelledSeroprevalenceBreakdown
        countryModelledSeroprevalenceBreakdown: {}
      }}
    >
      {props.children}
    </ModelledSarsCov2SeroprevalenceContext.Provider>
  );
}