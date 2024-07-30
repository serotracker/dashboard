"use client";

import React, { useContext } from "react";
import { Filters } from "@/components/customs/filters";
import { MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { useMersFilters } from "@/hooks/mers/useMersFilters";
import { useFaoMersEventData } from "@/hooks/mers/useFaoMersEventData";
import { useFaoMersEventFilterOptions } from "@/hooks/mers/useFaoMersEventFilterOptions";
import { useMersEstimatesFilterOptions } from "@/hooks/mers/useMersEstimatesFilters";
import { useMersPrimaryEstimates } from "@/hooks/mers/useMersPrimaryEstimates";
import { FilterableField } from "@/components/customs/filters/available-filters";

interface MersFiltersProps {
  className?: string;
}

export const MersFilters = (props: MersFiltersProps) => {
  const state = useContext(MersContext);
  const { data } = useMersPrimaryEstimates();
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
    FilterableField.samplingStartDate,
    FilterableField.samplingEndDate,
    FilterableField.samplingMethod,
    FilterableField.assay,
    FilterableField.specimenType,
    FilterableField.sex,
    FilterableField.isotypes
  ];

  const humanEstimatesFilters = [
    FilterableField.ageGroup,
    FilterableField.sampleFrame
  ]

  const animalEstimatesFilters = [
    FilterableField.animalDetectionSettings,
    FilterableField.animalPurpose,
    FilterableField.animalImportedOrLocal
  ]

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
    headerText: 'Human Estimates',
    headerTooltipText: 'Filters that only apply to human seroprevalence and viral estimates.',
    includedFilters: humanEstimatesFilters
  }, {
    headerText: 'Animal Estimates',
    headerTooltipText: 'Filters that only apply to animal seroprevalence and viral estimates.',
    includedFilters: animalEstimatesFilters
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
            "PrimaryHumanMersSeroprevalenceEstimateInformation",
            "PrimaryHumanMersViralEstimateInformation",
            "PrimaryAnimalMersSeroprevalenceEstimateInformation",
            "PrimaryAnimalMersViralEstimateInformation",
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
          isotypes: estimateFilterData.mersEstimatesFilterOptions.isotypes,
          samplingMethod: estimateFilterData.mersEstimatesFilterOptions.samplingMethod,
          sampleFrame: estimateFilterData.mersEstimatesFilterOptions.sampleFrame,
          geographicScope: estimateFilterData.mersEstimatesFilterOptions.geographicScope,
          testProducer: estimateFilterData.mersEstimatesFilterOptions.testProducer,
          testValidation: estimateFilterData.mersEstimatesFilterOptions.testValidation,
          animalDetectionSettings: estimateFilterData.mersEstimatesFilterOptions.animalDetectionSettings,
          animalPurpose: estimateFilterData.mersEstimatesFilterOptions.animalPurpose,
          animalImportedOrLocal: estimateFilterData.mersEstimatesFilterOptions.animalImportedOrLocal,
        } : {}),
        ...(eventFilterData?.faoMersEventFilterOptions ? {
          diagnosisSource: eventFilterData.faoMersEventFilterOptions.diagnosisSource,
          animalType: eventFilterData.faoMersEventFilterOptions.animalType,
          animalSpecies: eventFilterData.faoMersEventFilterOptions.animalSpecies,
        } : {})
      }}
      data={{
        mersEstimates: data?.mersPrimaryEstimates ?? [],
        faoMersEventData: faoMersEvents ?? [],
      }}
      resetAllFiltersButtonEnabled={true}
    />
  )
}