"use client";

import React, { useContext } from "react";
import { Filters } from "@/components/customs/filters";
import { FilterableField } from "@/components/customs/filters/available-filters";
import { MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { useMersData } from "@/hooks/mers/useMersData";
import { useMersFilters } from "@/hooks/mers/useMersFilters";

interface MersFiltersProps {
  className?: string;
}

export const MersFilters = (props: MersFiltersProps) => {
  const state = useContext(MersContext);
  const { data } = useMersData();
  const { data: filterData } = useMersFilters();

  const studyLocationFilters = [
    FilterableField.whoRegion,
    FilterableField.countryAlphaTwoCode,
  ];

  const filterSections = [{
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
          whoRegion: filterData.mersFilterOptions.whoRegion,
          countryAlphaTwoCode: filterData.mersFilterOptions.countryIdentifiers.map(({ alphaTwoCode }) => alphaTwoCode)
        } : {}
      }
      data={data?.mersEstimates ?? []}
      resetAllFiltersButtonEnabled={true}
    />
  )
}