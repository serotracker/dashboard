"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "../toast-provider";
import { MapProvider, MapRef, useMap } from "react-map-gl";
import { Context, createContext, useEffect, useReducer } from "react";
import { filterData } from "./filter-update-steps/apply-new-selected-filters";
import { handleFilterUpdate } from "./filter-update-steps";
import { useArboData } from "@/hooks/useArboData";

export interface PathogenContextType extends PathogenContextState {
  dispatch: React.Dispatch<PathogenContextAction>;
}

export interface PathogenContextState {
  filteredData: any[];
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

export const pathogenReducer = (
  state: PathogenContextState,
  action: PathogenContextAction,
  initialState: PathogenContextState,
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

interface PathogenProvidersProps {
  children: React.ReactNode;
  initialState: PathogenContextState
  context: Context<PathogenContextType>
}

export const PathogenProviders = (props: PathogenProvidersProps) => {
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
          <FilteredDataProvider initialState={props.initialState} context={props.context}>
            {props.children}
          </FilteredDataProvider>
        </QueryClientProvider>
      </MapProvider>
    </ToastProvider>
  );
};

interface FilteredDataProviderProps {
  children: React.ReactNode;
  initialState: PathogenContextState;
  context: Context<PathogenContextType>
}

const FilteredDataProvider = (props: FilteredDataProviderProps) => {
  const { arboMap } = useMap();
  const [state, dispatch] = useReducer(
    (state: PathogenContextState, action: PathogenContextAction) =>
      pathogenReducer(state, action, props.initialState, arboMap),
    props.initialState
  );
  const dataQuery = useArboData();

  useEffect(() => {
    if (
      state.filteredData.length === 0 &&
      !state.dataFiltered &&
      "data" in dataQuery &&
      !!dataQuery.data &&
      typeof dataQuery.data === "object" &&
      "arbovirusEstimates" in dataQuery.data &&
      Array.isArray(dataQuery.data.arbovirusEstimates) &&
      dataQuery.data.arbovirusEstimates.length > 0
    ) {
      dispatch({
        type: PathogenContextActionType.INITIAL_DATA_FETCH,
        payload: { data: dataQuery.data.arbovirusEstimates },
      });
    }
  }, [dataQuery]);

  return (
    <props.context.Provider value={{ ...state, dispatch: dispatch }}>
      {props.children}
    </props.context.Provider>
  );
};