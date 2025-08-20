"use client";
import { createContext, useEffect, useMemo } from "react";
import uniqBy from "lodash/uniqBy";
import { PathogenContextActionType, PathogenContextState, PathogenContextType, PathogenDataFetcherProps, PathogenProviders } from "../../pathogen-context";
import { useGroupedArboData } from "@/hooks/arbovirus/useGroupedArboData";
import { useArboFilters } from "@/hooks/arbovirus/useArboFilters";
import { CountryDataContext } from "../../country-information-context";
import { ArbovirusEstimateType, ArbovirusStudyPopulation, PartitionedUnravelledGroupedArbovirusEstimatesQuery } from "@/gql/graphql";
import { ArbovirusEnvironmentalSuitabilityCountryDataProvider } from "./arbo-environmental-suitability-country-data-context";
import { useArboEnviromentalSuitabilityData } from "@/hooks/arbovirus/useArboEnviromentalSuitabilityData";
import { ArbovirusOropoucheCasesDataProvider } from "./arbo-oropouche-cases-data-context";
import { ArbovirusAvailablePathogensProvider } from "./arbo-available-pathogens-context";
import { filterData } from "../../filter-update-steps/apply-new-selected-filters";
import { DashboardType, dashboardTypeToMapIdMap } from "@/app/pathogen/dashboard-enums";

export type ArbovirusEstimate = PartitionedUnravelledGroupedArbovirusEstimatesQuery['partitionedUnravelledGroupedArbovirusEstimates']['arboEstimates'][number] & {
  isPrimaryEstimate: boolean;
};

const initialArboContextState = {
  filteredData: [],
  selectedFilters: {
    'pathogen': ["DENV", "ZIKV", "CHIKV", "YFV", "WNV", "MAYV", "OROV"],
    'estimateType': [ ArbovirusEstimateType.Seroprevalence ],
    'studyPopulation': [ ArbovirusStudyPopulation.Human ]
  },
  dataFiltered: false,
}

type ArbovirusContextState = PathogenContextState<ArbovirusEstimate>;
type ArbovirusContextType = PathogenContextType<ArbovirusEstimate, ArbovirusContextState>;

export const ArboContext = createContext<ArbovirusContextType>({
  ...initialArboContextState,
  dispatch: (obj) => {
    console.debug("dispatch not initialized", obj);
  },
});

const ArboDataFetcher = (props: PathogenDataFetcherProps<ArbovirusEstimate, ArbovirusContextState>): React.ReactNode => {
  const dataQuery = useGroupedArboData();

  useEffect(() => {
    if (
      props.state.filteredData.length === 0 &&
      !props.state.dataFiltered &&
      "data" in dataQuery &&
      !!dataQuery.data &&
      typeof dataQuery.data === "object" &&
      "arbovirusEstimates" in dataQuery.data &&
      Array.isArray(dataQuery.data.arbovirusEstimates) &&
      dataQuery.data.arbovirusEstimates.length > 0
    ) {
      props.dispatch({
        type: PathogenContextActionType.INITIAL_DATA_FETCH,
        payload: {
          data: dataQuery.data.arbovirusEstimates,
          selectedFilters: initialArboContextState.selectedFilters,
          dataFiltered: true
        },
      });
    }
  }, [ dataQuery, props ]);

  return (
    <>
      {props.children}
    </>
  )
}

const CountryDataProvider = (props: {children: React.ReactNode}) => {
  const { data: filterData } = useArboFilters();
  const { data: esmData } = useArboEnviromentalSuitabilityData();
  const value = useMemo(() => {
    const countriesFromFilters = filterData?.arbovirusFilterOptions.countryIdentifiers.map(({
      name,
      alphaTwoCode,
      alphaThreeCode
    }) => ({
      countryName: name,
      countryAlphaTwoCode: alphaTwoCode,
      countryAlphaThreeCode: alphaThreeCode
    })) ?? []

    const countriesFromEsmData = esmData?.arbovirusEnviromentalSuitabilityData.map(({
      countryAlphaThreeCode,
      countryAlphaTwoCode,
      countryName
    }) => ({
      countryName,
      countryAlphaTwoCode,
      countryAlphaThreeCode
    })) ?? []

    return uniqBy([
      ...countriesFromFilters,
      ...countriesFromEsmData
    ], (country) => country.countryAlphaThreeCode)
  }, [ filterData, esmData?.arbovirusEnviromentalSuitabilityData ])

  return (
    <CountryDataContext.Provider value={value}>
      {props.children}
    </CountryDataContext.Provider>
  )
}

interface ArboProvidersProps {
  children: React.ReactNode;
}

export const ArboProviders = (props: ArboProvidersProps) => {
  return (
    <PathogenProviders
      initialState={initialArboContextState}
      countryDataProvider={CountryDataProvider}
      context={ArboContext}
      mapId={dashboardTypeToMapIdMap[DashboardType.ARBOVIRUS]}
      dataFetcher={ArboDataFetcher}
      initialDataFetchHandlerOverride={({ state, action, map }) => {
        const outputState = {
          ...state,
          filteredData: filterData(
            action.payload.data,
            initialArboContextState.selectedFilters
          ),
          selectedFilters: initialArboContextState.selectedFilters,
          dataFiltered: true,
        };

        return outputState;
      }}
      filterResetHandlerOverride={({ state, action, map }) => {
        const outputState = {
          ...state,
          filteredData: filterData(
            action.payload.data,
            initialArboContextState.selectedFilters
          ),
          selectedFilters: initialArboContextState.selectedFilters,
          dataFiltered: true,
        };

        return outputState;
      }}
    >
      <ArbovirusEnvironmentalSuitabilityCountryDataProvider>
        <ArbovirusOropoucheCasesDataProvider>
          <ArbovirusAvailablePathogensProvider>
            {props.children}
          </ArbovirusAvailablePathogensProvider>
        </ArbovirusOropoucheCasesDataProvider>
      </ArbovirusEnvironmentalSuitabilityCountryDataProvider>
    </PathogenProviders>
  )
}