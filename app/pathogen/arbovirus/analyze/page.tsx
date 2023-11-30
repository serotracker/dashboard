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
import { AntibodyPathogenBar, StudyCountOverTime, StudyCountOverTimeBySampleFrame, Top10CountriesByPathogenStudyCount, WHORegionAndArbovirusBar } from "./recharts";
import clsx from "clsx";

const VisualizationCard = (props: {
  title: string;
  children: React.ReactNode;
  height?: string;
}) => {
  
  
  return (
    <Card className={clsx("mb-4 mr-4 p-4 pt-0", props.height ?? "h-full sm:h-3/4 2xl:h-1/2 relative")}>
      <CardContent className={"px-0 h-full flex flex-col"}>
        <h3 className="py-4 w-full text-center text-lg">{props.title}</h3>
        {props.children}
      </CardContent>
    </Card>
  );
};

export default function ArboAnalyze() {
  return (
    <>
      <div className={"col-span-5 row-span-2 overflow-auto"}>
        <VisualizationCard title={"Figure 1. Study count by pathogen & antibody type"}>
          <AntibodyPathogenBar />
        </VisualizationCard>
        <VisualizationCard title={"Figure 2. Cumulative study count over time by sample frame"}  height="h-full 2xl:h-3/4">
          <StudyCountOverTimeBySampleFrame/>
        </VisualizationCard>
        <VisualizationCard title={"Figure 3. Cumulative study count over time by pathogen"}>
          <StudyCountOverTime />
        </VisualizationCard>
        <VisualizationCard title={"Figure 4. Top ten countries with most studies by pathogen"} height="h-full">
          <Top10CountriesByPathogenStudyCount />
        </VisualizationCard>
        <VisualizationCard title={"Figure 5. Study Count by WHO region and Pathogen"}>
          <WHORegionAndArbovirusBar />
        </VisualizationCard>
      </div>
      <div className={"col-span-5 row-span-2 overflow-auto"}>
        <ArboDataTable />
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
