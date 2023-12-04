/**
 * @file Filters Component
 * @description This component renders a set of filters for the Arboviruses dashboard.
 * It includes dropdowns for age group, sex, country, assay, producer, sample frame, antibody, and pathogen.
 * The filters are dynamically updated based on user interactions and are synchronized with the global state.
 * The component fetches arbovirus data and filter options from the API, rendering the filters once the data is available.
 * It uses the ArboContext to manage global state and interacts with the map using the mapboxgl library.
 *
 *
 * @see contexts/arbo-context.tsx
 * @see hooks/useArboData.tsx
 * @see components/customs/multi-select.tsx
 */

"use client";

import {
  ArboActionType,
  ArboContext,
  ArboContextType,
} from "@/contexts/arbo-context";
import { MultiSelect } from "@/components/customs/multi-select";
import React, { useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import mapboxgl from "mapbox-gl";
import useArboData from "@/hooks/useArboData";
import SectionHeader from "@/components/customs/SectionHeader";

// Function to add or update filters with multiple values
const addFilterMulti = (
  value: string[],
  newFilter: string,
  state: ArboContextType,
  map: mapboxgl.Map | null | undefined,
  data: any
) => {
  state.dispatch({
    type: ArboActionType.UPDATE_FILTER,
    payload: {
      filter: newFilter,
      value: value,
      map: map,
      data: data ? data : [],
    },
  });
};

// Function to build a filter dropdown
const buildFilterDropdown = (
  filter: string,
  placeholder: string,
  state: ArboContextType,
  filterOptions: string[],
  map: mapboxgl.Map | null | undefined,
  data: any
) => {
  return (
    <div className="pb-3">
      <MultiSelect
        handleOnChange={(value) =>
          addFilterMulti(value, filter, state, map, data)
        }
        heading={placeholder}
        selected={state.selectedFilters[filter] ?? []}
        options={filterOptions.filter((assay: string) => assay != null)}
      />
    </div>
  );
};

// Main Filters component
export default function Filters(props: { map?: mapboxgl.Map | null }) {
  // Get the state and map from the context and props
  const state = useContext(ArboContext);
  const { map } = props;

  // Fetch arbovirus data using the useArboData hook
  const { data } = useArboData();

  // Fetch filter options using React Query
  const filters = useQuery({
    queryKey: ["ArbovirusFilters"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/arbo/filter_options`).then(
        (response) => response.json()
      ),
  });

  const resetFilters = () => {
    // Dispatch action to reset filters
    state.dispatch({
      type: ArboActionType.RESET_FILTERS,
      payload: {
        data: data ? data.records : [],
      }, // Include an empty object as payload
    });
  };

  if (filters.isSuccess && !filters.isLoading && !filters.isError) {
    console.debug(filters.data, Object.keys(filters.data));

    return (
      <div>
        <div className="p-0">
          <div className="pb-4">
            <SectionHeader
              header_text={"Demographic"}
              tooltip_text={
                "Filter on demographic variables, including population group, sex, and age group."
              }
            />
          </div>
          <div>
            {buildFilterDropdown(
              "age_group",
              "Age Group",
              state,
              filters.data["age_group"],
              map,
              data ? data.records : []
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "sex",
              "Sex",
              state,
              filters.data["sex"],
              map,
              data ? data.records : []
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "country",
              "Country",
              state,
              filters.data["country"],
              map,
              data ? data.records : []
            )}
          </div>
        </div>
        <div className="p-0">
          <div className="pb-4">
            <SectionHeader
              header_text={"Study Information"}
              tooltip_text={"Filter on different types of study based metadata"}
            />
          </div>
          <div>
            {buildFilterDropdown(
              "assay",
              "Assay",
              state,
              filters.data["assay"],
              map,
              data ? data.records : []
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "producer",
              "Assay Producer",
              state,
              filters.data["producer"],
              map,
              data ? data.records : []
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "sample_frame",
              "Sample Frame",
              state,
              filters.data["sample_frame"],
              map,
              data ? data.records : []
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "antibody",
              "Antibody",
              state,
              filters.data["antibody"],
              map,
              data ? data.records : []
            )}
          </div>
          {!map && (
            <div>
              {buildFilterDropdown(
                "pathogen",
                "Pathogen",
                state,
                filters.data["pathogen"],
                map,
                data ? data.records : []
              )}
            </div>
          )}
        </div>
        <div>
          <button
            className="w-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 font-bold py-2 px-15 rounded"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  } else return <div>Filters Loading...</div>;
}
