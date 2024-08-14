"use client";

import React, { useContext, useMemo } from "react";
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
import { CountryPaintChangeSetting, MersMapCountryHighlightingSettings, useMersMapCustomizationModal } from "./use-mers-map-customization-modal";
import { useDataPointPresentLayer } from "@/components/ui/pathogen-map/country-highlight-layers/data-point-present-layer";
import { CamelPopulationDataContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/camel-population-data-context";
import { useTotalCamelPopulationLayer } from "./country-highlight-layers/total-camel-population-layer";
import { useCamelsPerCapitaLayer } from "./country-highlight-layers/camels-per-capita-layer";
import { CountryHighlightLayerLegend } from "@/components/ui/pathogen-map/country-highlight-layers/country-highlight-layer-legend";
import { AnimalMersViralEstimatePopupContent } from "./animal-mers-viral-estimate-pop-up-content";
import { HumanMersViralEstimatePopupContent } from "./human-mers-viral-estimate-pop-up-content";
import { useMersPrimaryEstimates } from "@/hooks/mers/useMersPrimaryEstimates";
import { useMersReportedHumanCasesMapLayer } from "./country-highlight-layers/mers-reported-human-cases-map-layer";
import { useMersReportedAnimalCasesMapLayer } from "./country-highlight-layers/mers-reported-animal-cases-map-layer";

const MapPinColours = {
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
  const { latestFaoCamelPopulationDataPointsByCountry } = useContext(CamelPopulationDataContext);
  const { data } = useMersPrimaryEstimates(); 
  const { faoMersEvents } = useFaoMersEventData();
  const {
    currentMapCountryHighlightingSettings,
    countryPopUpEnabled,
    countryOutlinesSetting,
    ...mersMapCustomizationModal
  } = useMersMapCustomizationModal();

  const dataPointPresentMapLayer = useDataPointPresentLayer();
  const totalCamelPopulationMapLayer = useTotalCamelPopulationLayer();
  const camelsPerCapitaMapLayer = useCamelsPerCapitaLayer();
  const reportedMersHumanCasesMapLayer = useMersReportedHumanCasesMapLayer();
  const reportedMersAnimalCasesMapLayer = useMersReportedAnimalCasesMapLayer();

  const dataPoints = useMemo(() => [
    ...filteredData.map((element) => ({
      ...element,
      country: element.primaryEstimateInfo.country,
      countryAlphaThreeCode: element.primaryEstimateInfo.countryAlphaThreeCode,
      countryAlphaTwoCode: element.primaryEstimateInfo.countryAlphaTwoCode,
      latitude: element.primaryEstimateInfo.latitude,
      longitude: element.primaryEstimateInfo.longitude,
      primaryEstimateInfoTypename: element.primaryEstimateInfo.__typename
    })),
    ...(faoMersEventData.map((element) => ({
      ...element,
      country: element.country.name,
      countryAlphaThreeCode: element.country.alphaThreeCode,
      countryAlphaTwoCode: element.country.alphaTwoCode,
      primaryEstimateInfoTypename: 'N/A'
    }))
    .filter((element) => element.diagnosisStatus === MersDiagnosisStatus.Confirmed)
  )], [filteredData, faoMersEventData]);

  const { paint, countryHighlightLayerLegendEntries, freeTextEntries } = useMemo((): GetCountryHighlightingLayerInformationOutput => {
    if(currentMapCountryHighlightingSettings === MersMapCountryHighlightingSettings.EVENTS_AND_ESTIMATES) {
      const countryOutlinesEnabled = (countryOutlinesSetting === CountryPaintChangeSetting.ALWAYS_ENABLED || countryOutlinesSetting === CountryPaintChangeSetting.WHEN_RECOMMENDED);

      return dataPointPresentMapLayer.getCountryHighlightingLayerInformation({
        data: dataPoints,
        countryHighlightingEnabled: true,
        countryOutlinesEnabled
      });
    }
    if(currentMapCountryHighlightingSettings === MersMapCountryHighlightingSettings.TOTAL_CAMEL_POPULATION) {
      const countryOutlinesEnabled = (countryOutlinesSetting === CountryPaintChangeSetting.ALWAYS_ENABLED || countryOutlinesSetting === CountryPaintChangeSetting.WHEN_RECOMMENDED);

      return totalCamelPopulationMapLayer.getCountryHighlightingLayerInformation({
        data: latestFaoCamelPopulationDataPointsByCountry ?? [],
        countryOutlineData: dataPoints,
        countryOutlinesEnabled
      });
    }
    if(currentMapCountryHighlightingSettings === MersMapCountryHighlightingSettings.CAMELS_PER_CAPITA) {
      const countryOutlinesEnabled = (countryOutlinesSetting === CountryPaintChangeSetting.ALWAYS_ENABLED || countryOutlinesSetting === CountryPaintChangeSetting.WHEN_RECOMMENDED);

      return camelsPerCapitaMapLayer.getCountryHighlightingLayerInformation({
        data: latestFaoCamelPopulationDataPointsByCountry ?? [],
        countryOutlineData: dataPoints,
        countryOutlinesEnabled
      });
    }
    if(currentMapCountryHighlightingSettings === MersMapCountryHighlightingSettings.MERS_HUMAN_CASES) {
      const countryOutlinesEnabled = (countryOutlinesSetting === CountryPaintChangeSetting.ALWAYS_ENABLED || countryOutlinesSetting === CountryPaintChangeSetting.WHEN_RECOMMENDED);

      return reportedMersHumanCasesMapLayer.getCountryHighlightingLayerInformation({
        data: faoMersEventData
          .filter((dataPoint) => dataPoint.diagnosisStatus === MersDiagnosisStatus.Confirmed)
          .filter((dataPoint): dataPoint is HumanMersEvent => isHumanMersEvent(dataPoint))
          .map((dataPoint) => ({ humansAffected: dataPoint.humansAffected, countryAlphaThreeCode: dataPoint.country.alphaThreeCode })),
        countryOutlineData: dataPoints,
        countryOutlinesEnabled
      });
    }
    if(currentMapCountryHighlightingSettings === MersMapCountryHighlightingSettings.MERS_ANIMAL_CASES) {
      const countryOutlinesEnabled = (countryOutlinesSetting === CountryPaintChangeSetting.ALWAYS_ENABLED || countryOutlinesSetting === CountryPaintChangeSetting.WHEN_RECOMMENDED);

      return reportedMersAnimalCasesMapLayer.getCountryHighlightingLayerInformation({
        data: faoMersEventData
          .filter((dataPoint) => dataPoint.diagnosisStatus === MersDiagnosisStatus.Confirmed)
          .filter((dataPoint): dataPoint is AnimalMersEvent => isAnimalMersEvent(dataPoint))
          .map((dataPoint) => ({ animalsAffected: 1, countryAlphaThreeCode: dataPoint.country.alphaThreeCode })),
        countryOutlineData: dataPoints,
        countryOutlinesEnabled
      });
    }
    assertNever(currentMapCountryHighlightingSettings);
  }, [dataPointPresentMapLayer, totalCamelPopulationMapLayer, camelsPerCapitaMapLayer, currentMapCountryHighlightingSettings, dataPoints, latestFaoCamelPopulationDataPointsByCountry, countryOutlinesSetting, faoMersEventData, reportedMersHumanCasesMapLayer ]);

  if (!data || !faoMersEvents) {
    return <span> Loading... </span>;
  }

  return (
    <>
      <div className={"w-full h-full p-0"}>
        <PathogenMap
          id="mersMap"
          countryPopUpEnabled={countryPopUpEnabled}
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
          clusteringSettings={{
            clusteringEnabled: true,
            headerText: "MERS Data",
            popUpWidth: GenericMapPopUpWidth.MEDIUM,
            clusterProperties: {
              "Reported Human Events": ["+", ["case", ["==", ["get", "__typename"], "HumanMersEvent"], 1, 0]],
              "Human Cases": ["+", ["case", ["==", ["get", "__typename"], "HumanMersEvent"], ["get", "humansAffected"], 0]],
              "Human Deaths": ["+", ["case", ["==", ["get", "__typename"], "HumanMersEvent"], ["get", "humanDeaths"], 0]],
              "Reported Animal Events": ["+", ["case", ["==", ["get", "__typename"], "AnimalMersEvent"], 1, 0]],
              "Camel Events": ["+", ["case", [ "all",
                ["==", ["get", "__typename"], "AnimalMersEvent"],
                ["==", ["get", "animalSpecies"], MersEventAnimalSpecies.Camel]
              ], 1, 0]],
              "Bat Events": ["+", ["case", [ "all",
                ["==", ["get", "__typename"], "AnimalMersEvent"],
                ["==", ["get", "animalSpecies"], MersEventAnimalSpecies.Bat]
              ], 1, 0]],
              "Goat Events": ["+", ["case", [ "all",
                ["==", ["get", "__typename"], "AnimalMersEvent"],
                ["==", ["get", "animalSpecies"], MersEventAnimalSpecies.Goat]
              ], 1, 0]],
              "Cattle Events": ["+", ["case", [ "all",
                ["==", ["get", "__typename"], "AnimalMersEvent"],
                ["==", ["get", "animalSpecies"], MersEventAnimalSpecies.Cattle]
              ], 1, 0]],
              "Sheep Events": ["+", ["case", [ "all",
                ["==", ["get", "__typename"], "AnimalMersEvent"],
                ["==", ["get", "animalSpecies"], MersEventAnimalSpecies.Sheep]
              ], 1, 0]],
              "Human Seroprevalence Estimates": ["+", ["case", ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryHumanMersSeroprevalenceEstimateInformation"], 1, 0]],
              "Human Viral Estimates": ["+", ["case", ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryHumanMersViralEstimateInformation"], 1, 0]],
              "Animal Seroprevalence Estimates": ["+", ["case", ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"], 1, 0]],
              "Camel Seroprevalence Estimates": ["+", ["case", [ "all",
                ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
                ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Camel]
              ], 1, 0]],
              "Bat Seroprevalence Estimates": ["+", ["case", [ "all",
                ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
                ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Bat]
              ], 1, 0]],
              "Goat Seroprevalence Estimates": ["+", ["case", [ "all",
                ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
                ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Goat]
              ], 1, 0]],
              "Cattle Seroprevalence Estimates": ["+", ["case", [ "all",
                ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
                ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Cattle]
              ], 1, 0]],
              "Sheep Seroprevalence Estimates": ["+", ["case", [ "all",
                ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersSeroprevalenceEstimateInformation"],
                ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Sheep]
              ], 1, 0]],
              "Animal Viral Estimates": ["+", ["case", ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"], 1, 0]],
              "Camel Viral Estimates": ["+", ["case", [ "all",
                ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
                ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Camel]
              ], 1, 0]],
              "Bat Viral Estimates": ["+", ["case", [ "all",
                ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
                ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Bat]
              ], 1, 0]],
              "Goat Viral Estimates": ["+", ["case", [ "all",
                ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
                ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Goat]
              ], 1, 0]],
              "Cattle Viral Estimates": ["+", ["case", [ "all",
                ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
                ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Cattle]
              ], 1, 0]],
              "Sheep Viral Estimates": ["+", ["case", [ "all",
                ["==", ["get", "primaryEstimateInfoTypename"], "PrimaryAnimalMersViralEstimateInformation"],
                ["==", ["get", "animalSpecies", ["get", "primaryEstimateInfo"]], MersAnimalSpecies.Sheep]
              ], 1, 0]],
            },
            validClusterPropertyKeys: [
              "Reported Human Events",
              "Human Cases",
              "Human Deaths",
              "Reported Animal Events",
              "Camel Events",
              "Bat Events",
              "Goat Events",
              "Cattle Events",
              "Sheep Events",
              "Human Seroprevalence Estimates",
              "Animal Seroprevalence Estimates",
              "Camel Seroprevalence Estimates",
              "Bat Seroprevalence Estimates",
              "Goat Seroprevalence Estimates",
              "Cattle Seroprevalence Estimates",
              "Sheep Seroprevalence Estimates",
              "Human Viral Estimates",
              "Animal Viral Estimates",
              "Camel Viral Estimates",
              "Bat Viral Estimates",
              "Goat Viral Estimates",
              "Cattle Viral Estimates",
              "Sheep Viral Estimates"
            ],
            clusterPropertyKeysIncludedInSum: [
              "Reported Human Events",
              "Reported Animal Events",
              "Human Seroprevalence Estimates",
              "Animal Seroprevalence Estimates",
              "Human Viral Estimates",
              "Animal Viral Estimates",
            ],
            clusterPropertyToColourMap: {
              "Reported Human Events": MapPinColours['HumanMersEvent'],
              "Human Cases": MapPinColours['human-mers-event-alt'],
              "Human Deaths": MapPinColours['human-mers-event-alt'],
              "Reported Animal Events": MapPinColours['AnimalMersEvent'],
              "Camel Events": MapPinColours['animal-mers-event-alt'],
              "Bat Events": MapPinColours['animal-mers-event-alt'],
              "Goat Events": MapPinColours['animal-mers-event-alt'],
              "Cattle Events": MapPinColours['animal-mers-event-alt'],
              "Sheep Events": MapPinColours['animal-mers-event-alt'],
              "Human Seroprevalence Estimates": MapPinColours['PrimaryHumanMersSeroprevalenceEstimateInformation'],
              "Animal Seroprevalence Estimates": MapPinColours['PrimaryAnimalMersSeroprevalenceEstimateInformation'],
              "Camel Seroprevalence Estimates": MapPinColours['mers-animal-viral-estimate-alt'],
              "Bat Seroprevalence Estimates": MapPinColours['mers-animal-viral-estimate-alt'],
              "Goat Seroprevalence Estimates": MapPinColours['mers-animal-viral-estimate-alt'],
              "Cattle Seroprevalence Estimates": MapPinColours['mers-animal-viral-estimate-alt'],
              "Sheep Seroprevalence Estimates": MapPinColours['mers-animal-viral-estimate-alt'],
              "Human Viral Estimates": MapPinColours['PrimaryHumanMersViralEstimateInformation'],
              "Animal Viral Estimates": MapPinColours['PrimaryAnimalMersViralEstimateInformation'],
              "Camel Viral Estimates": MapPinColours['mers-animal-viral-estimate-alt'],
              "Bat Viral Estimates": MapPinColours['mers-animal-viral-estimate-alt'],
              "Goat Viral Estimates": MapPinColours['mers-animal-viral-estimate-alt'],
              "Cattle Viral Estimates": MapPinColours['mers-animal-viral-estimate-alt'],
              "Sheep Viral Estimates": MapPinColours['mers-animal-viral-estimate-alt']
            }
          }}
          generatePopupContent={(input) => {
            if(isPopupCountryHighlightLayerContentGeneratorInput(input)) {
              return <MersCountryPopupContent record={input.data} />
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
      <CountryHighlightLayerLegend
        className={"absolute bottom-1 right-1 mb-1 bg-white/60 backdrop-blur-md"}
        legendEntries={countryHighlightLayerLegendEntries}
        freeTextEntries={freeTextEntries}
      />
      <MapEstimateSummary filteredData={filteredData.map((estimate) => ({ sourceSheetName: estimate.primaryEstimateInfo.sourceTitle }))}/>
      <mersMapCustomizationModal.mapCustomizeButton />
      <mersMapCustomizationModal.customizationModal />
    </>
  );
}
