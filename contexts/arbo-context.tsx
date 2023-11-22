"use client";

import React, {
  createContext,
  useReducer,

} from "react";
import mapboxgl from "mapbox-gl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Hydrate as RQHydrate, HydrateProps } from "@tanstack/react-query";
import getQueryClient from "@/components/customs/getQueryClient";
import {
  CountryBoundingBox,
  combineCountryBoundingBoxes,
  getBoundingBoxFromCountryName,
} from "@/lib/country-bounding-boxes";

export interface ArboContextType extends ArboStateType {
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
  ADD_FILTERS_TO_MAP = "ADD_FILTERS_TO_MAP",
}

export const initialState: ArboStateType = {
  filteredData: [],
  selectedFilters: {
    ["pathogen"]: ["DENV", "ZIKV", "CHIKV", "YF", "WNV", "MAYV"],
  },
};

function filterData(data: any[], filters: { [key: string]: string[] }): any[] {
  const filterKeys = Object.keys(filters);
  return data.filter((item: any) => {
    return filterKeys.every((key: string) => {
      if (!filters[key].length) return true;
      if(key === "antibody") {
        return item["antibodies"].some((element: string) => filters[key].includes(element));
      } else {
        if (Array.isArray(item[key])) {
          // If item[key] is an array, check if any element of item[key] is included in filters[key]
          return item[key].some((element: string) => filters[key].includes(element));
        } else {
          // If item[key] is a string, check if it's included in filters[key]
          return filters[key].includes(item[key]);
        }
      }
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
      if(filter === "antibody") {
        filters["antibody"].forEach((antibody: string) => {
          keyFilters.push([">", ["index-of", antibody, ["get", "antibody"]], -1]);
        });
      } else {
        filters[filter].forEach((filterValue: string) => {
          keyFilters.push(["in", filterValue, ["get", filter]]);
        });
      }
    }
    if (keyFilters.length > 0) mapboxFilters.push(["any", ...keyFilters]);
  });

  console.log("Map Filters: ", ["all", ...mapboxFilters]);
  if(map?.getLayer("Arbovirus-pins")) map?.setFilter("Arbovirus-pins", ["all", ...mapboxFilters]);
}

export const arboReducer = (state: ArboStateType, action: ArboAction) => {
  switch (action.type) {
    case ArboActionType.UPDATE_FILTER:
      const selectedFilters = {
        ...state.selectedFilters,
        [action.payload.filter]: action.payload.value,
      };

      if (action.payload.map) {
        setMapboxFilters(selectedFilters, action.payload.map);

        adjustMapPositionIfCountryFilterHasChanged(action);
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

const adjustMapPositionIfCountryFilterHasChanged = (
  action: ArboAction
): void => {
  if (action.payload.filter === "country") {
    const allSelectedCountryBoundingBoxes = action.payload.value
      .map((countryName: string) => getBoundingBoxFromCountryName(countryName))
      .filter((boundingBox: CountryBoundingBox) => !!boundingBox);

    if(allSelectedCountryBoundingBoxes.length === 0) {
      action.payload.map.fitBounds([-180, -90, 180, 90]);

      return;
    }

    const boundingBoxToMoveMapTo = combineCountryBoundingBoxes(
      allSelectedCountryBoundingBoxes
    );

    action.payload.map.fitBounds(boundingBoxToMoveMapTo);
  }
};

export const ArboContext = createContext<ArboContextType>({
  ...initialState,
  dispatch: (obj) => {console.log("dispatch not initialized", obj)},
});

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

export function Hydrate(props: HydrateProps) {
  return <RQHydrate {...props} />;
}
