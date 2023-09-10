import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  CountOfStudiesStratifiedByAntibodyAndPathogen,
  CustomResponsiveBar,
  PathogenSeroprevalenceBoxPlot,
} from "@/app/pathogen/arbovirus/analyze/nivo-vis";

import MapAndFilters from "@/app/pathogen/arbovirus/dashboard/(map)/MapAndFilters";

export default function ArbovirusDashboard() {
  // Need to make the visualizations dynamic. Unsure how to do this well using CSS.
  return (
    <div
      className={
        "grid gap-4 grid-cols-16 grid-rows-2 grid-flow-col w-full h-full"
      }
    >
      <Card className={"row-span-1 col-span-4"}>
        <CardHeader>
          <CardTitle>Count Antibody Pathogen</CardTitle>
        </CardHeader>
        <CardContent className={"px-0 h-72 w-full"}>
          <CountOfStudiesStratifiedByAntibodyAndPathogen />
        </CardContent>
      </Card>
      <Card className={"row-span-1 col-span-4"}>
        <CardHeader>
          <CardTitle>Patho Sero Boxplot</CardTitle>
        </CardHeader>
        <CardContent className={"px-0 h-72 w-full"}>
          {/*<CustomResponsiveBar />*/}
          <PathogenSeroprevalenceBoxPlot />
        </CardContent>
      </Card>
      <MapAndFilters />
    </div>
  );
}
