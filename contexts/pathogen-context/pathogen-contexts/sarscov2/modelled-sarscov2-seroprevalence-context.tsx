"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { SarsCov2Context } from "./sc2-context";
import { useBestFitCurve } from "@/components/customs/visualizations/line-fitting/use-best-fit-curve";
import { pipe } from "fp-ts/lib/function.js";
import { WhoRegion } from '@/gql/graphql';
import { MonthlySarsCov2CountryInformationContext } from './monthly-sarscov2-country-information-context';
import { filterDataForSarsCov2SeroprevalenceModelling } from './modelled-sarscov2-seroprevalence-context/data-filtering';
import { generateCountrySeroprevalenceDataBreakdown } from './modelled-sarscov2-seroprevalence-context/country-seroprevalence-breakdown-helper';
import { generateDataPointsForGroup } from './modelled-sarscov2-seroprevalence-context/generate-data-points-for-group';
import { fitModellingCurve } from './modelled-sarscov2-seroprevalence-context/fit-modelling-curve';
import { CustomizationSetting, CustomizationSettingType } from "@/components/ui/modal/customization-modal/customization-settings";
import { useSarsCov2Filters } from "@/hooks/sarscov2/useSarsCov2Filters";

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
  customizationSettingsForModal: Array<CustomizationSetting<string>>
}

const initialModelledSarsCov2SeroprevalenceContext = {
  dataPointsForWhoRegions: [],
  dataPointsForCountryAlphaThreeCodes: [],
  customizationSettingsForModal: []
};

export const ModelledSarsCov2SeroprevalenceContext = createContext<
  ModelledSarsCov2SeroprevalenceContextType
>(initialModelledSarsCov2SeroprevalenceContext);

interface ModelledSarsCov2SeroprevalenceProviderProps {
  children: React.ReactNode;
}

const filterSelectionDefaults = {
  scopeSelections: ['National', 'Regional'],
  riskOfBiasSelections: ['Low', 'Moderate'],
  populationGroupSelections: [
    'Blood donors',
    'Household and community samples',
    'Multiple general populations',
    'Persons living in slums',
    'Pregnant or parturient women',
    'Representative patient population',
    'Residual sera'
  ]
}

export const ModelledSarsCov2SeroprevalenceProvider = (props: ModelledSarsCov2SeroprevalenceProviderProps) => {
  const { filteredData } = useContext(SarsCov2Context);
  const { data: filterData } = useSarsCov2Filters();
  const { lookupOptimizedSarsCov2CountryInformation } = useContext(MonthlySarsCov2CountryInformationContext);
  const { generateBestFitCurve } = useBestFitCurve();

  const [ scopeSelections, setScopeSelections ] = useState<string[]>(filterSelectionDefaults.scopeSelections);
  const [ riskOfBiasSelections, setRiskOfBiasSelections ] = useState<string[]>(filterSelectionDefaults.riskOfBiasSelections);
  const [ populationGroupSelections, setPopulationGroupSelections ] = useState<string[]>(filterSelectionDefaults.populationGroupSelections);

  const { filteredDataForModelling } = useMemo(() =>
    filterDataForSarsCov2SeroprevalenceModelling({
      data: filteredData,
      filterSelections: {
        scopeSelections,
        riskOfBiasSelections,
        populationGroupSelections
      }
    })
  , [ filteredData, scopeSelections, riskOfBiasSelections, populationGroupSelections ]);

  const { countryModelledSeroprevalenceBreakdown } = useMemo(() =>
    generateCountrySeroprevalenceDataBreakdown({
      filteredDataForModelling,
      lookupOptimizedSarsCov2CountryInformation
    })
  , [ filteredDataForModelling, lookupOptimizedSarsCov2CountryInformation ])

  // const { dataPoints: dataPointsForWorld } = useMemo(() => pipe({
  //   groupingKey: "global" as const,
  //   countryModelledSeroprevalenceBreakdown
  // },
  //   generateDataPointsForGroup<"global", "Global">,
  //   (input) => fitModellingCurve({ ...input, generateBestFitCurve })
  // ), [ countryModelledSeroprevalenceBreakdown ]);

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
  
  const customizationSettingsForModal = useMemo((): Array<CustomizationSetting<string>> => [{
    type: CustomizationSettingType.MULTI_SELECT_DROPDOWN,
    dropdownName: 'Study Scope Required to be Considered in Modelled Seroprevalence',
    heading: 'Study Scope Required to be Considered in Modelled Seroprevalence',
    options: filterData?.sarsCov2FilterOptions.scope ?? [],
    optionToLabelMap: {},
    selected: scopeSelections,
    handleOnChange: (selected) => setScopeSelections(selected)
  }, {
    type: CustomizationSettingType.MULTI_SELECT_DROPDOWN,
    dropdownName: 'Risk of Bias Required to be Considered in Modelled Seroprevalence',
    heading: 'Risk of Bias Required to be Considered in Modelled Seroprevalence',
    options: filterData?.sarsCov2FilterOptions.riskOfBias ?? [],
    optionToLabelMap: {},
    selected: riskOfBiasSelections,
    handleOnChange: (selected) => setRiskOfBiasSelections(selected)
  }, {
    type: CustomizationSettingType.MULTI_SELECT_DROPDOWN,
    dropdownName: 'Population Group Required to be Considered in Modelled Seroprevalence',
    heading: 'Population Group Required to be Considered in Modelled Seroprevalence',
    options: filterData?.sarsCov2FilterOptions.populationGroup ?? [],
    optionToLabelMap: {},
    selected: populationGroupSelections,
    handleOnChange: (selected) => setPopulationGroupSelections(selected)
  }], [ filterData, scopeSelections, setScopeSelections, riskOfBiasSelections, setRiskOfBiasSelections, populationGroupSelections, setPopulationGroupSelections ]);

  return (
    <ModelledSarsCov2SeroprevalenceContext.Provider
      value={{
        dataPointsForCountryAlphaThreeCodes,
        dataPointsForWhoRegions,
        customizationSettingsForModal
      }}
    >
      {props.children}
    </ModelledSarsCov2SeroprevalenceContext.Provider>
  );
}