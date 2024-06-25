"use client";

import React, { useContext, useMemo } from "react";
import { PathogenMap } from "@/components/ui/pathogen-map/pathogen-map";
import { MapEstimateSummary } from "@/components/ui/pathogen-map/map-estimate-summary";
import { isPopupCountryHighlightLayerContentGeneratorInput } from "@/components/ui/pathogen-map/pathogen-map-popup";
import { MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { useMersData } from "@/hooks/mers/useMersData";
import { MersCountryPopupContent } from "./mers-country-pop-up-content";
import { MersEstimatePopupContent } from "./mers-estimate-pop-up-content";
import { useFaoMersEventData } from "@/hooks/mers/useFaoMersEventData";
import { MersFaoAnimalEventPopupContent } from "./mers-fao-animal-event-pop-up-content";
import { MersFaoHumanEventPopupContent } from "./mers-fao-human-event-pop-up-content";
import assertNever from "assert-never";
import { MersDiagnosisStatus, MersEventAnimalSpecies } from "@/gql/graphql";
import {
  MersMapMarkerData,
  isMersEstimateMapMarkerData,
  isMersFaoAnimalEventMapMarkerData,
  isMersFaoHumanEventMapMarkerData
} from "./shared-mers-map-pop-up-variables";
import { GenericMapPopUpWidth } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { MersMapCountryHighlightingSettings, useMersMapCustomizationModal } from "./use-mers-map-customization-modal";
import { useDataPointPresentLayer } from "@/components/ui/pathogen-map/country-highlight-layers/data-point-present-layer";
import { CamelPopulationDataContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/camel-population-data-context";
import { useTotalCamelPopulationLayer } from "./country-highlight-layers/total-camel-population-layer";
import { useCamelsPerCapitaLayer } from "./country-highlight-layers/camels-per-capita-layer";
import { CountryHighlightLayerLegend } from "@/components/ui/pathogen-map/country-highlight-layers/country-highlight-layer-legend";

const MapPinColours = {
  'HumanMersEvent': "#8abded",
  'human-mers-event-alt': "#2a8deb",
  'AnimalMersEvent': "#ed8ac7",
  'animal-mers-event-alt': "#eb2aa1",
  'MersEstimate': "#e7ed8a"
} as const;

export const MersMap = () => {
  const { filteredData, faoMersEventData } = useContext(MersContext);
  const { latestFaoCamelPopulationDataPointsByCountry } = useContext(CamelPopulationDataContext);
  const { data } = useMersData();
  const { faoMersEvents } = useFaoMersEventData();
  const { currentMapCountryHighlightingSettings, countryPopUpEnabled, ...mersMapCustomizationModal } = useMersMapCustomizationModal();

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

  const { paint, countryHighlightLayerLegendEntries } = useMemo(() => {
    if(currentMapCountryHighlightingSettings === MersMapCountryHighlightingSettings.EVENTS_AND_ESTIMATES) {
      return dataPointPresentMapLayer.getCountryHighlightingLayerInformation({
        data: dataPoints
      });
    }
    if(currentMapCountryHighlightingSettings === MersMapCountryHighlightingSettings.TOTAL_CAMEL_POPULATION) {
      return totalCamelPopulationMapLayer.getCountryHighlightingLayerInformation({
        data: latestFaoCamelPopulationDataPointsByCountry ?? []
      });
    }
    if(currentMapCountryHighlightingSettings === MersMapCountryHighlightingSettings.CAMELS_PER_CAPITA) {
      return camelsPerCapitaMapLayer.getCountryHighlightingLayerInformation({
        data: latestFaoCamelPopulationDataPointsByCountry ?? []
      });
    }
    assertNever(currentMapCountryHighlightingSettings);
  }, [dataPointPresentMapLayer, totalCamelPopulationMapLayer, camelsPerCapitaMapLayer, currentMapCountryHighlightingSettings, dataPoints, latestFaoCamelPopulationDataPointsByCountry]);

  if (!data || !faoMersEvents) {
    return <span> Loading... </span>;
  }

  return (
    <>
      <div className={"w-full h-full p-0"}>
        <PathogenMap
          id="mersMap"
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
                  "MersEstimate",
                  `${MapPinColours['MersEstimate']}`,
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
            popUpWidth: GenericMapPopUpWidth.THIN,
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
              "Estimates": ["+", ["case", ["==", ["get", "__typename"], "MersEstimate"], 1, 0]]
            },
            validClusterPropertyKeys: [
              "Reported Human Events",
              "Human Cases",
              "Human Deaths",
              "Reported Animal Events",
              "Camel Events",
              "Bat Events",
              "Estimates"
            ],
            clusterPropertyKeysIncludedInSum: [
              "Reported Human Events",
              "Reported Animal Events",
              "Estimates"
            ],
            clusterPropertyToColourMap: {
              "Reported Human Events": MapPinColours['HumanMersEvent'],
              "Human Cases": MapPinColours['human-mers-event-alt'],
              "Human Deaths": MapPinColours['human-mers-event-alt'],
              "Reported Animal Events": MapPinColours['AnimalMersEvent'],
              "Camel Events": MapPinColours['animal-mers-event-alt'],
              "Bat Events": MapPinColours['animal-mers-event-alt'],
              "Estimates": MapPinColours['MersEstimate']
            }
          }}
          generatePopupContent={(input) => {
            if(isPopupCountryHighlightLayerContentGeneratorInput(input)) {
              return <MersCountryPopupContent record={input.data} />
            }

            const mersMarkerData: MersMapMarkerData = input.data;

            if(isMersEstimateMapMarkerData(mersMarkerData)) {
              return <MersEstimatePopupContent estimate={mersMarkerData} />
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
      />
      <MapEstimateSummary filteredData={filteredData.map(() => ({sourceSheetName: "Study name goes here..."}))}/>
      <mersMapCustomizationModal.mapCustomizeButton />
      <mersMapCustomizationModal.customizationModal />
    </>
  );
}
