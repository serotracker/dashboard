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
import { MultiSelect } from "@/components/customs/multi-select";
import React, { useContext } from "react";
import { useArboData } from "@/hooks/useArboData";
import SectionHeader from "@/components/customs/SectionHeader";
import { DatePicker } from "@/components/ui/datepicker";
import { parseISO } from "date-fns";
import { useArboFilters } from "@/hooks/useArboFilters";
import { unRegionEnumToLabelMap } from "@/lib/un-regions";
import { Button } from "@/components/ui/button";

interface FieldInformation {
  field: FilterableField;
  label: string;
  valueToLabelMap: Record<string, string | undefined>;
  tooltipContent?: React.ReactNode;
}

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
      <div className="pb-3 flex" key={filter}>
        <DatePicker
          onChange={(date) => {
            const dateString = date?.toISOString();
            addFilterMulti(dateString ? [dateString] : [], filter, state, data);
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
      <div className="pb-3 flex" key={filter}>
        <MultiSelect
          handleOnChange={(value) => addFilterMulti(value, filter, state, data)}
          heading={placeholder}
          selected={state.selectedFilters[filter] ?? []}
          options={sortedOptions}
          optionToLabelMap={optionToLabelMap}
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
  country = "country",
  assay = "assay",
  producer = "producer",
  sampleFrame = "sampleFrame",
  antibody = "antibody",
  pathogen = "pathogen",
  start_date = "start_date",
  end_date = "end_date",
  whoRegion = "whoRegion",
  unRegion = "unRegion"
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

  if(!(selectedAgeGroups.length === 1 && selectedAgeGroups[0] === 'Children and Youth (0-17 years)')) {
    excludedFields.push(FilterableField.pediatricAgeGroup);
  }

  const state = useContext(ArboContext);
  const demographicFilters = [
    {field: FilterableField.ageGroup, label: "Age Group", valueToLabelMap: {}},
    {field: FilterableField.pediatricAgeGroup, label: "Pediatric Age Group", valueToLabelMap: {}},
    {field: FilterableField.sex, label: "Sex", valueToLabelMap: {}},
    {field: FilterableField.sampleFrame, label: "Sample Frame", valueToLabelMap: {}},
  ].filter((fieldInformation) => !excludedFields.includes(fieldInformation.field));
  const studyInformationFilters = [
    {field: FilterableField.assay, label: "Assay", valueToLabelMap: {}},
    {field: FilterableField.producer, label: "Assay Producer", valueToLabelMap: {}},
    {field: FilterableField.whoRegion, label: "WHO Region", valueToLabelMap: {}, tooltipContent:
      <div>
        <p> AFR: African Region </p>
        <p> AMR: Region of the Americas </p>
        <p> EMR: Eastern Mediterranean Region </p>
        <p> EUR: European Region </p>
        <p> SEAR: South-East Asia Region </p>
        <p> WPR: Western Pacific Region </p>
      </div>
    },
    {field: FilterableField.country, label: "Country", valueToLabelMap: {}},
    {field: FilterableField.antibody, label: "Antibody", valueToLabelMap: {}},
    {field: FilterableField.pathogen, label: "Arbovirus", valueToLabelMap: {}},
    {field: FilterableField.unRegion, label: "UN Region", valueToLabelMap: unRegionEnumToLabelMap },
    {field: FilterableField.start_date, label: "Sampling Start Date", valueToLabelMap: {}},
    {field: FilterableField.end_date, label: "Sampling End Date", valueToLabelMap: {}},
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
        <FilterSection
          headerText="Demographic"
          headerTooltipText="Filter on demographic variables, including population group, sex, and age group."
          allFieldInformation={demographicFilters}
          state={state}
          filters={filterData.arbovirusFilterOptions}
          data={data}
        />
        <FilterSection
          headerText="Study Information"
          headerTooltipText="Filter on different types of study based metadata"
          allFieldInformation={studyInformationFilters}
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
