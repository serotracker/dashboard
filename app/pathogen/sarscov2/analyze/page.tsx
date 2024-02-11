import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filters } from "@/app/pathogen/sarscov2/dashboard/filters";
import { ScrollArea } from "@/components/ui/scroll-area";
import SarsCov2DataTable from "./SarsCov2DataTable";

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

export default function SarsCov2Analyze() {
  return (
    <>
      <div className={"col-span-5 row-span-2 flex flex-col overflow-auto"}>
        !!!Visaualizations coming soon!!!
      </div>
      <div className={"col-span-5 row-span-2 overflow-auto"}>
        <SarsCov2DataTable />
      </div>
      <Card className={"col-span-2 row-span-2"}>
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
