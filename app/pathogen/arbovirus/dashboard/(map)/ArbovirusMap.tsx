/**
 * @file ArbovirusMap Component
 * @description This component renders a Map for the Arboviruses dashboard.
 * It includes checkboxes for different pathogens and a side panel with additional filters.
 * The map and filters are dynamically updated based on user interactions.
 */

"use client";

import React, { useContext, useMemo, useState } from "react";
import { useArboData } from "@/hooks/useArboData";
import { ArbovirusEstimatePopupContent } from "./arbovirus-estimate-pop-up-content";
import { PathogenMap } from "@/components/ui/pathogen-map/pathogen-map";
import { MapArbovirusStudySubmissionPrompt } from "./MapArbovirusStudySubmissionPrompt";
import { ArboCountryPopupContent } from "./arbo-country-pop-up-content";
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";
import { MapEstimateSummary } from "@/components/ui/pathogen-map/map-estimate-summary";
import { isPopupCountryHighlightLayerContentGeneratorInput } from "@/components/ui/pathogen-map/pathogen-map-popup";
import { Arbovirus } from "@/gql/graphql";
import { GenericMapPopUpWidth } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { useDataPointPresentLayer } from "@/components/ui/pathogen-map/country-highlight-layers/data-point-present-layer";
import { CountryHighlightLayerLegend } from "@/components/ui/pathogen-map/country-highlight-layers/country-highlight-layer-legend";
import { useEsmCountryHighlightLayer } from "./country-highlight-layers/esm-country-highlight-layer";

// TODO: Needs to be synced with tailwind pathogen colors. How?
export const pathogenColors: Record<Arbovirus, string> = {
  [Arbovirus.Zikv]: "#a0c4ff",
  [Arbovirus.Chikv]: "#9bf6ff",
  [Arbovirus.Wnv]: "#caffbf",
  [Arbovirus.Denv]: "#ffadad",
  [Arbovirus.Yf]: "#ffd6a5",
  [Arbovirus.Mayv]: "#c5a3ff",
};

export function ArbovirusMap() {
  const [ isStudySubmissionPromptVisible, setStudySubmissionPromptVisibility ] = useState(true);
  const { filteredData, selectedFilters }= useContext(ArboContext);
  const { data } = useArboData();
  const { getCountryHighlightingLayerInformation: getDataPointPresentCountryHighlightingLayerInformation } = useDataPointPresentLayer();
  const { getCountryHighlightingLayerInformation: getESMCountryHighlightingLayerInformation } = useEsmCountryHighlightLayer();

  const { paint, countryHighlightLayerLegendEntries } = useMemo(() => {
    if (selectedFilters.esm?.length > 0) {
      return getESMCountryHighlightingLayerInformation({ data: filteredData })
    }

    return getDataPointPresentCountryHighlightingLayerInformation({ data: filteredData })
  }, [filteredData, getDataPointPresentCountryHighlightingLayerInformation, getESMCountryHighlightingLayerInformation, selectedFilters]);

  if (!data) {
    return <span> Loading... </span>;
  }

  return (
    <>
      <div className={"w-full h-full p-0"}>
        <PathogenMap
          id="arboMap"
          baseCursor=""
          sourceId="arbo-[GENERATED-SOURCE-ID]"
          layers={[
            {
              id: "Arbovirus-pins",
              type: "circle",
              isDataUsedForCountryHighlighting: true,
              cursor: "pointer",
              filter: ["!", ["has", "point_count"]],
              layerPaint: {
                "circle-color": [
                  "match",
                  ["get", "pathogen"],
                  "ZIKV",
                  "#A0C4FF",
                  "CHIKV",
                  "#9BF6FF",
                  "WNV",
                  "#CAFFBF",
                  "DENV",
                  "#FFADAD",
                  "YF",
                  "#FFD6A5",
                  "MAYV",
                  "#C5A3FF",
                  "#FFFFFC",
                ],
                "circle-radius": 8,
                "circle-stroke-color": "#333333",
                "circle-stroke-width": 1,
              },
            },
          ]}
          generatePopupContent={(input) => {
            if(isPopupCountryHighlightLayerContentGeneratorInput(input)) {
              return <ArboCountryPopupContent record={input.data} />
            }
          
            return <ArbovirusEstimatePopupContent estimate={input.data} />
          }}
          dataPoints={filteredData}
          clusteringSettings={{
            clusteringEnabled: true,
            headerText: "Estimate Count",
            popUpWidth: GenericMapPopUpWidth.AUTO,
            clusterProperties: {
              [Arbovirus.Zikv]: ["+", ["case", ["==", ["get", "pathogen"], Arbovirus.Zikv], 1, 0]],
              [Arbovirus.Chikv]: ["+", ["case", ["==", ["get", "pathogen"], Arbovirus.Chikv], 1, 0]],
              [Arbovirus.Wnv]: ["+", ["case", ["==", ["get", "pathogen"], Arbovirus.Wnv], 1, 0]],
              [Arbovirus.Denv]: ["+", ["case", ["==", ["get", "pathogen"], Arbovirus.Denv], 1, 0]],
              [Arbovirus.Yf]: ["+", ["case", ["==", ["get", "pathogen"], Arbovirus.Yf], 1, 0]],
              [Arbovirus.Mayv]: ["+", ["case", ["==", ["get", "pathogen"], Arbovirus.Mayv], 1, 0]],
            },
            validClusterPropertyKeys: Object.values(Arbovirus),
            clusterPropertyKeysIncludedInSum: Object.values(Arbovirus),
            clusterPropertyToColourMap: pathogenColors
          }}
          paint={paint}
        />
      </div>
      <MapArbovirusStudySubmissionPrompt 
        hidden={!isStudySubmissionPromptVisible}
        onClose={() => setStudySubmissionPromptVisibility(false)}
        className={"absolute bottom-1 left-1 mx-auto w-1/2 text-center bg-white/60 backdrop-blur-md"}
      />
      <CountryHighlightLayerLegend
        className={"absolute bottom-1 right-1 mb-1 bg-white/60 backdrop-blur-md"}
        legendEntries={[
          ...countryHighlightLayerLegendEntries,
          ...(selectedFilters.esm?.length > 0 ? [{
            colour: "#FFFFFF",
            description: "Unsuitable Environment"
          }, {
            colour: "rgba(54,2,4,0.5)",
            description: "Suitable Environment"
          }] : [])
        ]}
      />
      <MapEstimateSummary filteredData={filteredData}/>
    </>
  );
}
