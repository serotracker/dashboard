"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "../toast-provider";
import { MapProvider, MapRef, useMap } from "react-map-gl";
import React, { Context, Dispatch, createContext, useEffect, useReducer } from "react";
import { filterData } from "./filter-update-steps/apply-new-selected-filters";
import { handleFilterUpdate } from "./filter-update-steps";
import { useArboData } from "@/hooks/useArboData";

export interface PathogenContextType<TData extends Record<string, unknown>> extends PathogenContextState<TData> {
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


export const pathogenReducer = <TData extends Record<string, unknown>>(
  state: PathogenContextState<TData>,
  action: PathogenContextAction,
  initialState: PathogenContextState<TData>,
  map: MapRef | undefined
) => {
  switch (action.type) {
    case PathogenContextActionType.UPDATE_FILTER:
      return handleFilterUpdate({
        state,
        action,
        map
      }).state;
    case PathogenContextActionType.INITIAL_DATA_FETCH:
      return {
        ...state,
        filteredData: action.payload.data,
        selectedFilters: initialState.selectedFilters,
        dataFiltered: false,
      };
    case PathogenContextActionType.RESET_FILTERS:
      return {
        ...state,
        filteredData: filterData(action.payload.data, {}),
        selectedFilters: initialState.selectedFilters,
        dataFiltered: false,
      };

    default:
      return state;
  }
};

interface PathogenProvidersProps<TData extends Record<string, unknown>> {
  children: React.ReactNode;
  mapId: string;
  dataFetcher: (props: PathogenDataFetcherProps<TData>) => React.ReactNode;
  initialState: PathogenContextState<TData>
  context: Context<PathogenContextType<TData>>
}

export const PathogenProviders = <TData extends Record<string, unknown>>(props: PathogenProvidersProps<TData>) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        cacheTime: Infinity,
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
          >
            {props.children}
          </FilteredDataProvider>
        </QueryClientProvider>
      </MapProvider>
    </ToastProvider>
  );
};

export interface PathogenDataFetcherProps<TData extends Record<string, unknown>> {
  children: React.ReactNode;
  dispatch: Dispatch<PathogenContextAction>;
  state: PathogenContextState<TData>;
}

interface FilteredDataProviderProps<TData extends Record<string, unknown>> {
  mapId: string;
  children: React.ReactNode;
  dataFetcher: (props: PathogenDataFetcherProps<TData>) => React.ReactNode;
  initialState: PathogenContextState<TData>;
  context: Context<PathogenContextType<TData>>
}

const FilteredDataProvider = <TData extends Record<string, unknown>>(props: FilteredDataProviderProps<TData>) => {
  const allMaps = useMap();
  const [state, dispatch] = useReducer(
    (state: PathogenContextState<TData>, action: PathogenContextAction) =>
      pathogenReducer(state, action, props.initialState, allMaps[props.mapId]),
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