import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CountOfStudiesStratifiedByAntibodyAndPathogen,
  CustomResponsiveBar,
  PathogenSeroprevalenceBoxPlot,
} from "@/app/pathogen/arbovirus/analyze/nivo-vis";
import Filters from "@/app/pathogen/arbovirus/dashboard/filters";
import ArboDataTable from "@/app/pathogen/arbovirus/analyze/ArboDataTable";
import { ScrollArea } from "@/components/ui/scroll-area";

const VisualizationCard = (props: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Card className={"mb-4 mr-4"}>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent className={"px-0 h-72"}>{props.children}</CardContent>
    </Card>
  );
};

export default function ArboAnalyze() {
  return (
    <>
      <div className={"col-span-5 row-span-2 flex flex-col overflow-auto"}>
        <VisualizationCard title={"Count Antibody Pathogen - Client"}>
          <CountOfStudiesStratifiedByAntibodyAndPathogen />
        </VisualizationCard>
        <VisualizationCard title={"Pathogen Seroprevalence"}>
          <PathogenSeroprevalenceBoxPlot />
        </VisualizationCard>
        <VisualizationCard title={"Count Assay Pathogen - Server"}>
          <CustomResponsiveBar />
        </VisualizationCard>
      </div>
      <div className={"col-span-5 row-span-2 overflow-auto"}>
        <ArboDataTable />
      </div>
      <Card className={"col-span-2 row-span-2 overflow-y-auto"}>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <Filters />
        </CardContent>
      </Card>
    </>
  );
}
