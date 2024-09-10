"use client";

import React, { useContext, useMemo } from "react";
import { Filters, FilterSectionConfiguration } from "@/components/customs/filters";
import { MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { useMersFilters } from "@/hooks/mers/useMersFilters";
import { useFaoMersEventData } from "@/hooks/mers/useFaoMersEventData";
import { useFaoMersEventFilterOptions } from "@/hooks/mers/useFaoMersEventFilterOptions";
import { useMersEstimatesFilterOptions } from "@/hooks/mers/useMersEstimatesFilters";
import { useMersPrimaryEstimates } from "@/hooks/mers/useMersPrimaryEstimates";
import { FilterableField } from "@/components/customs/filters/available-filters";
import { MersMapCustomizationsContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/map-customizations-context";
import { MapDataPointVisibilityOptions, MersMapCountryHighlightingSettings } from "./(map)/use-mers-map-customization-modal";

interface MersFiltersProps {
  className?: string;
}

const dataTypeFilters = [
  FilterableField.__typename,
];

const studyLocationFilters = [
  FilterableField.whoRegion,
  FilterableField.unRegion,
  FilterableField.countryAlphaTwoCode,
];

const seroprevalenceEstimateFilters = [
  FilterableField.samplingStartDate,
  FilterableField.samplingEndDate,
  FilterableField.samplingMethod,
  FilterableField.assay,
  FilterableField.specimenType,
  FilterableField.sex,
  FilterableField.isotypes,
  FilterableField.antigen
];

const humanEstimatesFilters = [
  FilterableField.ageGroup,
  FilterableField.sampleFrame,
  FilterableField.exposureToCamels
]

const animalEstimatesFilters = [
  FilterableField.animalDetectionSettings,
  FilterableField.animalImportedOrLocal
]

const humanAndAnimalCaseFilters = [
  FilterableField.diagnosisSource,
];

const animalCaseFilters = [
  FilterableField.animalType,
  FilterableField.animalSpecies,
];

export const MersFilters = (props: MersFiltersProps) => {
  const state = useContext(MersContext);
  const { mapDataPointVisibilitySetting, currentMapCountryHighlightingSettings } = useContext(MersMapCustomizationsContext);
  const { data } = useMersPrimaryEstimates();
  const { faoMersEvents } = useFaoMersEventData();
  const { data: sharedFilterData } = useMersFilters();
  const { data: eventFilterData } = useFaoMersEventFilterOptions();
  const { data: estimateFilterData } = useMersEstimatesFilterOptions();

  const selectedDataTypes = useMemo(() => {
    return state.selectedFilters['__typename'];
  }, [ state ]);

  const filterSections = useMemo(() => {
    const filterSectionsArray: FilterSectionConfiguration[] = [];

    const areEstimatesVisibleOnMap = 
      mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.ESTIMATES_ONLY ||
      mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.EVENTS_AND_ESTIMATES_VISIBLE;
    const areEventsVisibleOnMap = 
      mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.EVENTS_ONLY ||
      mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.EVENTS_AND_ESTIMATES_VISIBLE ||
      currentMapCountryHighlightingSettings === MersMapCountryHighlightingSettings.MERS_HUMAN_CASES ||
      currentMapCountryHighlightingSettings === MersMapCountryHighlightingSettings.MERS_ANIMAL_CASES;
    const areHumanEstimatesVisibleOnMap =
      areEstimatesVisibleOnMap && (
        selectedDataTypes.includes('PrimaryHumanMersSeroprevalenceEstimateInformation') ||
        selectedDataTypes.includes('PrimaryHumanMersViralEstimateInformation')
      );
    const areAnimalEstimatesVisibleOnMap =
      areEstimatesVisibleOnMap && (
        selectedDataTypes.includes('PrimaryAnimalMersSeroprevalenceEstimateInformation') ||
        selectedDataTypes.includes('PrimaryAnimalMersSeroprevalenceEstimateInformation')
      );
    const areHumanEventsVisibleOnMap =
      areEventsVisibleOnMap &&
      selectedDataTypes.includes('HumanMersEvent');
    const areAnimalEventsVisibleOnMap =
      areEventsVisibleOnMap &&
      selectedDataTypes.includes('AnimalMersEvent');

    filterSectionsArray.push({
      headerText: 'Data Type',
      headerTooltipText: 'Choose what kind of data you would like to see (seroprevalence estimates, viral estimates, positive cases).',
      includedFilters: dataTypeFilters
    });

    filterSectionsArray.push({
      headerText: 'Location',
      headerTooltipText: 'Filter on where the study was conducted or the event occurred.',
      includedFilters: studyLocationFilters
    });

    if(
      areHumanEstimatesVisibleOnMap ||
      areAnimalEstimatesVisibleOnMap 
    ) {
      filterSectionsArray.push({
        headerText: 'Seroprevalence and Viral Estimates',
        headerTooltipText: 'Filters that only apply to seroprevalence and viral estimates.',
        includedFilters: seroprevalenceEstimateFilters
      });
    }

    if(areHumanEstimatesVisibleOnMap) {
      filterSectionsArray.push({
        headerText: 'Human Estimates',
        headerTooltipText: 'Filters that only apply to human seroprevalence and viral estimates.',
        includedFilters: humanEstimatesFilters
      });
    }

    if(
      areHumanEventsVisibleOnMap ||
      areAnimalEventsVisibleOnMap
    ) {
      filterSectionsArray.push({
        headerText: 'Animal Estimates',
        headerTooltipText: 'Filters that only apply to animal seroprevalence and viral estimates.',
        includedFilters: animalEstimatesFilters
      });
    }

    if(areEventsVisibleOnMap) {
      filterSectionsArray.push({
        headerText: 'Confirmed Cases',
        headerTooltipText: 'Filters that only apply to confirmed cases.',
        includedFilters: humanAndAnimalCaseFilters
      });
    }

    if(
      areAnimalEstimatesVisibleOnMap ||
      areAnimalEventsVisibleOnMap
    ) {
      filterSectionsArray.push({
        headerText: 'Animal Data',
        headerTooltipText: 'Filters that only apply to animal seroprevalence and viral estimates as well as animal cases.',
        includedFilters: animalCaseFilters
      });
    }

    return filterSectionsArray;
  }, [ mapDataPointVisibilitySetting, currentMapCountryHighlightingSettings, selectedDataTypes ]);

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
          antigen: estimateFilterData.mersEstimatesFilterOptions.antigen,
          exposureToCamels: estimateFilterData.mersEstimatesFilterOptions.exposureToCamels,
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