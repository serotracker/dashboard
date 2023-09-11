"use client";

import React, { useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CountOfStudiesStratifiedByAntibodyAndPathogen,
  CustomResponsiveBar,
  PathogenSeroprevalenceBoxPlot,
} from "@/app/pathogen/arbovirus/analyze/nivo-vis";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataTable } from "@/app/pathogen/arbovirus/analyze/data-table";
import { columns } from "@/app/pathogen/arbovirus/analyze/columns";
import { useQuery } from "@tanstack/react-query";
import useArboData from "@/hooks/useArboData";
import Filters from "@/app/pathogen/arbovirus/dashboard/filters";
import { ArboContext } from "@/contexts/arbo-context";

const VisualizationCard = (props: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Card className={"mb-4"}>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent className={"px-0 h-72"}>{props.children}</CardContent>
    </Card>
  );
};

export default function ArboAnalyze() {
  const dataQuery = useArboData();

  const state = useContext(ArboContext);

  if (dataQuery.isLoading) {
    return <div>Loading...</div>;
  } else if (dataQuery.isError) {
    return <div>Error...</div>;
  } else if (state && dataQuery.isSuccess && dataQuery.data) {
    return (
      <>
        <div className={"col-span-4 row-span-2 flex flex-col overflow-auto"}>
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
        <div className={"col-span-6 row-span-2 overflow-auto"}>
          <DataTable
            columns={columns}
            data={
              state.filteredData.length > 0
                ? state.filteredData
                : dataQuery.data.records
            }
          />
        </div>
        <div className={"col-span-2 row-span-2 overflow-auto"}>
          <Filters />
        </div>
      </>
    );
  }
}
