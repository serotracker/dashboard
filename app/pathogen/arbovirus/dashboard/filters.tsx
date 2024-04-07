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
} from "@/contexts/arbo-context/arbo-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Select } from "@/components/customs/select";
import React, { useContext } from "react";
import { useArboData } from "@/hooks/useArboData";
import SectionHeader from "@/components/customs/SectionHeader";
import { DatePicker } from "@/components/ui/datepicker";
import { parseISO } from "date-fns";
import { useArboFilters } from "@/hooks/useArboFilters";
import { unRegionEnumToLabelMap } from "@/lib/un-regions";
import { Button } from "@/components/ui/button";
import { MapArbovirusFilter } from "./(map)/MapArbovirusFilter";
import { cn } from "@/lib/utils";

interface FieldInformation {
  field: FilterableField;
  label: string;
  valueToLabelMap: Record<string, string | undefined>;
  tooltipContent?: React.ReactNode;
}

/**
 * Function to add or update filters with multiple values
 * 
 */
const sendFilterChangeDispatch = (
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

interface FieldTooltipProps {
  tooltipContent: React.ReactNode,
  className?: string,
}

const FilterTooltip = (props: FieldTooltipProps): React.ReactNode => {
  return (
    <div className={props.className}>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="h-5 w-5 text-gray-500 cursor-pointer"
            >
              &#9432;
            </div>
          </TooltipTrigger>
          <TooltipContent
            style={{
              position: "absolute",
              top: "50px", // position below the trigger
              left:"-120px",
              minWidth: "230px",
              paddingTop: 0,
              paddingBottom: 0,
            }}
          >
            <div
              className="bg-background w-full h-full p-4 rounded text-white"
            >
              {props.tooltipContent}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

// Function to build a filter dropdown
const buildFilterDropdown = (
  filter: string,
  placeholder: string,
  state: ArboContextType,
  filterOptions: string[],
  data: any,
  optionToLabelMap: Record<string, string | undefined>,
  tooltipContent: React.ReactNode | undefined,
) => {
  const sortedOptions = filterOptions
    ? filterOptions
        .filter((assay: string | null): assay is string => assay !== null)
        .sort()
    : [];
  if (
    filter === FilterableField.start_date ||
    filter === FilterableField.end_date
  ) {
    return (
      <div className="pb-3 flex w-1/2 md:w-1/3 lg:w-full px-2 lg:px-0" key={filter}>
        <DatePicker
          onChange={(date) => {
            const dateString = date?.toISOString();
            sendFilterChangeDispatch(dateString ? [dateString] : [], filter, state, data);
          }}
          labelText={placeholder}
          date={
            state.selectedFilters[filter] &&
            state.selectedFilters[filter].length > 0
              ? parseISO(state.selectedFilters[filter][0])
              : undefined
          }
          clearDateFilter={() => {
            state.dispatch({
              type: ArboActionType.UPDATE_FILTER,
              payload: {
                filter: filter,
                value: [],
                data: data ? data : [],
              },
            });
          }}
        />
        {tooltipContent && <FilterTooltip className='pl-2' tooltipContent={tooltipContent} />}
      </div>
    );
  } else {
    return (
      <div className="pb-3 flex w-1/2 md:w-1/3 lg:w-full px-2 lg:px-0" key={filter}>
        <Select
          handleOnChange={(value) => sendFilterChangeDispatch(value, filter, state, data)}
          heading={placeholder}
          selected={state.selectedFilters[filter] ?? []}
          options={sortedOptions}
          optionToLabelMap={optionToLabelMap}
          singleSelect={filter === FilterableField.esm}
        />
        {tooltipContent && <FilterTooltip className='pl-2' tooltipContent={tooltipContent} />}
      </div>
    );
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

interface FilterSectionProps {
  headerText: string;
  headerTooltipText: string;
  state: ArboContextType;
  allFieldInformation: FieldInformation[];
  filters: any;
  data: any;
}

const FilterSection = ({
  headerText,
  headerTooltipText,
  allFieldInformation,
  state,
  filters,
  data,
}: FilterSectionProps) => {
  return (
    <div className="p-0">
        <SectionHeader
          header_text={headerText}
          tooltip_text={headerTooltipText}
        />
        <div className="flex flex-row lg:flex-col flex-wrap">
        {allFieldInformation.map((fieldInformation) => {
        return buildFilterDropdown(
          fieldInformation.field,
          fieldInformation.label,
          state,
          filters[fieldInformation.field],
          data ? data.arbovirusEstimates : [],
          fieldInformation.valueToLabelMap,
          fieldInformation.tooltipContent
        );
      })}
        </div>
    </div>
  );
};

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
    {field: FilterableField.start_date, label: "Sampling Start Date", valueToLabelMap: {}},
    {field: FilterableField.end_date, label: "Sampling End Date", valueToLabelMap: {}}
  ].filter((fieldInformation) => !excludedFields.includes(fieldInformation.field));

  const studyInfoFilters = [
    {field: FilterableField.whoRegion, label: "WHO Region", valueToLabelMap: {}, tooltipContent:
      <div>
        <p> AFR: African Region </p>
        <p> AMR: Region of the Americas </p>
        <p> EMR: Eastern Mediterranean Region </p>
        <p> EUR: European Region </p>
        <p> SEAR: South-East Asia Region </p>
        <p> WPR: Western Pacific Region </p>
      </div>},
    {field: FilterableField.unRegion, label: "UN Region", valueToLabelMap: unRegionEnumToLabelMap },
    {field: FilterableField.country, label: "Country", valueToLabelMap: {}},
    {field: FilterableField.esm, label: "Environmental Suitability Map", valueToLabelMap: {
      "zika": "Zika",
      "dengue2015": "Dengue 2015",
      "dengue2050": "Dengue 2050 (Projected)",
    }, tooltipContent:
      <p>
        This is a single select dropdown. Selecting any one of the options will display the corresponding environmental suitability map. Additionally it will also filter the data to only show estimates for the respective pathogen.
      </p>},
  ].filter((fieldInformation) => !excludedFields.includes(fieldInformation.field));

  const demographicFilters = [
    {field: FilterableField.ageGroup, label: "Age Group", valueToLabelMap: {}},
    {field: FilterableField.pediatricAgeGroup, label: "Pediatric Age Group", valueToLabelMap: {}},
    {field: FilterableField.sex, label: "Sex", valueToLabelMap: {}},
    {field: FilterableField.sampleFrame, label: "Sample Frame", valueToLabelMap: {}},
  ].filter((fieldInformation) => !excludedFields.includes(fieldInformation.field));

  const testInformationFilters = [
    {field: FilterableField.assay, label: "Assay", valueToLabelMap: {}},
    {field: FilterableField.producer, label: "Assay Producer", valueToLabelMap: {}},
    {field: FilterableField.antibody, label: "Antibody", valueToLabelMap: {}},
    {field: FilterableField.serotype, label: "Serotype (DENV only)", valueToLabelMap: {}}
  ].filter((fieldInformation) => !excludedFields.includes(fieldInformation.field));
  // Fetch arbovirus data using the useArboData hook
  const { data } = useArboData();

  const { data: filterData } = useArboFilters();

  const resetFilters = () => {
    // Dispatch action to reset filters
    state.dispatch({
      type: ArboActionType.RESET_FILTERS,
      payload: {
        data: data ? data.arbovirusEstimates : [],
      }, // Include an empty object as payload
    });
  };

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
          data={data}
        />
        <FilterSection
          headerText="Study Location"
          headerTooltipText="Filter on where the study was conducted."
          allFieldInformation={studyInfoFilters}
          state={state}
          filters={{...filterData.arbovirusFilterOptions, esm: ["zika", "dengue2015", "dengue2050"]}}
          data={data}
        />
        <FilterSection
          headerText="Demographic"
          headerTooltipText="Filter on demographic variables, including population group, sex, and age group."
          allFieldInformation={demographicFilters}
          state={state}
          filters={filterData.arbovirusFilterOptions}
          data={data}
        />
        <FilterSection
          headerText="Test Information"
          headerTooltipText="Filter on information related to what the study measured."
          allFieldInformation={testInformationFilters}
          state={state}
          filters={filterData.arbovirusFilterOptions}
          data={data}
        />
        <div>
          <Button
            className="w-full"
            onClick={resetFilters}
            variant={"outline"}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    );
  } else return <div>Filters Loading...</div>;
}
