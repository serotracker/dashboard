"use client";

import React, { useContext } from "react";
import { Filters } from "@/components/customs/filters";
import { FilterableField } from "@/components/customs/filters/available-filters";
import { MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { useMersData } from "@/hooks/mers/useMersData";
import { useMersFilters } from "@/hooks/mers/useMersFilters";
import { useFaoMersEventData } from "@/hooks/mers/useFaoMersEventData";

interface MersFiltersProps {
  className?: string;
}

export const MersFilters = (props: MersFiltersProps) => {
  const state = useContext(MersContext);
  const { data } = useMersData();
  const { faoMersEvents } = useFaoMersEventData();
  const { data: filterData } = useMersFilters();

  const dataTypeFilters = [
    FilterableField.__typename,
  ];

  const studyLocationFilters = [
    FilterableField.whoRegion,
    FilterableField.countryAlphaTwoCode,
  ];

  const filterSections = [{
    headerText: 'Data Type',
    headerTooltipText: 'Choose whether or not you would like to see seroprevalence estimates or events.',
    includedFilters: dataTypeFilters
  }, {
    headerText: 'Study Location',
    headerTooltipText: 'Filter on where the study was conducted.',
    includedFilters: studyLocationFilters
  }];

  return (
    <Filters
      className={props.className}
      filterSections={filterSections}
      state={state}
      filterData={
        filterData?.mersFilterOptions ? {
          __typename: [
            "MersEstimate",
            "AnimalMersEvent",
            "HumanMersEvent"
          ],
          whoRegion: filterData.mersFilterOptions.whoRegion,
          countryAlphaTwoCode: filterData.mersFilterOptions.countryIdentifiers.map(({ alphaTwoCode }) => alphaTwoCode)
        } : {}
      }
      data={{
        mersEstimates: data?.mersEstimates ?? [],
        faoMersEventData: faoMersEvents ?? [],
      } as any}
      resetAllFiltersButtonEnabled={true}
    />
  )
}