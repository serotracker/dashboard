"use client"

import React, { useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Filters from "@/app/pathogen/arbovirus/dashboard/filters";
import ArboDataTable from "@/app/pathogen/arbovirus/analyze/ArboDataTable";
import { AntibodyPathogenBar, MedianSeroPrevByWHOregion, MedianSeroPrevByWHOregionAndAgeGroup, StudyCountOverTime, StudyCountOverTimeBySampleFrame, Top10CountriesByPathogenStudyCount, WHORegionAndArbovirusBar } from "@/app/pathogen/arbovirus/analyze/recharts";
import clsx from "clsx";
import { CardConfiguration, CardStyle, CardType, getConfigurationForCard } from "@/components/ui/card-collection/card-collection-types";
import { CardCollection } from "@/components/ui/card-collection/card-collection";

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
  const renderPlotCardContent = useCallback(({ cardConfigurations }: {cardConfigurations: CardConfiguration[]}) => (
    <>
      <VisualizationCard title={"Median seroprevalence by WHO region and age group"} height="h-full">
        <MedianSeroPrevByWHOregionAndAgeGroup />
      </VisualizationCard>
      <VisualizationCard title={"Estimate count by WHO region and arbovirus"}>
        <WHORegionAndArbovirusBar />
      </VisualizationCard>
      <VisualizationCard title={"Estimate count by arbovirus & antibody type"}>
        <AntibodyPathogenBar />
      </VisualizationCard>
      <VisualizationCard title={"Median seroprevalence by WHO Region"} height="h-full">
        <MedianSeroPrevByWHOregion />
      </VisualizationCard>
      <VisualizationCard title={"Cumulative estimate count over time by arbovirus"}>
        <StudyCountOverTime />
      </VisualizationCard>
      <VisualizationCard title={"Cumulative estimate count over time by sample frame"}  height="h-full 2xl:h-3/4">
        <StudyCountOverTimeBySampleFrame/>
      </VisualizationCard>
      <VisualizationCard title={"Top ten countries reporting estimates by arbovirus"} height="h-full">
        <Top10CountriesByPathogenStudyCount />
      </VisualizationCard>
    </>
  ), []);
  const renderTableCardContent = useCallback(({ cardConfigurations }: {cardConfigurations: CardConfiguration[]}) => (
    <ArboDataTable
      expandFilters={() => {getConfigurationForCard(cardConfigurations, 'filters', CardType.EXPANDABLE).expandCard()}}
      minimizeFilters={() => {getConfigurationForCard(cardConfigurations, 'filters', CardType.EXPANDABLE).minimizeCard()}}
      areFiltersExpanded={getConfigurationForCard(cardConfigurations, 'filters', CardType.EXPANDABLE).isExpanded}
    />
  ), []);
  const renderFiltersCardContent = useCallback(({ cardConfigurations }: {cardConfigurations: CardConfiguration[]}) => (
    <>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <Filters />
      </CardContent>
    </>
  ), []);

  const cardInputData = useMemo(() => [
    {
      order: 1,
      cardId: 'plots',
      type: CardType.FIXED as const,
      columnCount: 5,
      cardClassname: "row-span-2 overflow-auto",
      renderCardContent: renderPlotCardContent,
      cardStyle: CardStyle.DIV
    },
    {
      order: 2,
      cardId: 'table',
      type: CardType.FILL_REMAINING_SPACE as const,
      cardClassname: "row-span-2 overflow-auto",
      renderCardContent: renderTableCardContent,
      cardStyle: CardStyle.DIV
    },
    {
      order: 3,
      cardId: 'filters',
      type: CardType.EXPANDABLE as const,
      expandedColumnCount: 2,
      isExpandedByDefault: true,
      cardClassname: "row-span-2 overflow-y-auto",
      renderCardContent: renderFiltersCardContent,
      cardStyle: CardStyle.CARD
    }
  ], [renderPlotCardContent, renderTableCardContent, renderFiltersCardContent])

  return <CardCollection cardInputData={cardInputData} columnCountToFill={12} />
}
