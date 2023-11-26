import React from "react";

import { Card, CardContent} from "@/components/ui/card";

import MapAndFilters from "@/app/pathogen/arbovirus/dashboard/(map)/MapAndFilters";
import {
  AntibodyPathogenBar,
  StudyCountOverTime,
} from "../analyze/recharts";

export default function ArbovirusDashboard() {
  // Need to make the visualizations dynamic. Unsure how to do this well using CSS.
  return (
    <>
      <Card className={"row-span-1 col-span-4 px-4"}>
        <CardContent className={"px-0 h-full flex flex-col"}>
          <h3 className="py-4 w-full text-center text-lg">
            Study count by pathogen & antibody type
          </h3>
          <AntibodyPathogenBar />
        </CardContent>
      </Card>
      <Card className={"row-span-1 col-span-4 px-4"}>
        <CardContent className={"px-0 h-full flex flex-col"}>
          <h3 className="py-4 w-full text-center text-lg">
            Cumulative study count over time by pathogen
          </h3>
          <StudyCountOverTime />
        </CardContent>
      </Card>
      <MapAndFilters />
    </>
  );
}
