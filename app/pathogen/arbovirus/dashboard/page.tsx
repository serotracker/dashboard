"use client";
import React, { useCallback, useMemo } from "react";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ArbovirusMap } from "@/app/pathogen/arbovirus/dashboard/(map)/ArbovirusMap";
import { MedianSeroPrevByWHOregion } from "../analyze/recharts";
import { FilterableField, Filters } from "./filters";
import { CardConfiguration, CardStyle, CardType, getConfigurationForCard } from "@/components/ui/card-collection/card-collection-types";
import { CardCollection } from "@/components/ui/card-collection/card-collection";
import { useMap } from "react-map-gl";
import { ZoomIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { VisualizationId, getVisualizationInformationFromVisualizationId } from "../visualizations/visualizations";

export default function ArbovirusDashboard() {
  // Need to make the visualizations dynamic. Unsure how to do this well using CSS.
  const allMaps = useMap();
  const router = useRouter();

  const renderPlotCardContent = useCallback(({cardConfigurations}: {cardConfigurations: CardConfiguration[]}) => {
    const visualizationId = VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS;
    const visualizationInformation = getVisualizationInformationFromVisualizationId({ visualizationId });

    return (
      <CardContent className={"px-0 h-full flex flex-col"}>
        <div className="flex py-4">
          <h3 className="w-full text-center text-lg">
            {visualizationInformation.displayName}
          </h3>
          <button 
            onClick={() => router.push(`visualizations?visualization=${getVisualizationInformationFromVisualizationId({visualizationId: VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION}).urlParameter}&referrerRoute=/pathogen/arbovirus/dashboard`)}
            aria-label="See visualization in fullscreen"
          >
            <ZoomIn />
          </button>
        </div>
        {visualizationInformation.renderVisualization()}
      </CardContent>
    );
  }, [router])

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
