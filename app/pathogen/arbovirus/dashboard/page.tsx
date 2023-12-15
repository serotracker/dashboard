"use client";
import React, { useState, useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

import { ArbovirusMap } from "@/app/pathogen/arbovirus/dashboard/(map)/ArbovirusMap";
import { MedianSeroPrevByWHOregion } from "../analyze/recharts";
import Filters, { FilterableField } from "./filters";
import { useCardCollectionConfiguration } from "@/components/ui/card-collection/use-card-collection-configuration";
import { CardType } from "@/components/ui/card-collection/card-collection-types";
import { CardCollection } from "@/components/ui/card-collection/card-collection";

export default function ArbovirusDashboard() {
  // Need to make the visualizations dynamic. Unsure how to do this well using CSS.

  const { cardConfiguration } = useCardCollectionConfiguration({
    cardInputData: [{
      order: 1,
      cardId: 'plots',
      type: CardType.EXPANDABLE,
      isExpandedByDefault: true,
      expandedColumnCount: 4,
      cardClassname: "row-span-2 pr-4 pb-4",
      renderCardContent: ({cardConfiguration}) => (
        <CardContent className={"px-0 h-full flex flex-col"}>
          <div className={"flex space-between py-4"}>
            <h3 className="w-full text-center text-lg">
              Median seroprevalence of arboviruses by WHO region
            </h3>
            <button aria-label="Close graphs">
              <X onClick={() => {(cardConfiguration.find((element) => element.cardId === 'plots') as any).minimizeCard()}} className={"h-full"}/>
            </button>
          </div>
          <MedianSeroPrevByWHOregion />
        </CardContent>
      )
    }, {
      order: 2,
      cardId: 'map',
      type: CardType.FILL_REMAINING_SPACE,
      cardClassname: "w-full h-full overflow-hidden row-span-2 relative",
      renderCardContent: ({ cardConfiguration }) => (
        <ArbovirusMap
          expandVisualizations={() => {(cardConfiguration.find((element) => element.cardId === 'plots') as any).expandCard()}}
          areVisualizationsExpanded={(cardConfiguration.find((element) => element.cardId === 'plots') as any).isExpanded}
        />
      )
    }, {
      order: 3,
      cardId: 'filters',
      type: CardType.FIXED,
      columnCount: 2,
      cardClassname: "row-span-2 overflow-y-auto",
      renderCardContent: ({ cardConfiguration }) => (
        <>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <Filters excludedFields={[FilterableField.pathogen]} />
          </CardContent>
        </>
      )
    }],
    columnCountToFill: 12,
  });

  return <CardCollection cardConfiguration={cardConfiguration} />
}
