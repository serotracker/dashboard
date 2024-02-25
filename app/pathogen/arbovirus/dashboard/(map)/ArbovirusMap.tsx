/**
 * @file ArbovirusMap Component
 * @description This component renders a Map for the Arboviruses dashboard.
 * It includes checkboxes for different pathogens and a side panel with additional filters.
 * The map and filters are dynamically updated based on user interactions.
 */

"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useContext, useState } from "react";
import { useArboData } from "@/hooks/useArboData";
import { ArboContext } from "@/contexts/arbo-context/arbo-context";
import { ArboStudyPopupContent } from "../ArboStudyPopupContent";
import { PathogenMap } from "@/components/ui/pathogen-map/pathogen-map";
import { MapArbovirusFilter } from "./MapArbovirusFilter";
import { MapExpandPlotsPrompt } from "./MapExpandPlotsPrompt";
import { MapArbovirusStudySubmissionPrompt } from "./MapArbovirusStudySubmissionPrompt";
import { ArboCountryPopupContent } from "../ArboCountryPopUpContent";
import { computeClusterMarkers } from "./arbo-map-cluster-utils";

export const pathogenColorsTailwind: { [key: string]: string } = {
  ZIKV: "data-[state=checked]:bg-zikv",
  CHIKV: "data-[state=checked]:bg-chikv",
  WNV: "data-[state=checked]:bg-wnv",
  DENV: "data-[state=checked]:bg-denv",
  YF: "data-[state=checked]:bg-yf",
  MAYV: "data-[state=checked]:bg-mayv",
};

// TODO: Needs to be synced with tailwind pathogen colors. How?
export const pathogenColors: { [key: string]: string } = {
  ZIKV: "#A0C4FF",
  CHIKV: "#9BF6FF",
  WNV: "#CAFFBF",
  DENV: "#FFADAD",
  YF: "#FFD6A5",
  MAYV: "#c5a3ff",
};

//TODO: SeanKennyNF remove this type, the typeguard, and all references to expanding and minimizing visualizations once the redesign is rolled out.
interface OldArbovirusMapProps {
  areVisualizationsExpanded: boolean;
  expandVisualizations: () => void;
  minimizeVisualizations: () => void;
}

const isOldArbovirusMapProps = (props: ArbovirusMapProps): props is OldArbovirusMapProps =>
  'areVisualizationsExpanded' in props && typeof props.areVisualizationsExpanded === 'boolean' &&
  'expandVisualizations' in props && typeof props.expandVisualizations === 'function' &&
  'minimizeVisualizations' in props && typeof props.minimizeVisualizations === 'function'

type NewArbovirusMapProps = {}

type ArbovirusMapProps = OldArbovirusMapProps | NewArbovirusMapProps;

export function ArbovirusMap(input: ArbovirusMapProps) {
  
  const [ isStudySubmissionPromptVisible, setStudySubmissionPromptVisibility ] = useState(true);
  const state = useContext(ArboContext);
  const { data } = useArboData();

  if (!data) {
    return <span> Loading... </span>;
  }

  const {expandVisualizations, minimizeVisualizations, areVisualizationsExpanded} = isOldArbovirusMapProps(input) ?
    {expandVisualizations: input.expandVisualizations, minimizeVisualizations: input.minimizeVisualizations, areVisualizationsExpanded: input.areVisualizationsExpanded} :
    {expandVisualizations: () => {}, minimizeVisualizations: () => {}, areVisualizationsExpanded: false}

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
            if(input.layerId === 'country-highlight-layer') {
              return <ArboCountryPopupContent record={input.data} />
            }
          
            return <ArboStudyPopupContent record={input.data} />
          }}
        
          dataPoints={state.filteredData}
          clusterProperties={{
            ZIKV: ["+", ["case", ["==", ["get", "pathogen"], "ZIKV"], 1, 0]],
            CHIKV: ["+", ["case", ["==", ["get", "pathogen"], "CHIKV"], 1, 0]],
            WNV: ["+", ["case", ["==", ["get", "pathogen"], "WNV"], 1, 0]],
            DENV: ["+", ["case", ["==", ["get", "pathogen"], "DENV"], 1, 0]],
            YF: ["+", ["case", ["==", ["get", "pathogen"], "YF"], 1, 0]],
            MAYV: ["+", ["case", ["==", ["get", "pathogen"], "MAYV"], 1, 0]],
          }} 
          computeClusterMarkers={computeClusterMarkers}        
          />
      </div>
      <MapArbovirusStudySubmissionPrompt 
        hidden={!isStudySubmissionPromptVisible}
        onClose={() => setStudySubmissionPromptVisibility(false)}
        className={"absolute bottom-1 inset-x-0 mx-auto text-center w-1/2"}
      />
      <MapArbovirusFilter records={data.arbovirusEstimates} className={"absolute bottom-1 right-1"} />
      <div className={"absolute top-1 left-1 p-2"}>
        <Card className={"mb-1"}>
          <CardContent className={"flex w-fit p-2"}>
            <p className={"ml-1 font-medium"}>
              <b>{state.filteredData.length}</b> Estimates displayed from{" "}
              <b>
                {
                  Array.from(
                    new Set(
                      state.filteredData.map(
                        (item: any) => item.sourceSheetName
                      )
                    )
                  ).length
                }
              </b>{" "}
              unique sources
            </p>
          </CardContent>
        </Card>
        {
          isOldArbovirusMapProps(input) && 
            <MapExpandPlotsPrompt
          text={areVisualizationsExpanded ? "Hide Figures" : "See Figures"}
          onClick={
            areVisualizationsExpanded
              ? minimizeVisualizations
              : expandVisualizations
          }
        />
          
        }
        
      </div>
    </>
  );
}
