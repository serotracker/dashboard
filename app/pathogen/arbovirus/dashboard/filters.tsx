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
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";
import { Filters } from "@/components/customs/filters";
import { FilterableField } from "@/components/customs/filters/available-filters";

interface ArbovirusFiltersProps {
  className?: string;
}

export const ArbovirusFilters = (props: ArbovirusFiltersProps) => {
  const state = useContext(ArboContext);
  const { data } = useArboData();
  const { data: filterData } = useArboFilters();

  const selectedAgeGroups = state.selectedFilters['ageGroup'] ?? [];
  const selectedArboviruses = state.selectedFilters['pathogen'] ?? [];

  const dateFilters = [
    FilterableField.start_date,
    FilterableField.end_date
  ]

  const studyLocationFilters = [
    FilterableField.whoRegion,
    FilterableField.unRegion,
    FilterableField.countryAlphaTwoCode,
    FilterableField.esm,
  ];

  const demographicFilters = [
    FilterableField.ageGroup,
    FilterableField.pediatricAgeGroup,
    FilterableField.sex,
    FilterableField.sampleFrame
  ].filter((field) => {
    /* If the 0-17 filter is not selected, don't show pediatric age group.*/
    if(
      field === FilterableField.pediatricAgeGroup && !(
        selectedAgeGroups.length === 1 &&
        selectedAgeGroups[0] === 'Children and Youth (0-17 years)'
      )
    ) {
      return false;
    }

    return true;
  });

  const testInformationFilters = [
    FilterableField.assay,
    FilterableField.producer,
    FilterableField.antibody,
    FilterableField.serotype
  ].filter((field) => {
    if(!selectedArboviruses.includes('DENV') && field === FilterableField.serotype) {
      return false;
    }

    return true;
  });

  const filterSections = [{
    headerText: 'Date',
    headerTooltipText: 'Filter on sample start and end date.',
    includedFilters: dateFilters
  }, {
    headerText: 'Study Location',
    headerTooltipText: 'Filter on where the study was conducted.',
    includedFilters: studyLocationFilters
  }, {
    headerText: 'Demographic',
    headerTooltipText: 'Filter on demographic variables, including population group, sex, and age group.',
    includedFilters: demographicFilters
  }, {
    headerText: 'Test Information',
    headerTooltipText: 'Filter according to serological measurement methods.',
    includedFilters: testInformationFilters
  }];

  return (
    <Filters
      className={props.className}
      includedFilters={[ FilterableField.pathogen ]}
      filterSections={filterSections}
      state={state}
      filterData={filterData?.arbovirusFilterOptions ? {
        whoRegion: filterData.arbovirusFilterOptions.whoRegion,
        unRegion: filterData.arbovirusFilterOptions.unRegion,
        countryAlphaTwoCode: filterData.arbovirusFilterOptions.countryIdentifiers.map(({ alphaTwoCode }) => alphaTwoCode),
        esm: [
          'dengue2015',
          'dengue2050',
          'zika'
        ],
        ageGroup: filterData.arbovirusFilterOptions.ageGroup,
        sex: filterData.arbovirusFilterOptions.sex,
        sampleFrame: filterData.arbovirusFilterOptions.sampleFrame,
        assay: filterData.arbovirusFilterOptions.assay,
        producer: filterData.arbovirusFilterOptions.producer,
        antibody: filterData.arbovirusFilterOptions.antibody,
        serotype: filterData.arbovirusFilterOptions.serotype,
      } : {}}
      data={data?.arbovirusEstimates ?? []}
      resetAllFiltersButtonEnabled={true}
    />
  )
}