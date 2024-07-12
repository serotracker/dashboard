"use client";
import { QueryClient, QueryClientProvider, UseQueryResult } from "@tanstack/react-query";
import { ToastProvider } from "../toast-provider";
import { MapProvider, MapRef, useMap } from "react-map-gl";
import React, { Context, Dispatch, useReducer } from "react";
import { filterData } from "./filter-update-steps/apply-new-selected-filters";
import { handleFilterUpdate } from "./filter-update-steps";
import { CountryInformationProvider } from "./country-information-context";

export type PathogenContextType<
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
> = TPathogenContextState & {
  dispatch: React.Dispatch<PathogenContextAction>;
}

export interface PathogenContextState<TData extends Record<string, unknown>> {
  filteredData: TData[];
  selectedFilters: { [key: string]: string[] };
  dataFiltered: boolean;
}

export interface PathogenContextAction {
  type: PathogenContextActionType;
  payload: any;
}

export enum PathogenContextActionType {
  UPDATE_FILTER = "UPDATE_FILTER",
  INITIAL_DATA_FETCH = "INITIAL_DATA_FETCH",
  ADD_FILTERS_TO_MAP = "ADD_FILTERS_TO_MAP",
  RESET_FILTERS = "RESET_FILTERS",
}

interface PathogenReducerInput <
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
> {
  state: TPathogenContextState,
  action: PathogenContextAction,
  initialState: TPathogenContextState,
  map: MapRef | undefined
  filterUpdateHandlerOverride?: PathogenContextActionHandler<TData, TPathogenContextState>;
  initialDataFetchHandlerOverride?: PathogenContextActionHandler<TData, TPathogenContextState>;
  filterResetHandlerOverride?: PathogenContextActionHandler<TData, TPathogenContextState>;
}

interface PathogenContextActionHandlerInput<
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
> {
  state: TPathogenContextState,
  action: PathogenContextAction,
  initialState: TPathogenContextState,
  map: MapRef | undefined
}
type PathogenContextActionHandlerOutput<
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
> = TPathogenContextState;
type PathogenContextActionHandler<
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
> = (
  input: PathogenContextActionHandlerInput<TData, TPathogenContextState>
) => PathogenContextActionHandlerOutput<TData, TPathogenContextState>

export const pathogenReducer = <
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
>(input: PathogenReducerInput<TData, TPathogenContextState>): TPathogenContextState => {
  const { state, action, initialState, map } = input;

  switch (action.type) {
    case PathogenContextActionType.UPDATE_FILTER:
      return input.filterUpdateHandlerOverride
        ? input.filterUpdateHandlerOverride({
          state,
          action,
          initialState,
          map
        }) : handleFilterUpdate({
          state,
          action,
          map
        }).state;
    case PathogenContextActionType.INITIAL_DATA_FETCH:
      return input.initialDataFetchHandlerOverride 
        ? input.initialDataFetchHandlerOverride({
          state,
          action,
          initialState,
          map
        }) : {
          ...state,
          filteredData: action.payload.data,
          selectedFilters: initialState.selectedFilters,
          dataFiltered: false,
        };
    case PathogenContextActionType.RESET_FILTERS:
      return input.filterResetHandlerOverride
        ? input.filterResetHandlerOverride({
          state,
          action,
          initialState,
          map
        }) : {
          ...state,
          filteredData: filterData(action.payload.data, {}),
          selectedFilters: initialState.selectedFilters,
          dataFiltered: false,
        };

    default:
      return state;
  }
};

interface PathogenProvidersProps<
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
> {
  children: React.ReactNode;
  mapId: string;
  dataFetcher: (props: PathogenDataFetcherProps<TData, TPathogenContextState>) => React.ReactNode;
  countryDataProvider: (props: {children: React.ReactNode}) => React.ReactNode;
  initialState: TPathogenContextState
  context: Context<PathogenContextType<TData, TPathogenContextState>>
  filterUpdateHandlerOverride?: PathogenContextActionHandler<TData, TPathogenContextState>;
  initialDataFetchHandlerOverride?: PathogenContextActionHandler<TData, TPathogenContextState>;
  filterResetHandlerOverride?: PathogenContextActionHandler<TData, TPathogenContextState>;
}

export const PathogenProviders = <
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
>(props: PathogenProvidersProps<TData, TPathogenContextState>) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        gcTime: Infinity
      },
    },
  });

  return (
    <ToastProvider>
      <MapProvider>
        <QueryClientProvider client={queryClient}>
          <FilteredDataProvider
            initialState={props.initialState}
            context={props.context}
            mapId={props.mapId}
            dataFetcher={props.dataFetcher}
            filterUpdateHandlerOverride={props.filterUpdateHandlerOverride}
            initialDataFetchHandlerOverride={props.initialDataFetchHandlerOverride}
            filterResetHandlerOverride={props.filterResetHandlerOverride}
          >
            <props.countryDataProvider>
              <CountryInformationProvider>
                {props.children}
              </CountryInformationProvider>
            </props.countryDataProvider>
          </FilteredDataProvider>
        </QueryClientProvider>
      </MapProvider>
    </ToastProvider>
  );
};

export interface PathogenDataFetcherProps<
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
> {
  children: React.ReactNode;
  dispatch: Dispatch<PathogenContextAction>;
  state: TPathogenContextState;
}

interface FilteredDataProviderProps<
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
> {
  mapId: string;
  children: React.ReactNode;
  dataFetcher: (props: PathogenDataFetcherProps<TData, TPathogenContextState>) => React.ReactNode;
  initialState: TPathogenContextState;
  context: Context<PathogenContextType<TData, TPathogenContextState>>;
  filterUpdateHandlerOverride?: PathogenContextActionHandler<TData, TPathogenContextState>;
  initialDataFetchHandlerOverride?: PathogenContextActionHandler<TData, TPathogenContextState>;
  filterResetHandlerOverride?: PathogenContextActionHandler<TData, TPathogenContextState>;
}

const FilteredDataProvider = <
  TData extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TData>
>(props: FilteredDataProviderProps<TData, TPathogenContextState>) => {
  const allMaps = useMap();
  const [state, dispatch] = useReducer(
    (state: TPathogenContextState, action: PathogenContextAction) =>
      pathogenReducer({
        state,
        action,
        initialState: props.initialState,
        map: allMaps[props.mapId],
        filterUpdateHandlerOverride: props.filterUpdateHandlerOverride,
        initialDataFetchHandlerOverride: props.initialDataFetchHandlerOverride,
        filterResetHandlerOverride: props.filterResetHandlerOverride
      }),
    props.initialState
  );

  return (
    <props.dataFetcher state={state} dispatch={dispatch}>
      <props.context.Provider value={{ ...state, dispatch: dispatch }}>
        {props.children}
      </props.context.Provider>
    </props.dataFetcher>
  );
};