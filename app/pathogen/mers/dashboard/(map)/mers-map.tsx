"use client";

import React, { useContext, useMemo } from "react";
import { GetCountryHighlightingLayerInformationOutput, PathogenMap } from "@/components/ui/pathogen-map/pathogen-map";
import { MapEstimateSummary } from "@/components/ui/pathogen-map/map-estimate-summary";
import { isPopupCountryHighlightLayerContentGeneratorInput } from "@/components/ui/pathogen-map/pathogen-map-popup";
import { MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { useMersData } from "@/hooks/mers/useMersData";
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

const MapPinColours = {
  'HumanMersEvent': "#8abded",
  'human-mers-event-alt': "#2a8deb",
  'AnimalMersEvent': "#ed8ac7",
  'animal-mers-event-alt': "#eb2aa1",
  'HumanMersEstimate': "#e7ed8a",
  'AnimalMersEstimate': "#13f244",
  'HumanMersViralEstimate': "#e37712",
  'AnimalMersViralEstimate': "#de141b",
  'mers-animal-viral-estimate-alt': "#910c10",
} as const;

export const MersMap = () => {
  const { filteredData, faoMersEventData } = useContext(MersContext);
  const { latestFaoCamelPopulationDataPointsByCountry } = useContext(CamelPopulationDataContext);
  const { data } = useMersData();
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

  const dataPoints = useMemo(() => [...filteredData, ...(faoMersEventData
    .map((element) => ({
      ...element,
      country: element.country.name,
      countryAlphaThreeCode: element.country.alphaThreeCode,
      countryAlphaTwoCode: element.country.alphaTwoCode
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
    assertNever(currentMapCountryHighlightingSettings);
  }, [dataPointPresentMapLayer, totalCamelPopulationMapLayer, camelsPerCapitaMapLayer, currentMapCountryHighlightingSettings, dataPoints, latestFaoCamelPopulationDataPointsByCountry, countryOutlinesSetting]);

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
                  "HumanMersEstimate",
                  `${MapPinColours['HumanMersEstimate']}`,
                  "AnimalMersEstimate",
                  `${MapPinColours['AnimalMersEstimate']}`,
                  "HumanMersViralEstimate",
                  `${MapPinColours['HumanMersViralEstimate']}`,
                  "AnimalMersViralEstimate",
                  `${MapPinColours['AnimalMersViralEstimate']}`,
                  "#FFFFFF"
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
              "Human Seroprevalence Estimates": ["+", ["case", ["==", ["get", "__typename"], "HumanMersEstimate"], 1, 0]],
              "Human Viral Estimates": ["+", ["case", ["==", ["get", "__typename"], "HumanMersViralEstimate"], 1, 0]],
              "Animal Seroprevalence Estimates": ["+", ["case", ["==", ["get", "__typename"], "AnimalMersEstimate"], 1, 0]],
              "Camel Seroprevalence Estimates": ["+", ["case", [ "all",
                ["==", ["get", "__typename"], "AnimalMersEstimate"],
                ["==", ["get", "animalSpecies"], MersAnimalSpecies.Camel]
              ], 1, 0]],
              "Bat Seroprevalence Estimates": ["+", ["case", [ "all",
                ["==", ["get", "__typename"], "AnimalMersEstimate"],
                ["==", ["get", "animalSpecies"], MersAnimalSpecies.Bat]
              ], 1, 0]],
              "Animal Viral Estimates": ["+", ["case", ["==", ["get", "__typename"], "AnimalMersViralEstimate"], 1, 0]],
              "Camel Viral Estimates": ["+", ["case", [ "all",
                ["==", ["get", "__typename"], "AnimalMersViralEstimate"],
                ["==", ["get", "animalSpecies"], MersAnimalSpecies.Camel]
              ], 1, 0]],
              "Bat Viral Estimates": ["+", ["case", [ "all",
                ["==", ["get", "__typename"], "AnimalMersViralEstimate"],
                ["==", ["get", "animalSpecies"], MersAnimalSpecies.Bat]
              ], 1, 0]],
            },
            validClusterPropertyKeys: [
              "Reported Human Events",
              "Human Cases",
              "Human Deaths",
              "Reported Animal Events",
              "Camel Events",
              "Bat Events",
              "Human Seroprevalence Estimates",
              "Animal Seroprevalence Estimates",
              "Camel Seroprevalence Estimates",
              "Bat Seroprevalence Estimates",
              "Human Viral Estimates",
              "Animal Viral Estimates",
              "Camel Viral Estimates",
              "Bat Viral Estimates"
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
              "Human Seroprevalence Estimates": MapPinColours['HumanMersEstimate'],
              "Animal Seroprevalence Estimates": MapPinColours['AnimalMersEstimate'],
              "Camel Seroprevalence Estimates": MapPinColours['mers-animal-viral-estimate-alt'],
              "Bat Seroprevalence Estimates": MapPinColours['mers-animal-viral-estimate-alt'],
              "Human Viral Estimates": MapPinColours['HumanMersViralEstimate'],
              "Animal Viral Estimates": MapPinColours['AnimalMersViralEstimate'],
              "Camel Viral Estimates": MapPinColours['mers-animal-viral-estimate-alt'],
              "Bat Viral Estimates": MapPinColours['mers-animal-viral-estimate-alt']
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
      <MapEstimateSummary filteredData={filteredData.map((estimate) => ({ sourceSheetName: estimate.sourceTitle }))}/>
      <mersMapCustomizationModal.mapCustomizeButton />
      <mersMapCustomizationModal.customizationModal />
    </>
  );
}
