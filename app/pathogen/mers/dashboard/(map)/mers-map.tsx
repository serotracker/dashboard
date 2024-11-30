"use client";

import React, { useContext, useMemo, useState } from "react";
import { PathogenMap } from "@/components/ui/pathogen-map/pathogen-map";
import { MapEstimateSummary } from "@/components/ui/pathogen-map/map-estimate-summary";
import { isPopupCountryHighlightLayerContentGeneratorInput } from "@/components/ui/pathogen-map/pathogen-map-popup";
import { MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { MersCountryPopupContent } from "./mers-country-pop-up-content";
import { HumanMersSeroprevalenceEstimatePopupContent } from "./human-mers-seroprevalence-estimate-pop-up-content";
import { AnimalMersSeroprevalenceEstimatePopupContent } from "./animal-mers-seroprevalence-estimate-pop-up-content";
import { useFaoMersEventData } from "@/hooks/mers/useFaoMersEventData";
import { MersFaoAnimalEventPopupContent } from "./mers-fao-animal-event-pop-up-content";
import { MersFaoHumanEventPopupContent } from "./mers-fao-human-event-pop-up-content";
import assertNever from "assert-never";
import {
  MersMapMarkerData,
  isHumanMersSeroprevalenceEstimateMapMarkerData,
  isAnimalMersSeroprevalenceEstimateMapMarkerData,
  isMersFaoAnimalEventMapMarkerData,
  isMersFaoHumanEventMapMarkerData,
  isAnimalMersViralEstimateMapMarkerData,
  isHumanMersViralEstimateMapMarkerData
} from "./shared-mers-map-pop-up-variables";
import { MapDataPointVisibilityOptions, MersMapCountryHighlightingSettings, useMersMapCustomizationModal } from "./use-mers-map-customization-modal";
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
import { useMersMapDataTypeLegendEntries } from "./use-mers-map-data-type-legend-entries";
import { useMersWhoCaseData } from "@/hooks/mers/use-mers-who-case-data";
import { useMersMapLegend } from "./use-mers-map-legend";
import { Breakpoint, useBreakpoint } from "@/hooks/useBreakpoint";
import { Layer, Source } from "react-map-gl";
import Link from "next/link";
import { MapSymbology } from "@/app/pathogen/sarscov2/dashboard/(map)/map-config";

export const MapPinColours = {
  'HumanMersEvent': "#1d4ed8",
  'human-mers-event-alt': "#1e40af",
  'AnimalMersEvent': "#15803d",
  'animal-mers-event-alt': "#166534",
  'PrimaryHumanMersSeroprevalenceEstimateInformation': "#93c5fd",
  'PrimaryAnimalMersSeroprevalenceEstimateInformation': "#6ee7b7",
  'PrimaryHumanMersViralEstimateInformation': "#3b82f6",
  'PrimaryAnimalMersViralEstimateInformation': "#22c55e",
  'mers-animal-viral-estimate-alt': "#910c10",
} as const;

export const MersMap = () => {
  const { filteredData, faoMersEventData } = useContext(MersContext);
  const [ isStudySubmissionPromptVisible, setStudySubmissionPromptVisibility ] = useState(true);
  const { data } = useMersPrimaryEstimates(); 
  const { isGreaterThanOrEqualToBreakpoint, currentBreakpoint } = useBreakpoint();
  const countryDataContext = useContext(CountryDataContext);
  const { faoMersEvents } = useFaoMersEventData();
  const {
    currentMapCountryHighlightingSettings,
    countryPopUpEnabled,
    countryOutlinesSetting,
    mapDataPointVisibilitySetting,
    ...mersMapCustomizationModal
  } = useMersMapCustomizationModal();
  const { mersWhoCaseData } = useMersWhoCaseData();

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

  const { paint, countryHighlightLayerLegendEntries, freeTextEntries, linearLegendColourGradientConfiguration, legendTooltipContent } = useMersMapPaint({
    dataPoints,
    faoMersEventData,
    currentMapCountryHighlightingSettings,
    countryOutlinesSetting,
    estimateDataShown,
    eventDataShown
  });

  const { dataTypeLayerLegendEntries } = useMersMapDataTypeLegendEntries({
    mapDataPointVisibilitySetting
  });

  const { clusteringSettings } = useMersMapClusterProperties({
    estimateDataShown,
    eventDataShown
  })

  const legendProps = useMemo(() => ({
    className: "absolute bottom-1 right-1 mb-1 bg-white/60 backdrop-blur-md",
    legendEntries: [
      { description: "Camel Population Data Unavailable", colour: MapSymbology.CountryFeature.Default.Color },
      ...dataTypeLayerLegendEntries,
    ],
    linearLegendColourGradientConfiguration: {
      enabled: true,
      props: {
        title: 'Camel population (head per sqkm, 2020)',
        ticks: [{
          numericValue: 0,
          isTickValueDisplayed: true,
          colourCode: "#FFFF80"
        }, {
          numericValue: 1,
          isTickValueDisplayed: true,
          colourCode: "#FCE468"
        }, {
          numericValue: 5,
          isTickValueDisplayed: true,
          colourCode: "#FACD50"
        }, {
          numericValue: 10,
          isTickValueDisplayed: true,
          colourCode: "#F5B338"
        }, {
          numericValue: 20,
          isTickValueDisplayed: true,
          colourCode: "#E09026"
        }, {
          numericValue: 40,
          isTickValueDisplayed: true,
          colourCode: "#B55E18"
        }, {
          numericValue: 60,
          isTickValueDisplayed: true,
          colourCode: "#91330A"
        }, {
          numericValue: 80,
          isTickValueDisplayed: true,
          colourCode: "#6B0000"
        }]
      }
    },
    freeTextEntries,
    legendTooltipContent: (
      <>
        <p className='inline text-sm'>Unpublished camel population map based on a FAO elaboration from the Global Livestock Impact Mapping System (GLIMS) database and adjusted to FAOSTAT 2020. Country boundaries based on </p>
        <p className="inline font-bold text-sm">UN Geospatial</p>
        <p className='inline text-sm'>. 2023. Map of the World. In: </p>
        <p className='inline italic text-sm'>United Nations</p>
        <p className='inline text-sm'>. [Cited: November 2024].</p>
        <Link className="inline text-link text-sm" href="www.un.org/geospatial/content/map-world-1" target="__blank" rel="noopener noreferrer">www.un.org/geospatial/content/map-world-1</Link>
      </>
    )
  }), [ countryHighlightLayerLegendEntries, dataTypeLayerLegendEntries, linearLegendColourGradientConfiguration, freeTextEntries, legendTooltipContent ]);
  
  const { mersMapLegend } = useMersMapLegend({
    legendProps
  });

  const isOnLgBreakpointOrBelow = useMemo(() => {
    const oppositeOfResult = isGreaterThanOrEqualToBreakpoint(currentBreakpoint, Breakpoint.XL);

    if(typeof oppositeOfResult === 'boolean') {
      return !oppositeOfResult;
    }

    return true;
  }, [ isGreaterThanOrEqualToBreakpoint, currentBreakpoint ])

  if (!data || !faoMersEvents) {
    return <span> Loading... </span>;
  }

  return (
    <>
      <div className={"w-full h-full p-0"}>
        <PathogenMap
          id="mersMap"
          countryHighlightingEnabled={false}
          countryPopUpEnabled={countryPopUpEnabled}
          countryPopUpOnHoverEnabled={countryPopUpEnabled}
          allowCountryPopUpsWithEmptyData={true}
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
                mersWhoCaseData={mersWhoCaseData ?? []}
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
        >
          <Source
            id={"camel_population_map_source"}
            type="raster"
            url="mapbox://serotracker.8wlzrlqf"
          >
            <Layer
              id={"camel_population_map_layer"}
              type="raster"
              source="camel_population_map_source"
              source-layer="camel_population_map_source"
              paint={{
                'raster-opacity': 0.7
              }}
              minzoom={0}
              maxzoom={22}
            />
          </Source>
          <Source
            id={"camel_population_map_asia_1_source"}
            type="raster"
            url="mapbox://serotracker.3ga9gz3i"
          >
            <Layer
              id={"camel_population_map_asia_1_layer"}
              type="raster"
              source="camel_population_map_asia_1_source"
              source-layer="camel_population_map_asia_1_source"
              paint={{
                'raster-opacity': 0.7
              }}
              minzoom={0}
              maxzoom={22}
            />
          </Source>
          <Source
            id={"camel_population_map_asia_2_source"}
            type="raster"
            url="mapbox://serotracker.43bw4d8u"
          >
            <Layer
              id={"camel_population_map_asia_2_layer"}
              type="raster"
              source="camel_population_map_asia_2_source"
              source-layer="camel_population_map_asia_2_source"
              paint={{
                'raster-opacity': 0.7
              }}
              minzoom={0}
              maxzoom={22}
            />
          </Source>
          <Source
            id={"camel_population_map_asia_3_source"}
            type="raster"
            url="mapbox://serotracker.24ccrmc3"
          >
            <Layer
              id={"camel_population_map_asia_3_layer"}
              type="raster"
              source="camel_population_map_asia_3_source"
              source-layer="camel_population_map_asia_3_source"
              paint={{
                'raster-opacity': 0.7
              }}
              minzoom={0}
              maxzoom={22}
            />
          </Source>
          <Source
            id={"camel_population_map_asia_4_source"}
            type="raster"
            url="mapbox://serotracker.6gbl8jse"
          >
            <Layer
              id={"camel_population_map_asia_4_layer"}
              type="raster"
              source="camel_population_map_asia_4_source"
              source-layer="camel_population_map_asia_4_source"
              paint={{
                'raster-opacity': 0.7
              }}
              minzoom={0}
              maxzoom={22}
            />
          </Source>
        </PathogenMap>
      </div>
      <MersMapStudySubmissionPrompt
        hidden={!isStudySubmissionPromptVisible || isOnLgBreakpointOrBelow}
        onClose={() => setStudySubmissionPromptVisibility(false)}
        className={"absolute bottom-1 left-1 mx-auto w-1/2 text-center bg-white/60 backdrop-blur-md"}
      />
      {mersMapLegend}
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
