"use client";

import React, {
  createContext,
  useReducer,

} from "react";
import mapboxgl from "mapbox-gl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Hydrate as RQHydrate, HydrateProps } from "@tanstack/react-query";
import getQueryClient from "@/components/customs/getQueryClient";


export interface SarsCov2ContextType extends SarsCov2StateType {
  dispatch: React.Dispatch<SarsCov2Action>;
}

interface SarsCov2StateType {
  filteredData: any[];
  selectedFilters: { [key: string]: string[] };
}

interface SarsCov2Action {
  type: SarsCov2ActionType;
  payload: any;
}

export enum SarsCov2ActionType {
  UPDATE_FILTER = "UPDATE_FILTER",
  ADD_FILTERS_TO_MAP = "ADD_FILTERS_TO_MAP",
}

export const initialState: SarsCov2StateType = {
  filteredData: [],
  selectedFilters: {},
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

export function setMapboxFilters(
  filters: { [key: string]: string[] },
  map: mapboxgl.Map | null,
) {
  let mapboxFilters: any = [];

  Object.keys(filters).forEach((filter: string) => {
    const keyFilters: any = [];
    if (filters[filter].length > 0) {
      filters[filter].forEach((filterValue: string) => {
        keyFilters.push(["in", filterValue, ["get", filter]]);
      });
    }
    if (keyFilters.length > 0) mapboxFilters.push(["any", ...keyFilters]);
  });

  if(map?.getLayer("SarsCov2-pins")) map.setFilter("SarsCov2-pins", ["all", ...mapboxFilters]);
}

export const SarsCov2Reducer = (state: SarsCov2StateType, action: SarsCov2Action) => {
  switch (action.type) {
    case SarsCov2ActionType.UPDATE_FILTER:
      const selectedFilters = {
        ...state.selectedFilters,
        [action.payload.filter]: action.payload.value,
      };

      if (action.payload.map) {
        console.log("update filters to map")
        setMapboxFilters(selectedFilters, action.payload.map);
      }

      return {
        ...state,
        filteredData: filterData(action.payload.data, selectedFilters),
        selectedFilters: selectedFilters,
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
  const [state, dispatch] = useReducer(SarsCov2Reducer, initialState);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        cacheTime: Infinity,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <SarsCov2Context.Provider value={{ ...state, dispatch: dispatch }}>
        {children}
      </SarsCov2Context.Provider>
    </QueryClientProvider>
  );
};

export function Hydrate(props: HydrateProps) {
  return <RQHydrate {...props} />;
}
