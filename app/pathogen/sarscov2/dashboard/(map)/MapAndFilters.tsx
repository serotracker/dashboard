"use client";

import useMap from "@/hooks/useMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Filters from "@/app/pathogen/sarscov2/dashboard/filters";
import React, { useContext } from "react";
import { ScrollText } from "lucide-react";
import useSarsCov2Data from "@/hooks/useSarsCov2Data";
import { SarsCov2ActionType, SarsCov2Context, setMapboxFilters } from "@/contexts/sarscov2-context";

export default function MapAndFilters() {
  const dataQuery = useSarsCov2Data();
  const state = useContext(SarsCov2Context);

  console.log("Context in MapAndFilters: ", state);

  // Might have to find a way to make this synchronous instead of asynchronous
  const { map, mapContainer } = useMap(dataQuery.data?.records ?? [], "SarsCov2");

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
        type: SarsCov2ActionType.UPDATE_FILTER,
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
            <Filters map={map} />
          </CardContent>
        </Card>
      </>
    );
  } else {
    return <span> Loading... </span>;
  }
}
