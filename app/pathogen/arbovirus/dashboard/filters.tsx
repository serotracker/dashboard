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

import React, { useContext } from "react";
import { useArboData } from "@/hooks/useArboData";
import { useArboFilters } from "@/hooks/useArboFilters";
import { unRegionEnumToLabelMap } from "@/lib/un-regions";
import { MapArbovirusFilter } from "./(map)/MapArbovirusFilter";
import Link from "next/link";
import { 
  ArboContext, ArbovirusEstimate
} from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";
import { PathogenContextActionType, PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { DateFilter } from "@/components/customs/filters/date-filter";
import { SingleSelectFilter } from "@/components/customs/filters/single-select-filter";
import { MultiSelectFilter } from "@/components/customs/filters/multi-select-filter";
import { ResetFiltersButton } from "@/components/customs/filters/reset-filters-button";
import { FilterSection } from "@/components/customs/filters/filter-section";

interface SendFilterChangeDispatchInput {
  value: string[],
  newFilter: string,
  state: PathogenContextType<ArbovirusEstimate>,
  data: any
}

export type SendFilterChangeDispatch = (input: SendFilterChangeDispatchInput) => void;

/**
 * Function to add or update filters with multiple values
 * 
 */
const sendFilterChangeDispatch = (input: SendFilterChangeDispatchInput) => {
  input.state.dispatch({
    type: PathogenContextActionType.UPDATE_FILTER,
    payload: {
      filter: input.newFilter,
      value: input.value,
      data: input.data ? input.data : [],
    },
  });
};

// Function to build a filter dropdown
const buildFilterDropdown = (
  filter: string,
  placeholder: string,
  state: PathogenContextType<ArbovirusEstimate>,
  filterOptions: string[],
  data: any,
  optionToLabelMap: Record<string, string | undefined>,
  tooltipContent: React.ReactNode | undefined,
) => {
  if (
    filter === FilterableField.start_date ||
    filter === FilterableField.end_date
  ) {
    return (
      <DateFilter
        filter={filter}
        placeholder={placeholder}
        tooltipContent={tooltipContent}
        sendFilterChangeDispatch={sendFilterChangeDispatch}
        state={state}
        data={data}
      />
    );
  } else if (filter === FilterableField.esm) {
    return (
      <SingleSelectFilter
        filter={filter}
        placeholder={placeholder}
        tooltipContent={tooltipContent}
        sendFilterChangeDispatch={sendFilterChangeDispatch}
        state={state}
        data={data}
        filterOptions={filterOptions}
        optionToLabelMap={optionToLabelMap}
      />
    )
  } else {
    return (
      <MultiSelectFilter
        filter={filter}
        placeholder={placeholder}
        tooltipContent={tooltipContent}
        sendFilterChangeDispatch={sendFilterChangeDispatch}
        state={state}
        data={data}
        filterOptions={filterOptions}
        optionToLabelMap={optionToLabelMap}
      />
    )
  }
};

export enum FilterableField {
  ageGroup = "ageGroup",
  pediatricAgeGroup = "pediatricAgeGroup",
  sex = "sex",
  esm = "esm",
  whoRegion = "whoRegion",
  unRegion = "unRegion",
  country = "country",
  assay = "assay",
  producer = "producer",
  sampleFrame = "sampleFrame",
  antibody = "antibody",
  pathogen = "pathogen",
  start_date = "start_date",
  end_date = "end_date",
  serotype = "serotype"
}

interface FiltersProps {
  excludedFields?: FilterableField[];
  className?: string;
}

export function Filters(props: FiltersProps) {
  const { selectedFilters } = useContext(ArboContext);

  const excludedFields = props.excludedFields ?? [];

  const selectedAgeGroups = selectedFilters['ageGroup'] ?? [];
  /* If the 0-17 filter is not selected, don't show pediatric age group.*/
  if(!selectedAgeGroups.includes('Children and Youth (0-17 years)')) {
    excludedFields.push(FilterableField.pediatricAgeGroup);
  }
  
  const selectedArboVirus = selectedFilters['pathogen'] ?? [];

  if(!selectedArboVirus.includes("DENV")) {
    excludedFields.push(FilterableField.serotype)
  }

  const state = useContext(ArboContext);

  const dateFilters = [
    {field: FilterableField.start_date, label: "Sampling Start Date", valueToLabelMap: {}, filterRenderingFunction: DateFilter},
    {field: FilterableField.end_date, label: "Sampling End Date", valueToLabelMap: {}, filterRenderingFunction: DateFilter}
  ].filter((fieldInformation) => !excludedFields.includes(fieldInformation.field));

  const isEsmMapSelected = selectedFilters.esm?.length === 1;

  const studyInfoFilters = [
    {field: FilterableField.whoRegion, label: "WHO Region", valueToLabelMap: {}, tooltipContent:
      <div>
        <p> AFR: African Region </p>
        <p> AMR: Region of the Americas </p>
        <p> EMR: Eastern Mediterranean Region </p>
        <p> EUR: European Region </p>
        <p> SEAR: South-East Asia Region </p>
        <p> WPR: Western Pacific Region </p>
      </div>,
      filterRenderingFunction: MultiSelectFilter
    },
    {field: FilterableField.unRegion, label: "UN Region", valueToLabelMap: unRegionEnumToLabelMap, filterRenderingFunction: MultiSelectFilter},
    {field: FilterableField.country, label: "Country", valueToLabelMap: {}, filterRenderingFunction: MultiSelectFilter},
    {field: FilterableField.esm, label: "Environmental Suitability Map", valueToLabelMap: {
      "zika": "Zika 2016",
      "dengue2015": "Dengue 2015",
      "dengue2050": "Dengue 2050 (Projected)",
    }, tooltipContent:
      <p>
       This is a single-select dropdown representing environmental suitability for relevant vector species per pathogen. 
       {isEsmMapSelected && (<p>This map is sourced from this <Link rel="noopener noreferrer" target="_blank" href={isEsmMapSelected ? state.selectedFilters.esm.includes('dengue2015') || state.selectedFilters.esm.includes('dengue2050') ? 'https://doi.org/10.1038/s41564-019-0476-8' : 'http://dx.doi.org/10.7554/eLife.15272.001' : ''} className={"underline hover:text-gray-300"}>article</Link></p>)}
      </p>,
    filterRenderingFunction: SingleSelectFilter
    },
  ].filter((fieldInformation) => !excludedFields.includes(fieldInformation.field));

  const demographicFilters = [
    {field: FilterableField.ageGroup, label: "Age Group", valueToLabelMap: {}, filterRenderingFunction: MultiSelectFilter},
    {field: FilterableField.pediatricAgeGroup, label: "Pediatric Age Group", valueToLabelMap: {}, filterRenderingFunction: MultiSelectFilter},
    {field: FilterableField.sex, label: "Sex", valueToLabelMap: {}, filterRenderingFunction: MultiSelectFilter},
    {field: FilterableField.sampleFrame, label: "Sample Frame", valueToLabelMap: {}, filterRenderingFunction: MultiSelectFilter},
  ].filter((fieldInformation) => !excludedFields.includes(fieldInformation.field));

  const testInformationFilters = [
    {field: FilterableField.assay, label: "Assay", valueToLabelMap: {}, filterRenderingFunction: MultiSelectFilter},
    {field: FilterableField.producer, label: "Assay Producer", valueToLabelMap: {}, filterRenderingFunction: MultiSelectFilter},
    {field: FilterableField.antibody, label: "Antibody", valueToLabelMap: {}, filterRenderingFunction: MultiSelectFilter},
    {field: FilterableField.serotype, label: "Serotype (DENV only)", valueToLabelMap: {}, filterRenderingFunction: MultiSelectFilter}
  ].filter((fieldInformation) => !excludedFields.includes(fieldInformation.field));
  // Fetch arbovirus data using the useArboData hook
  const { data } = useArboData();

  const { data: filterData } = useArboFilters();

  if (filterData) {
    return (
      <div className={props.className}>
        <MapArbovirusFilter 
          data={data} 
          state={state} 
          className={"p-0"} 
        />
        <FilterSection
          headerText="Date"
          headerTooltipText="Filter on sample start and end date."
          allFieldInformation={dateFilters}
          state={state}
          filters={filterData.arbovirusFilterOptions}
          sendFilterChangeDispatch={sendFilterChangeDispatch}
          data={data}
        />
        <FilterSection
          headerText="Study Location"
          headerTooltipText="Filter on where the study was conducted."
          allFieldInformation={studyInfoFilters}
          state={state}
          filters={{...filterData.arbovirusFilterOptions, esm: ["zika", "dengue2015", "dengue2050"]}}
          sendFilterChangeDispatch={sendFilterChangeDispatch}
          data={data}
        />
        <FilterSection
          headerText="Demographic"
          headerTooltipText="Filter on demographic variables, including population group, sex, and age group."
          allFieldInformation={demographicFilters}
          state={state}
          filters={filterData.arbovirusFilterOptions}
          sendFilterChangeDispatch={sendFilterChangeDispatch}
          data={data}
        />
        <FilterSection
          headerText="Test Information"
          headerTooltipText="Filter according to serological measurement methods."
          allFieldInformation={testInformationFilters}
          state={state}
          filters={filterData.arbovirusFilterOptions}
          sendFilterChangeDispatch={sendFilterChangeDispatch}
          data={data}
        />
        <ResetFiltersButton
          state={state}
          data={data}
        />
      </div>
    );
  } else return <div>Filters Loading...</div>;
}
