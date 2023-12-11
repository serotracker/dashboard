import React from "react";

import { Card, CardContent} from "@/components/ui/card";

import MapAndFilters from "@/app/pathogen/arbovirus/dashboard/(map)/MapAndFilters";
import {
  MedianSeroPrevByWHOregion,
} from "../analyze/recharts";

export default function ArbovirusDashboard() {
  // Need to make the visualizations dynamic. Unsure how to do this well using CSS.
  return (
    <>
      <Card className={"row-span-2 col-span-4 pr-4 pb-4"}>
        <CardContent className={"px-0 h-full flex flex-col"}>
          <h3 className="py-4 w-full text-center text-lg">
            Median seroprevalence of arboviruses by WHO region
          </h3>
          <MedianSeroPrevByWHOregion />
        </CardContent>
      </Card>
      <MapAndFilters />
    </>
  );
}
