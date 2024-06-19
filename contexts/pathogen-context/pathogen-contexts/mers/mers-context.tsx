"use client";
import { createContext, useEffect, useMemo } from "react";
import { PathogenContextActionType, PathogenContextState, PathogenContextType, PathogenDataFetcherProps, PathogenProviders } from "../../pathogen-context";
import { MersEstimatesQuery } from "@/gql/graphql";
import { CountryDataContext } from "../../country-information-context";
import { useMersData } from "@/hooks/mers/useMersData";
import { useMersFilters } from "@/hooks/mers/useMersFilters";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { useFaoMersEventData } from "@/hooks/mers/useFaoMersEventData";
import { CamelPopulationDataProvider } from "./camel-population-data-context";

const initialMersContextState = {
  filteredData: [],
  faoMersEventData: [],
  selectedFilters: {
    ["__typename"]: ["MersEstimate", "AnimalMersEvent", "HumanMersEvent"],
  },
  dataFiltered: false,
}

export type MersEstimate = MersEstimatesQuery['mersEstimates'][number];
type MersContextState = PathogenContextState<MersEstimate> & {
  faoMersEventData: FaoMersEvent[];
};
type MersContextType = PathogenContextType<MersEstimate, MersContextState>;

export const MersContext = createContext<MersContextType>({
  ...initialMersContextState,
  dispatch: (obj) => {
    console.debug("dispatch not initialized", obj);
  },
});

const MersDataFetcher = (props: PathogenDataFetcherProps<MersEstimate, MersContextState>): React.ReactNode => {
  const { data } = useMersData();
  const { faoMersEvents } = useFaoMersEventData()

  useEffect(() => {
    if (
      !!data
      && !!faoMersEvents
      && props.state.filteredData.length === 0
      && !props.state.dataFiltered
    ) {
      props.dispatch({
        type: PathogenContextActionType.INITIAL_DATA_FETCH,
        payload: {
          data: data.mersEstimates,
          faoMersEventData: faoMersEvents
        }
      });
    }
  }, [data, faoMersEvents]);

  return (
    <>
      {props.children}
    </>
  )
}

const CountryDataProvider = (props: {children: React.ReactNode}) => {
  const { data: filterData } = useMersFilters();
  const value = useMemo(() =>
    filterData?.mersFilterOptions.countryIdentifiers.map(({
      name,
      alphaTwoCode,
      alphaThreeCode
    }) => ({
      countryName: name,
      countryAlphaTwoCode: alphaTwoCode,
      countryAlphaThreeCode: alphaThreeCode
    })) ?? []
  , [filterData])

  return (
    <CountryDataContext.Provider value={value}>
      {props.children}
    </CountryDataContext.Provider>
  )
}

interface MersProvidersProps {
  children: React.ReactNode;
}

export const MersProviders = (props: MersProvidersProps) => {
  return (
    <PathogenProviders
      initialState={initialMersContextState}
      countryDataProvider={CountryDataProvider}
      context={MersContext}
      mapId={"mersMap"}
      // TODO: FILTERING ON FAO MERS EVENTS AND SEROPREVALENCE ESTIMATES
      filterUpdateHandlerOverride={({ state }) => state}
      initialDataFetchHandlerOverride={({ state, action, initialState }) => ({
        ...state,
        filteredData: action.payload.data,
        faoMersEventData: action.payload.faoMersEventData,
        selectedFilters: initialState.selectedFilters,
        dataFiltered: false,
      })}
      // TODO: FILTERING ON FAO MERS EVENTS AND SEROPREVALENCE ESTIMATES
      filterResetHandlerOverride={({ state }) => state}
      dataFetcher={MersDataFetcher}
    >
      <CamelPopulationDataProvider>
        {props.children}
      </CamelPopulationDataProvider>
    </PathogenProviders>
  )
}