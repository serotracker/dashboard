import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CountOfStudiesStratifiedByAntibodyAndPathogen,
  CustomResponsiveBar,
} from "@/app/pathogen/arbovirus/analyze/nivo-vis";

export default function ArboAnalyze() {
  return (
    <div
      className={
        "grid gap-4 grid-cols-12 grid-rows-2 grid-flow-col w-full h-full overflow-scroll"
      }
    >
      <Card className={"col-span-6"}>
        <CardHeader>
          <CardTitle>Count Antibody Pathogen - Client</CardTitle>
        </CardHeader>
        <CardContent className={"px-0 h-72 w-full"}>
          <CountOfStudiesStratifiedByAntibodyAndPathogen />
        </CardContent>
      </Card>
      <Card className={"col-span-6"}>
        <CardHeader>
          <CardTitle>Count Assay Pathogen - Server</CardTitle>
        </CardHeader>
        <CardContent className={"px-0 h-72 w-full"}>
          <CustomResponsiveBar />
        </CardContent>
      </Card>
    </div>
  );
}
