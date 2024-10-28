
'use client';

import { LinearLegendColourGradient, LinearLegendColourGradientProps } from "@/components/customs/linear-legend-colour-gradient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


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

interface CountryHighlightLayerLegendProps {
  className?: string;
  legendEntries: CountryHighlightLayerLegendEntry[];
  linearLegendColourGradientConfiguration: LinearLegendColourGradientConfiguration;
  freeTextEntries: FreeTextEntry[];
}

export const CountryHighlightLayerLegend = (input: CountryHighlightLayerLegendProps) => {
  if(
    input.legendEntries.length === 0 &&
    input.freeTextEntries.length === 0 &&
    input.linearLegendColourGradientConfiguration.enabled === false
  ) {
    return null;
  }

  return (
    <Card className={input.className}>
      <CardHeader className={"py-3"}>
        <h2 className="text-lg">Legend</h2>
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
      </CardContent>
    </Card>
  )
}