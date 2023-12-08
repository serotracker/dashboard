"use client";

import React, { createContext, useReducer, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { MapProvider, MapRef, useMap } from "react-map-gl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Hydrate as RQHydrate, HydrateProps } from "@tanstack/react-query";
import {
  CountryBoundingBox,
  combineCountryBoundingBoxes,
  getBoundingBoxFromCountryName,
} from "@/lib/country-bounding-boxes";
import useArboData from "@/hooks/useArboData";
import { parse } from "date-fns";

export interface ArboContextType extends ArboStateType {
  dispatch: React.Dispatch<ArboAction>;
}
interface ArboStateType {
  filteredData: any[];
  selectedFilters: { [key: string]: string[] };
  dataFiltered: boolean;
}
interface ArboAction {
  type: ArboActionType;
  payload: any;
}
export enum ArboActionType {
  UPDATE_FILTER = "UPDATE_FILTER",
  INITIAL_DATA_FETCH = "INITIAL_DATA_FETCH",
  ADD_FILTERS_TO_MAP = "ADD_FILTERS_TO_MAP",
  RESET_FILTERS = "RESET_FILTERS",
}

export const initialState: ArboStateType = {
  filteredData: [],
  selectedFilters: {
    ["pathogen"]: ["DENV", "ZIKV", "CHIKV", "YF", "WNV", "MAYV"],
  },
  dataFiltered: false,
};

function filterData(data: any[], filters: { [key: string]: string[] }): any[] {
  const filterKeys = Object.keys(filters);
  console.log("Filtering data...");
  console.log("DATA COMING IN...", data);
  console.log("FILTERS SELECTED COMING IN...", filters);
  return data.filter((item: any) => {
    return filterKeys.every((key: string) => {
      if (!filters[key].length) return true;

      if (key === "start_date") {
        const filterStartDate = parse(
          filters["start_date"][0],
          "dd/MM/yyyy",
          new Date()
        );

        const itemDate = new Date(item.sample_start_date);
        // Set day to 1 to ignore the day component
        // filterStartDate.setUTCDate(1);
        // filterStartDate.setUTCHours(0, 0, 0, 0);
        // Set day to 1 to ignore the day component
        // itemDate.setUTCDate(1);
        // itemDate.setUTCHours(0, 0, 0, 0);

        console.log("PARSED FILTER START DATE: ", filterStartDate);
        console.log("PARSED ITEM START DATE: ", itemDate);

        
        const filterStartUTC = Date.UTC(
          filterStartDate.getUTCFullYear(),
          filterStartDate.getUTCMonth(),
        );

        const itemDateUTC = Date.UTC(
          itemDate.getUTCFullYear(),
          itemDate.getUTCMonth(),
        );


        console.log("FILTER START DATE: ", filterStartUTC)
        console.log("START DATE RETURN: ", itemDateUTC >= filterStartUTC)
        // return itemDate >= filterStartDate;
        return itemDateUTC >= filterStartUTC;
      }

      if (key === "end_date") {
        const filterEndDate = parse(
          filters["end_date"][0],
          "dd/MM/yyyy",
          new Date()
        );
        const itemDate = new Date(item.sample_end_date);
        // Set day to 1 to ignore the day component
        // filterEndDate.setUTCDate(1);
        // filterEndDate.setUTCHours(0, 0, 0, 0);
        // Set day to 1 to ignore the day component
        // itemDate.setUTCDate(1);
        // itemDate.setUTCHours(0, 0, 0, 0);

        const filterEndUTC = Date.UTC(
          filterEndDate.getUTCFullYear(),
          filterEndDate.getUTCMonth(),
        );

        const itemDateUTC = Date.UTC(
          itemDate.getUTCFullYear(),
          itemDate.getUTCMonth(),
        );
        

        console.log("FILTER END DATE: ", filterEndUTC)
        console.log("END DATE RETURN: ", itemDateUTC <= filterEndUTC)
        // return itemDate <= filterEndDate;
        return itemDateUTC <= filterEndUTC;
      }

      if (key === "antibody") {
        return item["antibodies"].some((element: string) =>
          filters[key].includes(element)
        );
      } else {
        if (Array.isArray(item[key])) {
          // If item[key] is an array, check if any element of item[key] is included in filters[key]
          return item[key].some((element: string) =>
            filters[key].includes(element)
          );
        } else {
          // If item[key] is a string, check if it's included in filters[key]
          return filters[key].includes(item[key]);
        }
      }
    });
  });
}


export const arboReducer = (
  state: ArboStateType,
  action: ArboAction,
  map: MapRef | undefined
) => {
  switch (action.type) {
    case ArboActionType.UPDATE_FILTER:
      const selectedFilters = {
        ...state.selectedFilters,
        [action.payload.filter]: action.payload.value,
      };

      if (map) {
        adjustMapPositionIfCountryFilterHasChanged(action, map);
      }
      console.log("Data filters", action.payload.filter);
      console.log("Data before filtration", state.filteredData);
      console.log(
        "Data after filtration",
        filterData(action.payload.data, selectedFilters)
      );
      return {
        ...state,
        filteredData: filterData(action.payload.data, selectedFilters),
        selectedFilters: selectedFilters,
        dataFiltered: true,
      };
    case ArboActionType.INITIAL_DATA_FETCH:
      return {
        ...state,
        filteredData: action.payload.data,
        selectedFilters: initialState.selectedFilters,
        dataFiltered: false,
      };
    case ArboActionType.RESET_FILTERS:
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

const adjustMapPositionIfCountryFilterHasChanged = (
  action: ArboAction,
  map: MapRef
): void => {
  if (action.payload.filter === "country") {
    const allSelectedCountryBoundingBoxes = action.payload.value
      .map((countryName: string) => getBoundingBoxFromCountryName(countryName))
      .filter((boundingBox: CountryBoundingBox) => !!boundingBox);

    if (allSelectedCountryBoundingBoxes.length === 0) {
      map.fitBounds([-180, -90, 180, 90]);

      return;
    }

    const boundingBoxToMoveMapTo = combineCountryBoundingBoxes(
      allSelectedCountryBoundingBoxes
    );

    map.fitBounds(boundingBoxToMoveMapTo);
  }
};

export const ArboContext = createContext<ArboContextType>({
  ...initialState,
  dispatch: (obj) => {
    console.log("dispatch not initialized", obj);
  },
});

export const ArboProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        cacheTime: Infinity,
      },
    },
  });

  return (
    <MapProvider>
      <QueryClientProvider client={queryClient}>
        <FilteredDataProvider>{children}</FilteredDataProvider>
      </QueryClientProvider>
    </MapProvider>
  );
};

const FilteredDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { arboMap } = useMap();
  const [state, dispatch] = useReducer(
    (state: ArboStateType, action: ArboAction) =>
      arboReducer(state, action, arboMap),
    initialState
  );
  const dataQuery = useArboData();

  useEffect(() => {
    if (
      state.filteredData.length === 0 &&
      !state.dataFiltered &&
      "data" in dataQuery &&
      !!dataQuery.data &&
      typeof dataQuery.data === "object" &&
      "records" in dataQuery.data &&
      Array.isArray(dataQuery.data.records) &&
      dataQuery.data.records.length > 0
    ) {
      dispatch({
        type: ArboActionType.INITIAL_DATA_FETCH,
        payload: { data: dataQuery.data.records },
      });
    }
  }, [dataQuery]);

  return (
    <ArboContext.Provider value={{ ...state, dispatch: dispatch }}>
      {children}
    </ArboContext.Provider>
  );
};

export function Hydrate(props: HydrateProps) {
  return <RQHydrate {...props} />;
}
