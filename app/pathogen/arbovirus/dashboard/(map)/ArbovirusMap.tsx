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
import { ArboContext } from "@/contexts/arbo-context";
import { ArboStudyPopupContent } from "../ArboStudyPopupContent";
import { PathogenMap } from "@/components/ui/pathogen-map/pathogen-map";
import { MapArbovirusFilter } from "./MapArbovirusFilter";
import { MapExpandPlotsPrompt } from "./MapExpandPlotsPrompt";
import { MapArbovirusStudySubmissionPrompt } from "./MapArbovirusStudySubmissionPrompt";
import { ArboCountryPopupContent } from "../ArboCountryPopUpContent";

export const pathogenColorsTailwind: { [key: string]: string } = {
  ZIKV: "border-zikv data-[state=checked]:bg-zikv",
  CHIKV: "border-chikv data-[state=checked]:bg-chikv",
  WNV: "border-wnv data-[state=checked]:bg-wnv",
  DENV: "border-denv data-[state=checked]:bg-denv",
  YF: "border-yf data-[state=checked]:bg-yf",
  MAYV: "border-mayv data-[state=checked]:bg-mayv",
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

export function ArbovirusMap(props: ArbovirusMapProps) {
  const state = useContext(ArboContext);
  const [ isStudySubmissionPromptVisible, setStudySubmissionPromptVisibility ] = useState(true);
  const { data }  = useArboData();

  if (!data) {
    return <span> Loading... </span>;
  }

  return (
    <>
      <div className={"w-full h-full p-0"}>
        <PathogenMap
          id="arboMap"
          baseCursor=""
          layers={[
            {
              id: "Arbovirus-pins",
              isDataUsedForCountryHighlighting: true,
              cursor: "pointer",
              dataPoints: state.filteredData,
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
        {isOldArbovirusMapProps(props) && 
          //TODO: SeanKennyNF remove the expand plots prompt when the website redesign is fully rolled out.
          <MapExpandPlotsPrompt
            text={props.areVisualizationsExpanded ? "Hide Figures" : "See Figures"}
            onClick={props.areVisualizationsExpanded ? props.minimizeVisualizations : props.expandVisualizations}
          />
        }
      </div>
    </>
  );
}
