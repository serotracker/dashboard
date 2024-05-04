"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useContext, useState } from "react";
import { PathogenMap } from "@/components/ui/pathogen-map/pathogen-map";
import { useNewSarsCov2Data } from "@/hooks/useNewSarsCov2Data";
import { SarsCov2Context } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { MapShadingLegend } from "@/app/pathogen/arbovirus/dashboard/(map)/MapShadingLegend";
import { MapEstimateSummary } from "@/components/ui/pathogen-map/map-estimate-summary";

export function SarsCov2Map() {
  const state = useContext(SarsCov2Context);
  const { data } = useNewSarsCov2Data();

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
          generatePopupContent={(input) => <p> TODO </p>}
          dataPoints={state.filteredData}
          />
      </div>
      <MapShadingLegend className={"absolute bottom-1 right-1 mb-1 bg-white/60 backdrop-blur-md"} />
      <MapEstimateSummary filteredData={state.filteredData}/>
    </>
  );
}
