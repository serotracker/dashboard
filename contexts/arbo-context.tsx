"use client";

import React, { createContext, ReducerWithoutAction, useReducer } from "react";
import mapboxgl from "mapbox-gl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ArboContext extends ArboStateType {
  dispatch: React.Dispatch<ArboAction>;
}
interface ArboStateType {
  filteredData: any[];
  selectedFilters: { [key: string]: string[] };
}
interface ArboAction {
  type: ArboActionType;
  payload: any;
}
export enum ArboActionType {
  UPDATE_FILTER = "UPDATE_FILTER",
  SET_DATA = "SET_DATA",
  SET_FILTERS = "SET_FILTERS",
}

export const initialState: ArboStateType = {
  filteredData: [],
  selectedFilters: {},
};
export const ArboContext = createContext<ArboContext | null>(null);

function filterData(data: any[], filters: { [key: string]: string[] }): any[] {
  const filterKeys = Object.keys(filters);
  return data.filter((item: any) => {
    return filterKeys.every((key: string) => {
      if (!filters[key].length) return true;
      return filters[key].includes(item[key]);
    });
  });
}

function setMapboxFilters(
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

  console.log("Map Filters: ", ["all", ...mapboxFilters]);
  map?.setFilter("arbo-pins", ["all", ...mapboxFilters]);
}

export const arboReducer = (state: ArboStateType, action: ArboAction) => {
  switch (action.type) {
    case ArboActionType.SET_FILTERS:
      return {
        ...state,
        selectedFilters: action.payload.filters,
      };
    case ArboActionType.UPDATE_FILTER:
      const selectedFilters = {
        ...state.selectedFilters,
        [action.payload.filter]: action.payload.value,
      };
      setMapboxFilters(selectedFilters, action.payload.map);

      return {
        ...state,
        filteredData: filterData(action.payload.data, selectedFilters),
        selectedFilters: selectedFilters,
      };

    default:
      return state;
  }
};

export const ArboProviders = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(arboReducer, initialState);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        cacheTime: Infinity,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ArboContext.Provider value={{ ...state, dispatch: dispatch }}>
        {children}
      </ArboContext.Provider>
    </QueryClientProvider>
  );
};
