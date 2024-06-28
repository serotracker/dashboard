"use client";

import React, { useContext, useMemo } from "react";
import { PathogenMap } from "@/components/ui/pathogen-map/pathogen-map";
import { useSarsCov2Data } from "@/hooks/sarscov2/useSarsCov2Data";
import { SarsCov2Context } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { MapEstimateSummary } from "@/components/ui/pathogen-map/map-estimate-summary";
import { MapSymbology } from "./map-config";
import { SarsCov2EstimatePopupContent } from "./sars-cov-2-estimate-pop-up-content";
import { isPopupCountryHighlightLayerContentGeneratorInput } from "@/components/ui/pathogen-map/pathogen-map-popup";
import { SarsCov2CountryPopupContent } from "./sars-cov-2-country-pop-up-content";
import { GenericMapPopUpWidth } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { useDataPointPresentLayer } from "@/components/ui/pathogen-map/country-highlight-layers/data-point-present-layer";
import { CountryHighlightLayerLegend } from "@/components/ui/pathogen-map/country-highlight-layers/country-highlight-layer-legend";

export function SarsCov2Map() {
  const { filteredData }= useContext(SarsCov2Context);
  const { data } = useSarsCov2Data();
  const { getCountryHighlightingLayerInformation } = useDataPointPresentLayer();

  const { paint, countryHighlightLayerLegendEntries } = useMemo(() => getCountryHighlightingLayerInformation({
    data: filteredData
  }), [filteredData, getCountryHighlightingLayerInformation]);

  if (!data) {
    return <span> Loading... </span>;
  }

  return (
    <>
      <div className={"w-full h-full p-0"}>
        <PathogenMap
          id="sarsCov2Map"
          baseCursor=""
          sourceId="sc2-[GENERATED-SOURCE-ID]"
          layers={[
            {
              id: "SARS-CoV2-pins",
              type: "circle",
              isDataUsedForCountryHighlighting: true,
              cursor: "pointer",
              filter: ["!", ["has", "point_count"]],
              layerPaint: {
                "circle-color": [
                  "match",
                  ["get", "scope"],
                  "National",
                  MapSymbology.StudyFeature.National.Color,
                  "Regional",
                  MapSymbology.StudyFeature.Regional.Color,
                  "Local",
                  MapSymbology.StudyFeature.Local.Color,
                  "Sublocal",
                  MapSymbology.StudyFeature.Sublocal.Color,
                  MapSymbology.StudyFeature.Default.Color,
                ],
                "circle-radius": [
                  "match",
                  ["get", "scope"],
                  "National",
                  MapSymbology.StudyFeature.National.Size,
                  "Regional",
                  MapSymbology.StudyFeature.Regional.Size,
                  "Local",
                  MapSymbology.StudyFeature.Local.Size,
                  "Sublocal",
                  MapSymbology.StudyFeature.Sublocal.Size,
                  MapSymbology.StudyFeature.Default.Size,
                ],
                "circle-stroke-color": [
                  "case",
                  ["boolean", ["feature-state", "isSelected"], false],
                  "black",
                  "white",
                ],
                "circle-stroke-width": 3,
                "circle-stroke-opacity": [
                  "case",
                  ["boolean", ["feature-state", "hover"], false],
                  1,
                  [
                    "case",
                    ["boolean", ["feature-state", "isSelected"], false],
                    1,
                    0,
                  ],
                ],
                "circle-opacity": [
                  "case",
                  ["boolean", ["feature-state", "isBlurred"], false],
                  0.2,
                  0.6,
                ],
              },
            },
          ]}
          clusteringSettings={{
            clusteringEnabled: true,
            headerText: "Estimate Count",
            popUpWidth: GenericMapPopUpWidth.AUTO,
            clusterProperties: {
              National: ["+", ["case", ["==", ["get", "scope"], "National"], 1, 0]],
              Regional: ["+", ["case", ["==", ["get", "scope"], "Regional"], 1, 0]],
              Local: ["+", ["case", ["==", ["get", "scope"], "Local"], 1, 0]]
            },
            validClusterPropertyKeys: [
              "National",
              "Regional",
              "Local"
            ],
            clusterPropertyKeysIncludedInSum: [
              "National",
              "Regional",
              "Local"
            ],
            clusterPropertyToColourMap: {
              National: "#094180",
              Regional: "#f19e66",
              Local: "#e15759"
            }
          }}
          generatePopupContent={(input) => {
            if(isPopupCountryHighlightLayerContentGeneratorInput(input)) {
              return <SarsCov2CountryPopupContent record={input.data} />
            }
          
            return <SarsCov2EstimatePopupContent estimate={input.data} />
          }}
          dataPoints={filteredData}
          paint={paint}
        />
      </div>
      <CountryHighlightLayerLegend
        className={"absolute bottom-1 right-1 mb-1 bg-white/60 backdrop-blur-md"}
        legendEntries={countryHighlightLayerLegendEntries}
      />
      <MapEstimateSummary filteredData={filteredData.map(({studyName}) => ({sourceSheetName: studyName}))}/>
    </>
  );
}
