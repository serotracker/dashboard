
'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export interface CountryHighlightLayerLegendEntry {
  description: string;
  colour: string;
}

interface CountryHighlightLayerLegendProps {
  className?: string;
  legendEntries: CountryHighlightLayerLegendEntry[];
}

export const CountryHighlightLayerLegend = (input: CountryHighlightLayerLegendProps) => {
  return (
    <Card className={input.className}>
      <CardHeader className={"py-3"}>
        <h2 className="text-lg">Legend</h2>
      </CardHeader>
      <CardContent>
        {input.legendEntries.map((entry, index) => (
          <div className="items-center flex space-x-2 my-1" key={`${entry.description}-${entry.colour}`}>
            <div
              className={`w-[1em] ${entry.colour} h-[1em] border-2 border-gray-500`}
              style={{ backgroundColor: entry.colour}}
            ></div>
            <p>{entry.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}