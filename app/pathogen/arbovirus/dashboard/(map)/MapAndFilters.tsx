"use client";

import useMap from "@/hooks/useMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Filters from "@/app/pathogen/arbovirus/dashboard/filters";
import React from "react";

export default function MapAndFilters() {
  const { map, mapContainer } = useMap(["ArbovirusRecords"], () =>
    fetch("http://localhost:5000/data_provider/records/arbo").then((response) =>
      response.json(),
    ),
  );

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
          <Filters map={map.current} />
        </CardContent>
      </Card>
    </>
  );
}
