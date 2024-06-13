"use client";

import React, { useContext } from "react";
import { PathogenMap } from "@/components/ui/pathogen-map/pathogen-map";
import { MapShadingLegend } from "@/app/pathogen/arbovirus/dashboard/(map)/MapShadingLegend";
import { MapEstimateSummary } from "@/components/ui/pathogen-map/map-estimate-summary";
import { isPopupCountryHighlightLayerContentGeneratorInput } from "@/components/ui/pathogen-map/pathogen-map-popup";
import { MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { useMersData } from "@/hooks/mers/useMersData";
import { MersCountryPopupContent } from "./mers-country-pop-up-content";
import { MersEstimatePopupContent } from "./mers-estimate-pop-up-content";
import { useFaoMersEventData } from "@/hooks/mers/useFaoMersEventData";

export const MersMap = () => {
  const state = useContext(MersContext);
  const { data } = useMersData();
  const { faoMersEvents } = useFaoMersEventData();

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
                "circle-color": '#094180',
                "circle-radius": 11,
                "circle-stroke-color": 'black',
                "circle-stroke-width": 3,
                "circle-stroke-opacity": 1,
                "circle-opacity": 1,
              },
            },
          ]}
          clusteringSettings={{
            clusteringEnabled: false
          }}
          generatePopupContent={(input) => {
            if(isPopupCountryHighlightLayerContentGeneratorInput(input)) {
              return <MersCountryPopupContent record={input.data} />
            }

            return <MersEstimatePopupContent estimate={input.data} />
          }}
          dataPoints={[...state.filteredData, ...(state.faoMersEventData.map((element) => ({
            ...element,
            country: element.country.name,
            countryAlphaThreeCode: element.country.alphaThreeCode,
            countryAlphaTwoCode: element.country.alphaTwoCode
          })))]}
          />
      </div>
      <MapShadingLegend className={"absolute bottom-1 right-1 mb-1 bg-white/60 backdrop-blur-md"} />
      <MapEstimateSummary filteredData={state.filteredData.map(() => ({sourceSheetName: "Study name goes here..."}))}/>
    </>
  );
}
