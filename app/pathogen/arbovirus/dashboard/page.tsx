"use client";
import React, { useCallback, useMemo } from "react";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

import { ArbovirusMap } from "@/app/pathogen/arbovirus/dashboard/(map)/ArbovirusMap";
import { MedianSeroPrevByWHOregion } from "../analyze/recharts";
import Filters, { FilterableField } from "./filters";
import { CardConfiguration, CardType, getConfigurationForCard } from "@/components/ui/card-collection/card-collection-types";
import { CardCollection } from "@/components/ui/card-collection/card-collection";
import { useMap } from "react-map-gl";

export default function ArbovirusDashboard() {
  // Need to make the visualizations dynamic. Unsure how to do this well using CSS.
  const allMaps = useMap();

  const renderPlotCardContent = useCallback(({cardConfigurations}: {cardConfigurations: CardConfiguration[]}) => (
    <CardContent className={"px-0 h-full flex flex-col"}>
      <div className={"flex space-between py-4"}>
        <h3 className="w-full text-center text-lg">
          Median seroprevalence of arboviruses by WHO region
        </h3>
        <button aria-label="Close graphs">
          <X onClick={() => {getConfigurationForCard(cardConfigurations, 'plots', CardType.EXPANDABLE).minimizeCard()}} className={"h-full"}/>
        </button>
      </div>
      <MedianSeroPrevByWHOregion />
    </CardContent>
  ), [])

  const renderMapCardContent = useCallback(({cardConfigurations}: {cardConfigurations: CardConfiguration[]}) => (
    <ArbovirusMap
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
      order: 1,
      cardId: 'plots',
      type: CardType.EXPANDABLE as const,
      isExpandedByDefault: false,
      expandedColumnCount: 4,
      cardClassname: "row-span-2 pr-4 pb-4",
      renderCardContent: renderPlotCardContent
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
      }
    },
    {
      order: 3,
      cardId: 'filters',
      type: CardType.FIXED as const,
      columnCount: 2,
      cardClassname: "row-span-2 overflow-y-auto",
      renderCardContent: renderFiltersCardContent
    }
  ], [renderPlotCardContent, renderMapCardContent, renderFiltersCardContent, allMaps])

  return <CardCollection cardInputData={cardInputData} columnCountToFill={12} />
}
