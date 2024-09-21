"use client";

import React, { useContext, useMemo, useState } from "react";
import { GetCountryHighlightingLayerInformationOutput, PathogenMap } from "@/components/ui/pathogen-map/pathogen-map";
import { MapEstimateSummary } from "@/components/ui/pathogen-map/map-estimate-summary";
import { isPopupCountryHighlightLayerContentGeneratorInput } from "@/components/ui/pathogen-map/pathogen-map-popup";
import { AnimalMersEvent, HumanMersEvent, isAnimalMersEvent, isHumanMersEvent, MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { MersCountryPopupContent } from "./mers-country-pop-up-content";
import { HumanMersSeroprevalenceEstimatePopupContent } from "./human-mers-seroprevalence-estimate-pop-up-content";
import { AnimalMersSeroprevalenceEstimatePopupContent } from "./animal-mers-seroprevalence-estimate-pop-up-content";
import { useFaoMersEventData } from "@/hooks/mers/useFaoMersEventData";
import { MersFaoAnimalEventPopupContent } from "./mers-fao-animal-event-pop-up-content";
import { MersFaoHumanEventPopupContent } from "./mers-fao-human-event-pop-up-content";
import assertNever from "assert-never";
import { MersAnimalSpecies, MersDiagnosisStatus, MersEventAnimalSpecies } from "@/gql/graphql";
import {
  MersMapMarkerData,
  isHumanMersSeroprevalenceEstimateMapMarkerData,
  isAnimalMersSeroprevalenceEstimateMapMarkerData,
  isMersFaoAnimalEventMapMarkerData,
  isMersFaoHumanEventMapMarkerData,
  isAnimalMersViralEstimateMapMarkerData,
  isHumanMersViralEstimateMapMarkerData
} from "./shared-mers-map-pop-up-variables";
import { GenericMapPopUpWidth } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { CountryPaintChangeSetting, MapDataPointVisibilityOptions, MersMapCountryHighlightingSettings, useMersMapCustomizationModal } from "./use-mers-map-customization-modal";
import { CamelPopulationDataContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/camel-population-data-context";
import { CountryHighlightLayerLegend } from "@/components/ui/pathogen-map/country-highlight-layers/country-highlight-layer-legend";
import { AnimalMersViralEstimatePopupContent } from "./animal-mers-viral-estimate-pop-up-content";
import { HumanMersViralEstimatePopupContent } from "./human-mers-viral-estimate-pop-up-content";
import { useMersPrimaryEstimates } from "@/hooks/mers/useMersPrimaryEstimates";
import { useMersMapPaint } from "./use-mers-map-paint";
import { useMersMapClusterProperties } from "./use-mers-map-cluster-properties";
import { useMersMapDataPoints } from "./use-mers-map-data-points";
import { CountryDataContext } from "@/contexts/pathogen-context/country-information-context";
import { MersMapStudySubmissionPrompt } from "./mers-map-study-submission-prompt";
import { Card, CardContent } from "@/components/ui/card";

export const MapPinColours = {
  'HumanMersEvent': "#8abded",
  'human-mers-event-alt': "#2a8deb",
  'AnimalMersEvent': "#ed8ac7",
  'animal-mers-event-alt': "#eb2aa1",
  'PrimaryHumanMersSeroprevalenceEstimateInformation': "#e7ed8a",
  'PrimaryAnimalMersSeroprevalenceEstimateInformation': "#13f244",
  'PrimaryHumanMersViralEstimateInformation': "#e37712",
  'PrimaryAnimalMersViralEstimateInformation': "#de141b",
  'mers-animal-viral-estimate-alt': "#910c10",
} as const;

export const MersMap = () => {
  const { filteredData, faoMersEventData } = useContext(MersContext);
  const [ isStudySubmissionPromptVisible, setStudySubmissionPromptVisibility ] = useState(true);
  const { data } = useMersPrimaryEstimates(); 
  const countryDataContext = useContext(CountryDataContext);
  const { faoMersEvents } = useFaoMersEventData();
  const {
    currentMapCountryHighlightingSettings,
    countryPopUpEnabled,
    countryOutlinesSetting,
    mapDataPointVisibilitySetting,
    ...mersMapCustomizationModal
  } = useMersMapCustomizationModal();

  const estimateDataShown = useMemo(() => (
    mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.ESTIMATES_ONLY ||
    mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.EVENTS_AND_ESTIMATES_VISIBLE
  ), [ mapDataPointVisibilitySetting ]);
  const eventDataShown = useMemo(() => (
    mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.EVENTS_ONLY ||
    mapDataPointVisibilitySetting === MapDataPointVisibilityOptions.EVENTS_AND_ESTIMATES_VISIBLE
  ), [ mapDataPointVisibilitySetting ]);

  const { dataPoints } = useMersMapDataPoints({
    filteredData,
    faoMersEventData,
    estimateDataShown,
    eventDataShown
  })

  const { paint, countryHighlightLayerLegendEntries, freeTextEntries } = useMersMapPaint({
    dataPoints,
    faoMersEventData,
    currentMapCountryHighlightingSettings,
    countryOutlinesSetting,
    estimateDataShown,
    eventDataShown
  });

  const { clusteringSettings } = useMersMapClusterProperties({
    estimateDataShown,
    eventDataShown
  })

  if (!data || !faoMersEvents) {
    return <span> Loading... </span>;
  }

  return (
    <>
      <div className={"w-full h-full p-0"}>
        <PathogenMap
          id="mersMap"
          countryPopUpEnabled={countryPopUpEnabled}
          countryPopUpOnHoverEnabled={countryPopUpEnabled}
          allowCountryPopUpsWithEmptyData={false}
          countryDataContext={countryDataContext}
          baseCursor=""
          sourceId="mers-[GENERATED-SOURCE-ID]"
          layers={[
            {
              id: "MERS-pins",
              type: "circle",
              isDataUsedForCountryHighlighting: true,
              cursor: "pointer",
              filter: ["!", ["has", "point_count"]],
              layerPaint: {
                "circle-color": [
                  "match",
                  ["get", "__typename"],
                  "HumanMersEvent",
                  `${MapPinColours['HumanMersEvent']}`,
                  "AnimalMersEvent",
                  `${MapPinColours['AnimalMersEvent']}`,
                  [
                    "match",
                    ["get", "primaryEstimateInfoTypename"],
                    "PrimaryHumanMersSeroprevalenceEstimateInformation",
                    `${MapPinColours['PrimaryHumanMersSeroprevalenceEstimateInformation']}`,
                    "PrimaryHumanMersViralEstimateInformation",
                    `${MapPinColours['PrimaryHumanMersViralEstimateInformation']}`,
                    "PrimaryAnimalMersSeroprevalenceEstimateInformation",
                    `${MapPinColours['PrimaryAnimalMersSeroprevalenceEstimateInformation']}`,
                    "PrimaryAnimalMersViralEstimateInformation",
                    `${MapPinColours['PrimaryAnimalMersViralEstimateInformation']}`,
                    "#FFFFFF"
                  ]
                ],
                "circle-radius": 8,
                "circle-stroke-color": "#333333",
                "circle-stroke-width": 1,
              },
            },
          ]}
          clusteringSettings={clusteringSettings}
          generatePopupContent={(input) => {
            if(isPopupCountryHighlightLayerContentGeneratorInput(input)) {
              return <MersCountryPopupContent
                record={input.data}
                estimateDataShown={estimateDataShown}
                eventDataShown={eventDataShown}
              />
            }

            const mersMarkerData: MersMapMarkerData = input.data;

            if(isHumanMersSeroprevalenceEstimateMapMarkerData(mersMarkerData)) {
              return <HumanMersSeroprevalenceEstimatePopupContent estimate={mersMarkerData} />
            }

            if(isHumanMersViralEstimateMapMarkerData(mersMarkerData)) {
              return <HumanMersViralEstimatePopupContent estimate={mersMarkerData} />
            }

            if(isAnimalMersSeroprevalenceEstimateMapMarkerData(mersMarkerData)) {
              return <AnimalMersSeroprevalenceEstimatePopupContent estimate={mersMarkerData} />
            }

            if(isAnimalMersViralEstimateMapMarkerData(mersMarkerData)) {
              return <AnimalMersViralEstimatePopupContent estimate={mersMarkerData} />
            }

            if(isMersFaoAnimalEventMapMarkerData(mersMarkerData)) {
              return <MersFaoAnimalEventPopupContent event={mersMarkerData} />
            }

            if(isMersFaoHumanEventMapMarkerData(mersMarkerData)) {
              return <MersFaoHumanEventPopupContent event={mersMarkerData} />
            }

            assertNever(mersMarkerData);
          }}
          dataPoints={dataPoints}
          paint={paint}
          />
      </div>
      <MersMapStudySubmissionPrompt
        hidden={!isStudySubmissionPromptVisible}
        onClose={() => setStudySubmissionPromptVisibility(false)}
        className={"absolute bottom-1 left-1 mx-auto w-1/2 text-center bg-white/60 backdrop-blur-md"}
      />
      <CountryHighlightLayerLegend
        className={"absolute bottom-1 right-1 mb-1 bg-white/60 backdrop-blur-md"}
        legendEntries={countryHighlightLayerLegendEntries}
        freeTextEntries={freeTextEntries}
      />
      <MapEstimateSummary filteredData={filteredData.map((estimate) => ({ sourceSheetName: estimate.primaryEstimateInfo.sourceTitle }))}/>
      <div className={"absolute top-12 left-1 p-2 "}>
        <Card className={"mb-1 bg-white/60 backdrop-blur-md"}>
          <CardContent className={"flex w-fit p-2"}>
            <p className={"ml-1 font-medium"}>
              The points on the map represent the number of studies identified in that region.
            </p>
          </CardContent>
        </Card>
      </div>
      <mersMapCustomizationModal.mapCustomizeButton />
      <mersMapCustomizationModal.customizationModal />
    </>
  );
}
