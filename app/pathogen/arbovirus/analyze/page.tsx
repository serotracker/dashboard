"use client"

import React, { useCallback, useContext, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filters } from "@/app/pathogen/arbovirus/dashboard/filters";
import { ArboDataTable } from "@/app/pathogen/arbovirus/analyze/ArboDataTable";
import clsx from "clsx";
import { CardConfiguration, CardStyle, CardType, getConfigurationForCard } from "@/components/ui/card-collection/card-collection-types";
import { CardCollection } from "@/components/ui/card-collection/card-collection";
import { VisualizationId, VisualizationInformation, addToVisualizationInformation } from "../visualizations/visualizations";
import { useRouter } from "next/navigation";
import { ArboContext } from "@/contexts/arbo-context";
import { useArboDataInsights } from "@/hooks/useArboDataInsights";
import { RechartsVisualization } from "./recharts/recharts-visualization";

const VisualizationCard = (props: {
  visualizationInformation: VisualizationInformation & { height: string | undefined }
}) => (
  <Card className={clsx("mb-4 mr-4 p-4 pt-0", props.visualizationInformation.height ?? "h-full sm:h-3/4 2xl:h-1/2 relative")}>
    <CardContent className={"px-0 h-full flex flex-col"}>
      <RechartsVisualization visualizationInformation={props.visualizationInformation} />
    </CardContent>
  </Card>
);

export default function ArboAnalyze() {
  const router = useRouter();
  const { filteredData } = useContext(ArboContext);
  const { getNumberOfUniqueValuesForField } = useArboDataInsights();

  const renderPlotCardContent = useCallback(({ cardConfigurations }: {cardConfigurations: CardConfiguration[]}) => {
    const allVisualizationInformationWithHeights = addToVisualizationInformation({
      [VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS]: { height: undefined },
      [VisualizationId.ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS]: { height: undefined },
      [VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION]: { height: "h-full" },
      [VisualizationId.CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME]: { height: "h-full" },
      [VisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE ]: { height: undefined },
      [VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME]: { height: "h-full 2xl:h-3/4" },
      [VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP]: { height: "h-full" },
    })

    const areLessThanTwoWHORegionsPresentInData = getNumberOfUniqueValuesForField({
      filteredData: filteredData.filter((dataPoint) => !!dataPoint.whoRegion),
      fieldName: 'whoRegion'
    }) < 2;

    const visualizationsToDisplay = areLessThanTwoWHORegionsPresentInData
      ? allVisualizationInformationWithHeights.filter((visualizationInfo) => visualizationInfo.id !== VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS)
      : allVisualizationInformationWithHeights.filter((visualizationInfo) => visualizationInfo.id !== VisualizationId.ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS)

    return (
      <>
        {visualizationsToDisplay.map((visualizationInformation) => (
          <VisualizationCard 
            key={visualizationInformation.id}
            visualizationInformation={visualizationInformation}
          />
        ))}
      </>
    );
  }, [router, filteredData, getNumberOfUniqueValuesForField]);

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
