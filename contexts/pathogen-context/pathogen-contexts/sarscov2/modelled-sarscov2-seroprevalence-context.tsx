"use client";
import { createContext, useContext, useEffect, useMemo } from "react";
import { SarsCov2Context } from "./sc2-context";
import { useBestFitCurve } from "@/components/customs/visualizations/line-fitting/use-best-fit-curve";
import { pipe } from "fp-ts/lib/function.js";
import { GbdSubRegion, GbdSuperRegion, UnRegion, WhoRegion } from '@/gql/graphql';
import { MonthlySarsCov2CountryInformationContext } from './monthly-sarscov2-country-information-context';
import { filterDataForSarsCov2SeroprevalenceModelling } from './modelled-sarscov2-seroprevalence-context/data-filtering';
import { generateCountrySeroprevalenceDataBreakdown } from './modelled-sarscov2-seroprevalence-context/country-seroprevalence-breakdown-helper';
import { generateDataPointsForGroup } from './modelled-sarscov2-seroprevalence-context/generate-data-points-for-group';
import { fitModellingCurve } from './modelled-sarscov2-seroprevalence-context/fit-modelling-curve';

export type CountryModelledSeroprevalenceBreakdown = Record<string, {
  data: Array<{
    xAxisValue: number;
    modelledYAxisValue: number;
    rawYAxisValue: number | undefined;
  }>;
}>;

interface ModelledSarsCov2SeroprevalenceContextType {
  dataPointsForWhoRegions: Array<{
    whoRegion: WhoRegion,
    data: Array<{
      xAxisValue: number;
      rawYAxisValue: number | undefined;
      modelledYAxisValue: number;
    }>
  }>
  dataPointsForCountryAlphaThreeCodes: Array<{
    countryAlphaThreeCode: string,
    data: Array<{
      xAxisValue: number;
      rawYAxisValue: number | undefined;
      modelledYAxisValue: number;
    }>
  }>
}

const initialModelledSarsCov2SeroprevalenceContext = {
  dataPointsForWhoRegions: [],
  dataPointsForCountryAlphaThreeCodes: []
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
    (input) => fitModellingCurve({ ...input, generateBestFitCurve })
  ), [ countryModelledSeroprevalenceBreakdown ]);

  const { dataPoints: dataPointsForWhoRegions } = useMemo(() => pipe({
    groupingKey: "whoRegion" as const,
    countryModelledSeroprevalenceBreakdown
  },
    generateDataPointsForGroup<"whoRegion", WhoRegion>,
    (input) => fitModellingCurve({ ...input, generateBestFitCurve }),
    (input) => ({ dataPoints: input.dataPoints.map((dataPoint) => ({ whoRegion: dataPoint.groupingKey, data: dataPoint.data }))})
  ), [ countryModelledSeroprevalenceBreakdown ]);

  const { dataPoints: dataPointsForCountryAlphaThreeCodes } = useMemo(() => pipe({
    groupingKey: "countryAlphaThreeCode" as const,
    countryModelledSeroprevalenceBreakdown
  },
    generateDataPointsForGroup<"countryAlphaThreeCode", string>,
    (input) => fitModellingCurve({ ...input, generateBestFitCurve }),
    (input) => ({ dataPoints: input.dataPoints.map((dataPoint) => ({ countryAlphaThreeCode: dataPoint.groupingKey, data: dataPoint.data }))})
  ), [ countryModelledSeroprevalenceBreakdown ]);

  useEffect(() => {
    console.log('dataPointsForWhoRegions', dataPointsForWhoRegions);
  }, [ dataPointsForWhoRegions ])

  return (
    <ModelledSarsCov2SeroprevalenceContext.Provider
      value={{
        dataPointsForCountryAlphaThreeCodes,
        dataPointsForWhoRegions
      }}
    >
      {props.children}
    </ModelledSarsCov2SeroprevalenceContext.Provider>
  );
}