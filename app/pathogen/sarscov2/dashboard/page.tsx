import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import MapAndFilters from "@/app/pathogen/sarscov2/dashboard/(map)/MapAndFilters";

export default function SarsCov2Dashboard() {
  // Need to make the visualizations dynamic. Unsure how to do this well using CSS.
  return (
    <>
      <Card className={"row-span-1 col-span-4"}>
        <CardHeader>
          <CardTitle>Vis 1</CardTitle>
        </CardHeader>
        <CardContent className={"px-0 h-72 w-full"}>
        </CardContent>
      </Card>
      <Card className={"row-span-1 col-span-4"}>
        <CardHeader>
          <CardTitle>Vis 2</CardTitle>
        </CardHeader>
        <CardContent className={"px-0 h-72 w-full"}>
        </CardContent>
      </Card>
      <MapAndFilters />
    </>
  );
}
