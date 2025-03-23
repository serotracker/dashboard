
'use client';

import { GenericTooltip } from "@/components/customs/generic-tooltip";
import { LinearLegendColourGradient, LinearLegendColourGradientProps } from "@/components/customs/linear-legend-colour-gradient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Link from "next/link";


export interface FreeTextEntry {
  text: string;
}

export interface CountryHighlightLayerLegendEntry {
  description: string;
  colour: string;
  icon?: (() => React.ReactNode) | undefined;
}

export interface EnabledLinearLegendColourGradientConfiguration {
  enabled: true;
  props: Omit<LinearLegendColourGradientProps, 'widthPx'>;
}

interface DisabledLinearLegendColourGradientConfiguration {
  enabled: false;
}

export type LinearLegendColourGradientConfiguration = 
  | EnabledLinearLegendColourGradientConfiguration
  | DisabledLinearLegendColourGradientConfiguration;

interface EnabledCloseButtonConfiguration {
  enabled: true;
  onClick: () => void;
}

interface DisabledCloseButtonConfiguration {
  enabled: false;
}

type CloseButtonConfiguration =
  | EnabledCloseButtonConfiguration
  | DisabledCloseButtonConfiguration;

export interface CountryHighlightLayerLegendProps {
  className?: string;
  legendEntries: CountryHighlightLayerLegendEntry[];
  linearLegendColourGradientConfiguration: LinearLegendColourGradientConfiguration;
  freeTextEntries: FreeTextEntry[];
  closeButtonConfiguration: CloseButtonConfiguration;
  legendTooltipContent: React.ReactNode | undefined;
}

export const CountryHighlightLayerLegend = (input: CountryHighlightLayerLegendProps) => {
  const { closeButtonConfiguration } = input;

  if(
    input.legendEntries.length === 0 &&
    input.freeTextEntries.length === 0 &&
    input.linearLegendColourGradientConfiguration.enabled === false
  ) {
    return null;
  }

  return (
    <Card className={input.className}>
      <CardHeader className={"py-3 flex justify-between"}>
        <div className="flex justify-between">
          <div className="flex items-center">
            <h2 className="text-lg">Legend</h2>
            <GenericTooltip 
              className={cn(
                'ml-2',
                !input.legendTooltipContent ? 'hidden' : ''
              )}
              tooltipContent={input.legendTooltipContent}
            />
          </div>
          {closeButtonConfiguration.enabled === true ? (
            <button
              className='p-1 rounded-full hover:bg-gray-200 m-0'
              onClick={() => closeButtonConfiguration.onClick()}
              aria-label='Hide legend'
            >
              <X />
            </button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {input.linearLegendColourGradientConfiguration.enabled === true
          ? <LinearLegendColourGradient widthPx={500} {...input.linearLegendColourGradientConfiguration.props} />
          : null
        }
        {input.legendEntries.map((entry) => (
          <div className="items-center flex space-x-2 my-1" key={`${entry.description}-${entry.colour}`}>
            <div
              className={`w-[1em] ${entry.colour} h-[1em] border-2 border-gray-500`}
              style={{ backgroundColor: entry.colour}}
            ></div>
            {entry.icon ? <entry.icon /> : null}
            <p>{entry.description}</p>
          </div>
        ))}
        {input.freeTextEntries.map((entry) => (
          <p key={`${entry.text}`}> {entry.text} </p>
        ))}
        <div style={{ width: '500px' }}>
          <p className='inline text-xs'>Unpublished camel population map based on a FAO elaboration from the Global Livestock Impact Mapping System (GLIMS) database and adjusted to FAOSTAT 2020. Country boundaries based on </p>
          <p className="inline text-xs font-bold">UN Geospatial</p>
          <p className='inline text-xs'>. 2023. Map of the World. In: </p>
          <p className='inline text-xs italic'>United Nations</p>
          <p className='inline text-xs'>. [Cited: November 2024].</p>
          <Link className="inline text-link text-xs" href="www.un.org/geospatial/content/map-world-1" target="__blank" rel="noopener noreferrer">www.un.org/geospatial/content/map-world-1</Link>
        </div>
      </CardContent>
    </Card>
  )
}