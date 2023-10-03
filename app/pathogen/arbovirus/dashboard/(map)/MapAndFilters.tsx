"use client";

import useMap from "@/hooks/useMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Filters from "@/app/pathogen/arbovirus/dashboard/filters";
import React, { useContext } from "react";
import useArboData from "@/hooks/useArboData";
import { ArboActionType, ArboContext } from "@/contexts/arbo-context";
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
      fetch("http://127.0.0.1:5000/data_provider/arbo/filter_options").then(
        (response) => response.json(),
      ),
  });

  // Might have to find a way to make this synchronous instead of asynchronous
  const { map, mapContainer } = useMap(dataQuery.data.records, state, "Arbovirus");

  if (dataQuery.isSuccess && dataQuery.data) {
    state.dispatch({
      type: ArboActionType.ADD_FILTERS_TO_MAP,
      payload: {
        map: map,
        data: dataQuery.data.records,
      },
    });

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

    return (
      <>
        <Card
          className={
            "w-full h-full overflow-hidden col-span-6 row-span-2 relative"
          }
        >
          <CardContent ref={mapContainer} className={"w-full h-full"} />
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
                                pathogen,
                              )
                            : false
                        }
                        onCheckedChange={(checked: boolean) => {
                          handleOnClickCheckbox(pathogen, checked);
                          console.log("Check clicked: ", pathogen, checked);
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
              <p className={"ml-1 font-medium"}>{state.filteredData?.length}</p>
            </CardContent>
          </Card>
        </Card>
        <Card className={"col-span-2 row-span-2"}>
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
