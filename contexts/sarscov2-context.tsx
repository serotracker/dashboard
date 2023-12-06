"use client";

import React, {
  createContext,
  useReducer,
  useEffect
} from "react";
import { MapProvider } from 'react-map-gl';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Hydrate as RQHydrate, HydrateProps } from "@tanstack/react-query";
import useSarsCov2Data from "@/hooks/useSarsCov2Data";

export interface SarsCov2ContextType extends SarsCov2StateType {
  dispatch: React.Dispatch<SarsCov2Action>;
}

interface SarsCov2StateType {
  filteredData: any[];
  selectedFilters: { [key: string]: string[] };
  initialFetchCompleted: boolean;
}

interface SarsCov2Action {
  type: SarsCov2ActionType;
  payload: any;
}

export enum SarsCov2ActionType {
  UPDATE_FILTER = "UPDATE_FILTER",
  INITIAL_DATA_FETCH = "INITIAL_DATA_FETCH",
  ADD_FILTERS_TO_MAP = "ADD_FILTERS_TO_MAP",
}

export const initialState: SarsCov2StateType = {
  filteredData: [],
  selectedFilters: {},
  initialFetchCompleted: false
};

function filterData(data: any[], filters: { [key: string]: string[] }): any[] {
  const filterKeys = Object.keys(filters);
  return data.filter((item: any) => {
    return filterKeys.every((key: string) => {
      if (!filters[key].length) return true;
      return filters[key].includes(item[key]);
    });
  });
}

export const SarsCov2Reducer = (state: SarsCov2StateType, action: SarsCov2Action) => {
  switch (action.type) {
    case SarsCov2ActionType.UPDATE_FILTER:
      const selectedFilters = {
        ...state.selectedFilters,
        [action.payload.filter]: action.payload.value,
      };

      return {
        ...state,
        filteredData: filterData(action.payload.data, selectedFilters),
        selectedFilters: selectedFilters,
      };
    case SarsCov2ActionType.INITIAL_DATA_FETCH:
      return {
        ...state,
        filteredData: action.payload.data,
        selectedFilters: initialState.selectedFilters,
        initialFetchCompleted: true
      };
    default:
      return state;
  }
};

export const SarsCov2Context = createContext<SarsCov2ContextType>({
  ...initialState,
  dispatch: () => null,
});

export const SarsCov2Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        cacheTime: Infinity,
      },
    },
  })

  return (
    <MapProvider>
      <QueryClientProvider client={queryClient}>
        <FilteredDataProvider>
          {children}
        </FilteredDataProvider>
      </QueryClientProvider>
    </MapProvider>
  );
};

const FilteredDataProvider = ({children}: {children: React.ReactNode}) => {
  const [state, dispatch] = useReducer(SarsCov2Reducer, initialState);
  const dataQuery = useSarsCov2Data();

  useEffect(() => {
    if(
      state.filteredData.length === 0 &&
      !state.initialFetchCompleted &&
      'data' in dataQuery &&
      !!dataQuery.data && typeof dataQuery.data === 'object' &&
      'records' in dataQuery.data && Array.isArray(dataQuery.data.records) &&
      dataQuery.data.records.length > 0
    ) {
      dispatch({
        type: SarsCov2ActionType.INITIAL_DATA_FETCH,
        payload: {data: (dataQuery.data.records)}
      })
    }
  }, [dataQuery]);

  return (
    <SarsCov2Context.Provider value={{ ...state, dispatch: dispatch }}>
      {children}
    </SarsCov2Context.Provider>
  )
}

export function Hydrate(props: HydrateProps) {
  return <RQHydrate {...props} />;
}
