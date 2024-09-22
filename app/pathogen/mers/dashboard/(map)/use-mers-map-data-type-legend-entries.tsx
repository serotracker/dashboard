import { useContext, useMemo } from "react";
import {
  isAnimalMersEvent,
  isAnimalMersSeroprevalenceEstimate,
  isAnimalMersViralEstimate,
  isHumanMersEvent,
  isHumanMersSeroprevalenceEstimate,
  isHumanMersViralEstimate,
  MersContext
} from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { MapDataPointVisibilityOptions } from "./use-mers-map-customization-modal";
import { MapPinColours } from "./mers-map";

interface UseMersMapDataTypeLegendEntriesInput {
  mapDataPointVisibilitySetting: MapDataPointVisibilityOptions;
}

export const useMersMapDataTypeLegendEntries = (
  input: UseMersMapDataTypeLegendEntriesInput
) => {
  const { mapDataPointVisibilitySetting } = input;
  const { filteredData, faoMersEventData } = useContext(MersContext)

  const hasHumanMersSeroprevalenceEstimates = useMemo(() => (
    filteredData.filter((estimate) => isHumanMersSeroprevalenceEstimate(estimate)).length > 0 && (
      mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.ESTIMATES_ONLY ||
      mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.EVENTS_AND_ESTIMATES_VISIBLE
    )
  ), [ filteredData, mapDataPointVisibilitySetting ]);

  const hasHumanMersViralEstimates = useMemo(() => (
    filteredData.filter((estimate) => isHumanMersViralEstimate(estimate)).length > 0 && (
      mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.ESTIMATES_ONLY ||
      mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.EVENTS_AND_ESTIMATES_VISIBLE
    )
  ), [ filteredData, mapDataPointVisibilitySetting ]);

  const hasAnimalMersSeroprevalenceEstimates = useMemo(() => (
    filteredData.filter((estimate) => isAnimalMersSeroprevalenceEstimate(estimate)).length > 0 && (
      mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.ESTIMATES_ONLY ||
      mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.EVENTS_AND_ESTIMATES_VISIBLE
    )
  ), [ filteredData, mapDataPointVisibilitySetting ]);

  const hasAnimalMersViralEstimates = useMemo(() => (
    filteredData.filter((estimate) => isAnimalMersViralEstimate(estimate)).length > 0 && (
      mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.ESTIMATES_ONLY ||
      mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.EVENTS_AND_ESTIMATES_VISIBLE
    )
  ), [ filteredData, mapDataPointVisibilitySetting ]);

  const hasHumanMersEvents = useMemo(() => (
    faoMersEventData.filter((event) => isHumanMersEvent(event)).length > 0 && (
      mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.EVENTS_ONLY ||
      mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.EVENTS_AND_ESTIMATES_VISIBLE
    )
  ), [ faoMersEventData, mapDataPointVisibilitySetting ]);

  const hasAnimalMersEvents = useMemo(() => (
    faoMersEventData.filter((event) => isAnimalMersEvent(event)).length > 0 && (
      mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.EVENTS_ONLY ||
      mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.EVENTS_AND_ESTIMATES_VISIBLE
    )
  ), [ faoMersEventData, mapDataPointVisibilitySetting ]);

  const dataTypeLayerLegendEntries = [
    ...(hasHumanMersSeroprevalenceEstimates ? [{
      description: 'Human Seroprevalence Estimate',
      colour: MapPinColours['PrimaryHumanMersSeroprevalenceEstimateInformation']
    }] : []),
    ...(hasHumanMersViralEstimates ? [{
      description: 'Human Viral Estimate',
      colour: MapPinColours['PrimaryHumanMersViralEstimateInformation']
    }] : []),
    ...(hasHumanMersEvents ? [{
      description: 'Confirmed Human Case',
      colour: MapPinColours['HumanMersEvent']
    }] : []),
    ...(hasAnimalMersSeroprevalenceEstimates ? [{
      description: 'Animal Seroprevalence Estimate',
      colour: MapPinColours['PrimaryAnimalMersSeroprevalenceEstimateInformation']
    }] : []),
    ...(hasAnimalMersViralEstimates ? [{
      description: 'Animal Viral Estimate',
      colour: MapPinColours['PrimaryAnimalMersViralEstimateInformation']
    }] : []),
    ...(hasAnimalMersEvents ? [{
      description: 'Confirmed Animal Case',
      colour: MapPinColours['AnimalMersEvent']
    }] : []),
  ];
  
  return {
    dataTypeLayerLegendEntries
  }
}