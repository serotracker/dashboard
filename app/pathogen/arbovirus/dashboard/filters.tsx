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
import { useQuery } from "@tanstack/react-query";
import useArboData from "@/hooks/useArboData";
import SectionHeader from "@/components/customs/SectionHeader";

// Function to add or update filters with multiple values
const addFilterMulti = (
  value: string[],
  newFilter: string,
  state: ArboContextType,
  data: any
) => {
  state.dispatch({
    type: ArboActionType.UPDATE_FILTER,
    payload: {
      filter: newFilter,
      value: value,
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
  data: any
) => {
  return (
    <div className="pb-3">
      <MultiSelect
        handleOnChange={(value) => addFilterMulti(value, filter, state, data)}
        heading={placeholder}
        selected={state.selectedFilters[filter] ?? []}
        options={filterOptions.filter((assay: string) => assay != null)}
      />
    </div>
  );
};

export enum FilterableField {
  age_group = "age_group",
  sex = "sex",
  country = "country",
  assay = "assay",
  producer = "producer",
  sample_frame = "sample_frame",
  antibody = "antibody",
  pathogen = "pathogen",
}

interface FilterSectionProps {
  headerText: string;
  headerTooltipText: string;
  state: ArboContextType;
  fields: FilterableField[];
  filters: any;
  data: any;
  filterableFieldToLabelMap: { [key in FilterableField]: string };
}

const FilterSection = ({
  headerText,
  headerTooltipText,
  fields,
  state,
  filterableFieldToLabelMap,
  filters,
  data,
}: FilterSectionProps) => {
  return (
    <div className="p-0">
      <div>
        <SectionHeader
          header_text={headerText}
          tooltip_text={headerTooltipText}
        />
      </div>
      {fields.map((field) => {
        return buildFilterDropdown(
          field,
          filterableFieldToLabelMap[field],
          state,
          filters.data[field],
          data ? data.records : []
        );
      })}
    </div>
  );
};

interface FiltersProps {
  excludedFields?: FilterableField[];
}

export default function Filters({ excludedFields = [] }: FiltersProps) {
  const state = useContext(ArboContext);
  const filterableFieldToLabelMap: { [key in FilterableField]: string } = {
    [FilterableField.age_group]: "Age Group",
    [FilterableField.sex]: "Sex",
    [FilterableField.country]: "Country",
    [FilterableField.assay]: "Assay",
    [FilterableField.producer]: "Assay Producer",
    [FilterableField.sample_frame]: "Sample Frame",
    [FilterableField.antibody]: "Antibody",
    [FilterableField.pathogen]: "Pathogen",
  };
  const demographicFilters = [
    FilterableField.age_group,
    FilterableField.sex,
    FilterableField.country,
  ].filter((field) => !excludedFields.includes(field));
  const studyInformationFilters = [
    FilterableField.assay,
    FilterableField.producer,
    FilterableField.sample_frame,
    FilterableField.antibody,
    FilterableField.pathogen,
  ].filter((field) => !excludedFields.includes(field));

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
              data ? data.records : []
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "sex",
              "Sex",
              state,
              filters.data["sex"],
              data ? data.records : []
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "country",
              "Country",
              state,
              filters.data["country"],
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
              data ? data.records : []
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "producer",
              "Assay Producer",
              state,
              filters.data["producer"],
              data ? data.records : []
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "sample_frame",
              "Sample Frame",
              state,
              filters.data["sample_frame"],
              data ? data.records : []
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "antibody",
              "Antibody",
              state,
              filters.data["antibody"],

              data ? data.records : []
            )}
          </div>
          <div>
            {buildFilterDropdown(
              "pathogen",
              "Pathogen",
              state,
              filters.data["pathogen"],
              data ? data.records : []
            )}
          </div>
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
