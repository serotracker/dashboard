"use client";
import { createContext, useEffect, useMemo } from "react";
import { pipe } from "fp-ts/lib/function";
import { PathogenContextActionType, PathogenContextState, PathogenContextType, PathogenDataFetcherProps, PathogenProviders } from "../../pathogen-context";
import { MersEstimatesQuery } from "@/gql/graphql";
import { CountryDataContext } from "../../country-information-context";
import { useMersData } from "@/hooks/mers/useMersData";
import { useMersFilters } from "@/hooks/mers/useMersFilters";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { useFaoMersEventData } from "@/hooks/mers/useFaoMersEventData";
import { CamelPopulationDataProvider } from "./camel-population-data-context";
import { filterData } from "../../filter-update-steps/apply-new-selected-filters";
import { addActionToSelectedFilters } from "../../filter-update-steps/add-action-to-selected-filters";
import { adjustMapPosition } from "../../filter-update-steps/adjust-map-position";

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
          data: {
            mersEstimates: data?.mersEstimates,
            faoMersEventData: faoMersEvents
          }
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
      filterUpdateHandlerOverride={(filterUpdateData) => pipe(
        filterUpdateData,
        addActionToSelectedFilters,
        adjustMapPosition,
        ((filterUpdateData) => ({
          ...filterUpdateData,
          state: {
            ...filterUpdateData.state,
            filteredData: filterData(
              filterUpdateData.action.payload.data.mersEstimates,
              filterUpdateData.state.selectedFilters
            ),
            faoMersEventData: filterData(
              filterUpdateData.action.payload.data.faoMersEventData,
              filterUpdateData.state.selectedFilters
            ),
            dataFiltered: true,
          },
        }))
      ).state}
      initialDataFetchHandlerOverride={({ state, action, initialState }) => ({
        ...state,
        filteredData: action.payload.data.mersEstimates,
        faoMersEventData: action.payload.data.faoMersEventData,
        selectedFilters: initialState.selectedFilters,
        dataFiltered: false,
      })}
      filterResetHandlerOverride={({ state, action }) => ({
        ...state,
        filteredData: filterData(action.payload.data.mersEstimates, {}),
        faoMersEventData: filterData(action.payload.data.faoMersEventData, {}),
        selectedFilters: initialMersContextState.selectedFilters,
        dataFiltered: false,
      })}
      dataFetcher={MersDataFetcher}
    >
      <CamelPopulationDataProvider>
        {props.children}
      </CamelPopulationDataProvider>
    </PathogenProviders>
  )
}