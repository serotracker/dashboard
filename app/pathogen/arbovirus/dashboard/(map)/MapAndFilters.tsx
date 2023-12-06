/**
 * @file MapAndFilters Component
 * @description This component renders a Map with associated filters for the Arboviruses dashboard.
 * It includes checkboxes for different pathogens and a side panel with additional filters.
 * The map and filters are dynamically updated based on user interactions.
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Filters, {
  FilterableField,
} from "@/app/pathogen/arbovirus/dashboard/filters";
import React, { useContext } from "react";
import useArboData from "@/hooks/useArboData";
import { ArboActionType, ArboContext } from "@/contexts/arbo-context";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { ArboStudyPopupContent } from "../ArboStudyPopupContent";
import { PathogenMap } from "@/components/ui/pathogen-map/pathogen-map";

export const pathogenColorsTailwind: { [key: string]: string } = {
  ZIKV: "border-zikv data-[state=checked]:bg-zikv",
  CHIKV: "border-chikv data-[state=checked]:bg-chikv",
  WNV: "border-wnv data-[state=checked]:bg-wnv",
  DENV: "border-denv data-[state=checked]:bg-denv",
  YF: "border-yf data-[state=checked]:bg-yf",
  MAYV: "border-mayv data-[state=checked]:bg-mayv",
};

// TODO: Needs to be synced with tailwind pathogne colors. How?
export const pathogenColors: { [key: string]: string } = {
  ZIKV: "#A0C4FF",
  CHIKV: "#9BF6FF",
  WNV: "#CAFFBF",
  DENV: "#FFADAD",
  YF: "#FFD6A5",
  MAYV: "#c5a3ff",
};

export default function MapAndFilters() {
  const dataQuery = useArboData();
  const state = useContext(ArboContext);

  const filters = useQuery({
    queryKey: ["ArbovirusFilters"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/arbo/filter_options`).then(
        (response) => response.json()
      ),
  });

  if (dataQuery.isSuccess && dataQuery.data) {
    const handleOnClickCheckbox = (pathogen: string, checked: boolean) => {
      const value = state.selectedFilters.pathogen;

      if (checked) {
        value.push(pathogen);
      } else {
        value.splice(value.indexOf(pathogen), 1);
      }

      state.dispatch({
        type: ArboActionType.UPDATE_FILTER,
        payload: {
          data: dataQuery.data.records,
          filter: "pathogen",
          value: value,
        },
      });
    };

    const uniqueNumberOfSources = Array.from(new Set(state.filteredData.map((item: any) => item.source_sheet_name))).length;

    const pathogenOrder = [
      'ZIKV',
      'DENV',
      'CHIKV',
      'YF',
      'WNV',
      'MAYV',
    ];

    return (
      <>
        <Card
          className={
            "w-full h-full overflow-hidden col-span-6 row-span-2 relative"
          }
        >
          <div className={"w-full h-full p-0"}>
            <PathogenMap
              id="arboMap"
              baseCursor=""
              layers={[
                {
                  id: "Arbovirus-pins",
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
                      "#FDFFB6",
                      "#FFFFFC",
                    ],
                    "circle-radius": 8,
                    "circle-stroke-color": "#333333",
                    "circle-stroke-width": 1,
                  },
                },
              ]}
              generatePopupContent={(record) => (
                <ArboStudyPopupContent record={record} />
              )}
            />
          </div>
          <Card className={"absolute bottom-1 right-1 "}>
            <CardHeader className={"py-3"}>
              <p>Arboviruses</p>
            </CardHeader>
            <CardContent className={"flex justify-center flex-col"}>
              {pathogenOrder.map((pathogenAbbreviation: string) => {
                // Map abbreviations to full names
                const pathogenFullName =
                  pathogenAbbreviation === "ZIKV"
                    ? "Zika Virus"
                    : pathogenAbbreviation === "DENV"
                    ? "Dengue Virus"
                    : pathogenAbbreviation === "CHIKV"
                    ? "Chikungunya Virus"
                    : pathogenAbbreviation === "YF"
                    ? "Yellow Fever"
                    : pathogenAbbreviation === "WNV"
                    ? "West Nile Virus"
                    : pathogenAbbreviation === "MAYV"
                    ? "Mayaro Virus"
                    : pathogenAbbreviation;

                return (
                  <div
                    key={pathogenAbbreviation}
                    className="items-top flex space-x-2 my-1"
                  >
                    <Checkbox
                      id={`checkbox-${pathogenAbbreviation}`}
                      className={pathogenColorsTailwind[pathogenAbbreviation]}
                      checked={
                        state.selectedFilters["pathogen"]
                          ? state.selectedFilters["pathogen"].includes(
                              pathogenAbbreviation
                            )
                          : false
                      }
                      onCheckedChange={(checked: boolean) => {
                        handleOnClickCheckbox(pathogenAbbreviation, checked);
                      }}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={`checkbox-${pathogenAbbreviation}`}
                        className={
                          "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        }
                      >
                        {pathogenFullName}
                      </label>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <Card className={"absolute top-1 left-1 p-2"}>
            <CardContent className={"flex w-fit p-0"}>
              <p className={"ml-1 font-medium"}><b>{state.filteredData.length}</b> Estimates displayed from <b>{Array.from(new Set(state.filteredData.map((item: any) => item.source_sheet_name))).length}</b> unique sources</p>
            </CardContent>
          </Card>
        </Card>
        <Card className={"col-span-2 row-span-2 overflow-y-auto"}>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <Filters excludedFields={[FilterableField.pathogen]} />
          </CardContent>
        </Card>
      </>
    );
  } else {
    return <span> Loading... </span>;
  }
}
