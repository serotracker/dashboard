"use client";

import React, { useContext } from "react";
import { Filters } from "@/components/customs/filters";
import { FilterableField } from "@/components/customs/filters/available-filters";
import { useNewSarsCov2Data } from "@/hooks/useNewSarsCov2Data";
import { SarsCov2Context } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { useSarsCov2Filters } from "@/hooks/useSarsCov2Filters";

interface SarsCov2FiltersProps {
  className?: string;
}

export const SarsCov2Filters = (props: SarsCov2FiltersProps) => {
  const state = useContext(SarsCov2Context);
  const { data } = useNewSarsCov2Data();
  const { data: filterData } = useSarsCov2Filters();

  const dateFilters = [
    FilterableField.samplingStartDate,
    FilterableField.samplingEndDate
  ]

  const studyLocationFilters = [
    FilterableField.whoRegion,
    FilterableField.unRegion,
    FilterableField.country,
  ];

  const demographicFilters = [
    FilterableField.ageGroup,
    FilterableField.sex,
    FilterableField.sampleFrame
  ];

  const testInformationFilters = [
    FilterableField.scope,
    FilterableField.sourceType,
    FilterableField.antibodies,
    FilterableField.testType,
    FilterableField.isotypes
  ];

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
      filterData={filterData?.sarsCov2FilterOptions}
      data={data}
      resetAllFiltersButtonEnabled={true}
    />
  )
}