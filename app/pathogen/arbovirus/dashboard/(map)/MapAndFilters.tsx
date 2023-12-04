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
import { ScrollText } from "lucide-react";
import { ArboStudyPopupContent } from "../ArboStudyPopupContent";
import { PathogenMap } from "@/components/ui/pathogen-map/pathogen-map";

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
              <p>Pathogens</p>
            </CardHeader>
            <CardContent className={"flex justify-center flex-col"}>
              {filters.isSuccess &&
                filters.data &&
                filters.data.pathogen.map((pathogen: string) => {
                  return (
                    <div
                      key={pathogen}
                      className="items-top flex space-x-2 my-1"
                    >
                      <Checkbox
                        id={`checkbox-${pathogen}`}
                        className={pathogenColorsTailwind[pathogen]}
                        checked={
                          state.selectedFilters["pathogen"]
                            ? state.selectedFilters["pathogen"].includes(
                                pathogen
                              )
                            : false
                        }
                        onCheckedChange={(checked: boolean) => {
                          handleOnClickCheckbox(pathogen, checked);
                        }}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`checkbox-${pathogen}`}
                          className={
                            "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          }
                        >
                          {pathogen}
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
        <Card className={"col-span-2 row-span-2"}>
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
