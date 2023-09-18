"use client";

import useMap from "@/hooks/useMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Filters from "@/app/pathogen/arbovirus/dashboard/filters";
import React, { useContext } from "react";
import useArboData from "@/hooks/useArboData";
import { ArboActionType, ArboContext } from "@/contexts/arbo-context";

export default function MapAndFilters() {
  const dataQuery = useArboData();
  const state = useContext(ArboContext);

  // Might have to find a way to make this synchronous instead of asynchronous
  const { map, mapContainer } = useMap(dataQuery.data.records, state);

  if (dataQuery.isSuccess && dataQuery.data) {
    state.dispatch({
      type: ArboActionType.ADD_FILTERS_TO_MAP,
      payload: {
        map: map,
        data: dataQuery.data.records,
      },
    });

    return (
      <>
        <Card className={"w-full h-full overflow-hidden col-span-9 row-span-2"}>
          <CardContent ref={mapContainer} className={"w-full h-full"} />
        </Card>
        <Card className={"col-span-3 row-span-2"}>
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
