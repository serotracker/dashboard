/**
 * @file MapAndFilters Component
 * @description This component renders a Map with associated filters for the Arboviruses dashboard.
 * It includes checkboxes for different pathogens and a side panel with additional filters.
 * The map and filters are dynamically updated based on user interactions.
 */

"use client";

import useMap from "@/hooks/useMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Filters from "@/app/pathogen/arbovirus/dashboard/filters";
import React, { useContext } from "react";
import useArboData from "@/hooks/useArboData";
import {
  ArboActionType,
  ArboContext,
  setMapboxFilters,
} from "@/contexts/arbo-context";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { ScrollText } from "lucide-react";

export const pathogenColorsTailwind: { [key: string]: string } = {
  ZIKV: "border-[#A0C4FF] data-[state=checked]:bg-[#A0C4FF]",
  CHIKV: "border-[#9BF6FF] data-[state=checked]:bg-[#9BF6FF]",
  WNV: "border-[#CAFFBF] data-[state=checked]:bg-[#CAFFBF]",
  DENV: "border-[#FFADAD] data-[state=checked]:bg-[#FFADAD]",
  YF: "border-[#FFD6A5] data-[state=checked]:bg-[#FFD6A5]",
  MAYV: "border-[#FDFFB6] data-[state=checked]:bg-[#FDFFB6]",
};

export const pathogenColors: { [key: string]: string } = {
  ZIKV: "#A0C4FF",
  CHIKV: "#9BF6FF",
  WNV: "#CAFFBF",
  DENV: "#FFADAD",
  YF: "#FFD6A5",
  MAYV: "#FDFFB6",
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

  const { map, mapContainer } = useMap(dataQuery.data.records, "Arbovirus");

  if (dataQuery.isSuccess && dataQuery.data) {
    setMapboxFilters(state.selectedFilters, map!);

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
          map: map,
        },
      });
    };

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
          <CardContent ref={mapContainer} className={"w-full h-full p-0"} />
          <Card className={"absolute bottom-1 right-1 "}>
            <CardHeader className={"py-3"}>
              <p>Pathogens</p>
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
              <ScrollText />
              <p className={"ml-1 font-medium"}>{state.filteredData.length}</p>
            </CardContent>
          </Card>
        </Card>
        <Card className={"col-span-2 row-span-2 overflow-y-auto"}>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <Filters map={map} />
          </CardContent>
        </Card>
      </>
    );
  } else {
    return <span> Loading... </span>;
  }
}
