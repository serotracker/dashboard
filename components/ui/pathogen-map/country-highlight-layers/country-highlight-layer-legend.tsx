
'use client';

import { LinearLegendColourGradient } from "@/components/customs/linear-legend-colour-gradient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


export interface FreeTextEntry {
  text: string;
}

export interface CountryHighlightLayerLegendEntry {
  description: string;
  colour: string;
  icon?: (() => React.ReactNode) | undefined;
}

interface CountryHighlightLayerLegendProps {
  className?: string;
  legendEntries: CountryHighlightLayerLegendEntry[];
  freeTextEntries: FreeTextEntry[];
}

export const CountryHighlightLayerLegend = (input: CountryHighlightLayerLegendProps) => {
  if(input.legendEntries.length === 0 && input.freeTextEntries.length === 0) {
    return null;
  }

  return (
    <Card className={input.className}>
      <CardHeader className={"py-3"}>
        <h2 className="text-lg">Legend</h2>
      </CardHeader>
      <CardContent>
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
        <LinearLegendColourGradient
          ticks={[{
            numericValue: 0,
            colourCode: '#E28672'
          }, {
            numericValue: 20,
            colourCode: '#EC93AB'
          }, {
            numericValue: 30,
            colourCode: '#CEB1DE'
          }, {
            numericValue: 40,
            colourCode: '#95D3F0'
          }, {
            numericValue: 50,
            colourCode: '#77EDD9'
          }, {
            numericValue: 200,
            colourCode: '#A9FCAA'
          }]}
          widthPx={300}
        />
      </CardContent>
    </Card>
  )
}