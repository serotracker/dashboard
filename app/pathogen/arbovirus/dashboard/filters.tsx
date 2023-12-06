"use client";

import {
  ArboActionType,
  ArboContext,
  ArboContextType,
} from "@/contexts/arbo-context";
import { MultiSelect } from "@/components/customs/multi-select";
import React, { useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useArboData from "@/hooks/useArboData";

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
  headerText: _,
  headerTooltipText: __,
  fields,
  state,
  filterableFieldToLabelMap,
  filters,
  data,
}: FilterSectionProps) => {
  return (
    <div className="p-0">
      {/*<div>*/}
      {/*    <SectionHeader*/}
      {/*        header_text={headerText}*/}
      {/*        tooltip_text={headerTooltipText}
      {/*    />*/}
      {/*</div>*/}
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
    [FilterableField.pathogen]: "Arbovirus",
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

  const { data } = useArboData();

  const filters = useQuery({
    queryKey: ["ArbovirusFilters"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/arbo/filter_options`).then(
        (response) => response.json()
      ),
  });

  if (filters.isSuccess && !filters.isLoading && !filters.isError) {
    console.debug(filters.data, Object.keys(filters.data));

    return (
      <div>
        <FilterSection
          headerText="Demographic"
          headerTooltipText="Filter on demographic variables, including population group, sex, and age group."
          fields={demographicFilters}
          state={state}
          filters={filters}
          data={data}
          filterableFieldToLabelMap={filterableFieldToLabelMap}
        />
        <FilterSection
          headerText="Study Information"
          headerTooltipText="Filter on different types of study based metadata"
          fields={studyInformationFilters}
          state={state}
          filters={filters}
          data={data}
          filterableFieldToLabelMap={filterableFieldToLabelMap}
        />
      </div>
    );
  } else return <div>Filters Loading...</div>;
}
