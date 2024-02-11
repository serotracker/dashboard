"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filters } from "@/app/pathogen/sarscov2/dashboard/filters";
import React, { useContext } from "react";
import { ScrollText } from "lucide-react";
import useSarsCov2Data from "@/hooks/useSarsCov2Data";
import {
  SarsCov2Context,
} from "@/contexts/sarscov2-context";
import { MarkerCollection, PathogenMap } from "@/components/ui/pathogen-map/pathogen-map";
import { MapSymbology } from "./map-config";
import { SarsCov2StudyPopupContent } from "./SarsCov2StudyPopupContent";
import { MapboxGeoJSONFeature, Map } from "mapbox-gl";

export default function MapAndFilters() {
  const dataQuery = useSarsCov2Data();
  const state = useContext(SarsCov2Context);

  if (state.initialFetchCompleted) {
    return (
      <>
        <Card
          className={
            "w-full h-full overflow-hidden col-span-6 row-span-2 relative"
          }
        >
          <div className={"w-full h-full p-0"}>
            <PathogenMap
              id="sarscov2Map"
              baseCursor=""
              layers={[
                {
                  id: "SARS-CoV2-pins",
                  type: "circle",
                  isDataUsedForCountryHighlighting: true,
                  cursor: "pointer",
                  layerPaint: {
                    "circle-color": [
                      "match",
                      ["get", "estimate_grade"],
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
                      ["get", "estimate_grade"],
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
              generatePopupContent={(input) => {
                if(input.layerId === 'country-highlight-layer') {
                  throw new Error("The SARS CoV2 Country pop-up is unimplemented");
                }
          
                return <SarsCov2StudyPopupContent record={input.data} />
              }}
            
            
              dataPoints={state.filteredData.map((dataPoint) => ({
                ...dataPoint,
                longitude: dataPoint.pin_longitude,
                latitude: dataPoint.pin_latitude,
                // Convert this to some kind of unique identifier returned from the backend once the SARSCoV2 API returns unique ids.
                id: `${dataPoint.pin_latitude}-${dataPoint.pin_longitude}-${dataPoint.studyName}`
              }))} 
              clusterProperties={{}} 
              sourceId={"sarscov2-[GENERATE-SOURCE-ID]"} 
              computeClusterMarkers={function (props: { features: MapboxGeoJSONFeature[]; markers: MarkerCollection; map: Map; }): MarkerCollection {
                throw new Error("Function not implemented.");
              } }            />
          </div>
          <Card className={"absolute bottom-1 right-1 "}>
            <CardHeader className={"py-3"}>
              <p>Legend</p>
            </CardHeader>
            <CardContent className={"flex justify-center flex-col"}>
              {/*This is where the serotracker legend will go*/}
            </CardContent>
          </Card>
          <Card className={"absolute top-1 left-1 p-2"}>
            <CardContent className={"flex w-fit p-0"}>
              <ScrollText />
              <p className={"ml-1 font-medium"}>{state.filteredData.length}</p>
            </CardContent>
          </Card>
        </Card>
        <Card className={"col-span-2 row-span-2"}>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <Filters />
          </CardContent>
        </Card>
      </>
    );
  } else {
    return <span> Loading... </span>;
  }
}
