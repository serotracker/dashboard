"use client";

import React, { useContext } from "react";
import { Filters } from "@/components/customs/filters";
import { FilterableField } from "@/components/customs/filters/available-filters";
import { MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { useMersData } from "@/hooks/mers/useMersData";
import { useMersFilters } from "@/hooks/mers/useMersFilters";
import { useFaoMersEventData } from "@/hooks/mers/useFaoMersEventData";
import { useFaoMersEventFilterOptions } from "@/hooks/mers/useFaoMersEventFilterOptions";
import { useMersEstimatesFilterOptions } from "@/hooks/mers/useMersEstimatesFilters";

interface MersFiltersProps {
  className?: string;
}

export const MersFilters = (props: MersFiltersProps) => {
  const state = useContext(MersContext);
  const { data } = useMersData();
  const { faoMersEvents } = useFaoMersEventData();
  const { data: sharedFilterData } = useMersFilters();
  const { data: eventFilterData } = useFaoMersEventFilterOptions();
  const { data: estimateFilterData } = useMersEstimatesFilterOptions();

  const dataTypeFilters = [
    FilterableField.__typename,
  ];

  const studyLocationFilters = [
    FilterableField.whoRegion,
    FilterableField.unRegion,
    FilterableField.countryAlphaTwoCode,
  ];

  const seroprevalenceEstimateFilters = [
    FilterableField.sourceType,
    FilterableField.ageGroup,
    FilterableField.assay,
    FilterableField.specimenType,
    FilterableField.sex,
    FilterableField.isotypes
  ];

  const humanAndAnimalCaseFilters = [
    FilterableField.diagnosisSource,
  ];

  const animalCaseFilters = [
    FilterableField.animalType,
    FilterableField.animalSpecies,
  ];

  const filterSections = [{
    headerText: 'Data Type',
    headerTooltipText: 'Choose what kind of data you would like to see (seroprevalence estimates, viral estimates, positive cases).',
    includedFilters: dataTypeFilters
  }, {
    headerText: 'Location',
    headerTooltipText: 'Filter on where the study was conducted or the event occurred.',
    includedFilters: studyLocationFilters
  }, {
    headerText: 'Seroprevalence and Viral Estimates',
    headerTooltipText: 'Filters that only apply to seroprevalence and viral estimates.',
    includedFilters: seroprevalenceEstimateFilters
  }, {
    headerText: 'Human and Animal Cases',
    headerTooltipText: 'Filters that only apply to both human and animal confirmed cases.',
    includedFilters: humanAndAnimalCaseFilters
  }, {
    headerText: 'Animal Data',
    headerTooltipText: 'Filters that only apply to animal seroprevalence and viral estimates as well as animal cases.',
    includedFilters: animalCaseFilters
  }];

  return (
    <Filters
      className={props.className}
      filterSections={filterSections}
      state={state}
      filterData={{
        ...(sharedFilterData?.mersFilterOptions ? {
          __typename: [
            "HumanMersEstimate",
            "HumanMersViralEstimate",
            "AnimalMersEstimate",
            "AnimalMersViralEstimate",
            "AnimalMersEvent",
            "HumanMersEvent"
          ],
          whoRegion: sharedFilterData.mersFilterOptions.whoRegion,
          unRegion: sharedFilterData.mersFilterOptions.unRegion,
          countryAlphaTwoCode: sharedFilterData.mersFilterOptions.countryIdentifiers.map(({ alphaTwoCode }) => alphaTwoCode)
        } : {}),
        ...(estimateFilterData?.mersEstimatesFilterOptions ? {
          sourceType: estimateFilterData.mersEstimatesFilterOptions.sourceType,
          ageGroup: estimateFilterData.mersEstimatesFilterOptions.ageGroup,
          assay: estimateFilterData.mersEstimatesFilterOptions.assay,
          specimenType: estimateFilterData.mersEstimatesFilterOptions.specimenType,
          sex: estimateFilterData.mersEstimatesFilterOptions.sex,
          isotypes: estimateFilterData.mersEstimatesFilterOptions.isotypes
        } : {}),
        ...(eventFilterData?.faoMersEventFilterOptions ? {
          diagnosisSource: eventFilterData.faoMersEventFilterOptions.diagnosisSource,
          animalType: eventFilterData.faoMersEventFilterOptions.animalType,
          animalSpecies: eventFilterData.faoMersEventFilterOptions.animalSpecies,
        } : {})
      }}
      data={{
        mersEstimates: data?.mersEstimates_V2 ?? [],
        faoMersEventData: faoMersEvents ?? [],
      }}
      resetAllFiltersButtonEnabled={true}
    />
  )
}