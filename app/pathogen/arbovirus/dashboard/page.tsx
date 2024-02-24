"use client";
import React, { useCallback, useContext, useMemo } from "react";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ArbovirusMap } from "@/app/pathogen/arbovirus/dashboard/(map)/ArbovirusMap";
import { LegendConfiguration, WHORegionAndArbovirusBar } from "../analyze/recharts";
import { FilterableField, Filters } from "./filters";
import { CardConfiguration, CardStyle, CardType, getConfigurationForCard } from "@/components/ui/card-collection/card-collection-types";
import { CardCollection } from "@/components/ui/card-collection/card-collection";
import { useMap } from "react-map-gl";
import { useRouter } from "next/navigation";
import { VisualizationId, getVisualizationInformationFromVisualizationId } from "../visualizations/visualizations";
import { EstimateCountByUnRegionAndArbovirusGraph } from "../analyze/recharts/estimate-count-by-un-region-and-arbovirus-graph";
import { ArboContext } from "@/contexts/arbo-context";
import { useArboDataInsights } from "@/hooks/useArboDataInsights";
import { RechartsVisualization } from "../analyze/recharts/recharts-visualization";

export default function ArbovirusDashboard() {
  // Need to make the visualizations dynamic. Unsure how to do this well using CSS.
  const allMaps = useMap();
  const router = useRouter();
  const { filteredData } = useContext(ArboContext);
  const { getNumberOfUniqueValuesForField } = useArboDataInsights();

  const renderPlotCardContent = useCallback(({cardConfigurations}: {cardConfigurations: CardConfiguration[]}) => {
    const areLessThanTwoWHORegionsPresentInData = getNumberOfUniqueValuesForField({
      filteredData: filteredData.filter((dataPoint) => !!dataPoint.whoRegion),
      fieldName: 'whoRegion'
    }) < 2;

    const visualizationId = areLessThanTwoWHORegionsPresentInData
      ? VisualizationId.ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS
      : VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS;

    const renderVisualization = visualizationId === VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS 
      ? () => <WHORegionAndArbovirusBar legendConfiguration={LegendConfiguration.BOTTOM_ALIGNED} />
      : () => <EstimateCountByUnRegionAndArbovirusGraph legendConfiguration={LegendConfiguration.BOTTOM_ALIGNED} />;

    const visualizationInformation = getVisualizationInformationFromVisualizationId({ visualizationId });

    return (
      <CardContent className={"px-0 h-full flex flex-col"}>
        <RechartsVisualization visualizationInformation={visualizationInformation} />
      </CardContent>
    );
  }, [router, filteredData, getNumberOfUniqueValuesForField])

  const renderMapCardContent = useCallback(({cardConfigurations}: {cardConfigurations: CardConfiguration[]}) => (
    <ArbovirusMap
      minimizeVisualizations={() => {getConfigurationForCard(cardConfigurations, 'plots', CardType.EXPANDABLE).minimizeCard()}}
      expandVisualizations={() => {getConfigurationForCard(cardConfigurations, 'plots', CardType.EXPANDABLE).expandCard()}}
      areVisualizationsExpanded={getConfigurationForCard(cardConfigurations, 'plots', CardType.EXPANDABLE).isExpanded}
    />
  ), [])

  const renderFiltersCardContent = useCallback(({ cardConfigurations }: {cardConfigurations: CardConfiguration[]}) => (
    <>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <Filters excludedFields={[FilterableField.pathogen]} />
      </CardContent>
    </>
  ), [])

  const cardInputData = useMemo(() => [
    {
      // order determines where the card will be positioned. Cards with higher order values will be placed to the right of cards with lower order values.
      order: 1,
      cardId: 'plots',
      type: CardType.EXPANDABLE as const,
      isExpandedByDefault: true,
      expandedColumnCount: 4,
      cardClassname: "row-span-2 pr-4 pb-4",
      renderCardContent: renderPlotCardContent,
      cardStyle: CardStyle.CARD
    },
    {
      order: 2,
      cardId: 'map',
      type: CardType.FILL_REMAINING_SPACE as const,
      cardClassname: "w-full h-full overflow-hidden row-span-2 relative",
      renderCardContent: renderMapCardContent,
      onCardSizeChange: () => {
        if(allMaps['arboMap']) {
          allMaps['arboMap'].resize();
        }
      },
      cardStyle: CardStyle.CARD
    },
    {
      order: 3,
      cardId: 'filters',
      type: CardType.FIXED as const,
      columnCount: 2,
      cardClassname: "row-span-2 overflow-y-auto",
      renderCardContent: renderFiltersCardContent,
      cardStyle: CardStyle.CARD
    }
  ], [renderPlotCardContent, renderMapCardContent, renderFiltersCardContent, allMaps])

  return <CardCollection cardInputData={cardInputData} columnCountToFill={12} />
}
