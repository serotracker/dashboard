"use client";

import React, { useContext } from "react";
import { Filters } from "@/components/customs/filters";
import { FilterableField } from "@/components/customs/filters/available-filters";
import { SarsCov2Context } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { useSarsCov2Filters } from "@/hooks/sarscov2/useSarsCov2Filters";
import { useSarsCov2Data } from "@/hooks/sarscov2/use-sars-cov2-data";

interface SarsCov2FiltersProps {
  className?: string;
}

export const SarsCov2Filters = (props: SarsCov2FiltersProps) => {
  const state = useContext(SarsCov2Context);
  const { sarsCov2Estimates } = useSarsCov2Data();
  const { data: filterData } = useSarsCov2Filters();

  const studyScopeFilters = [
    FilterableField.scope,
  ]

  const studyInformationFilters = [
    FilterableField.isWHOUnityAligned,
    FilterableField.riskOfBias,
    FilterableField.sourceType
  ]

  const dateFilters = [
    FilterableField.samplingStartDate,
    FilterableField.samplingEndDate
  ]

  const studyLocationFilters = [
    FilterableField.whoRegion,
    FilterableField.unRegion,
    FilterableField.countryAlphaTwoCode,
  ];

  const demographicFilters = [
    FilterableField.populationGroup,
    FilterableField.sex,
    FilterableField.ageGroup,
  ];

  const testInformationFilters = [
    FilterableField.antibodies,
    FilterableField.testType,
    FilterableField.isotypes
  ];

  const filterSections = [{
    headerText: 'Study Scope',
    headerTooltipText: 'Filter on whether the study is a national study, a regional study, or a local study.',
    includedFilters: studyScopeFilters
  }, {
    headerText: 'Study Information',
    headerTooltipText: 'Filter on study details, including source type (publication, preprint, news, or report), and alignment with the WHO Unity protocol.',
    includedFilters: studyInformationFilters
  }, {
    headerText: 'Date',
    headerTooltipText: 'Filter on sample start and end date.',
    includedFilters: dateFilters
  }, {
    headerText: 'Study Location',
    headerTooltipText: 'Filter on where the study was conducted.',
    includedFilters: studyLocationFilters
  }, {
    headerText: 'Demographic',
    headerTooltipText: 'Filter on demographic variables.',
    includedFilters: demographicFilters
  }, {
    headerText: 'Test Information',
    headerTooltipText: 'Filter according to serological measurement methods.',
    includedFilters: testInformationFilters
  }];

  return (
    <Filters
      className={props.className}
      filterSections={filterSections}
      state={state}
      filterData={
        filterData?.sarsCov2FilterOptions ? {
          whoRegion: filterData.sarsCov2FilterOptions.whoRegion,
          unRegion: filterData.sarsCov2FilterOptions.unRegion,
          ageGroup: filterData.sarsCov2FilterOptions.ageGroup,
          scope: filterData.sarsCov2FilterOptions.scope,
          sex: filterData.sarsCov2FilterOptions.sex,
          populationGroup: filterData.sarsCov2FilterOptions.populationGroup,
          sourceType: filterData.sarsCov2FilterOptions.sourceType,
          riskOfBias: filterData.sarsCov2FilterOptions.riskOfBias,
          antibodies: filterData.sarsCov2FilterOptions.antibodies,
          testType: filterData.sarsCov2FilterOptions.testType,
          isotypes: filterData.sarsCov2FilterOptions.isotypes,
          countryAlphaTwoCode: filterData.sarsCov2FilterOptions.countryIdentifiers.map(({ alphaTwoCode }) => alphaTwoCode)
        } : {}
      }
      data={sarsCov2Estimates ?? []}
      resetAllFiltersButtonEnabled={true}
    />
  )
}