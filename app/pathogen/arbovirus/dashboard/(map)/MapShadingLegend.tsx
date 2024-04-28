'use client';

import { MapSymbology } from "@/app/pathogen/sarscov2/dashboard/(map)/map-config";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";
import { useContext } from "react";

interface MapShadingLegendProps {
    className?: string;
  }

export const MapShadingLegend = ({className}: MapShadingLegendProps) => {
    const state = useContext(ArboContext);
    
    const shadingLegendElements: {color: string, description: string}[] = [
        {color: MapSymbology.CountryFeature.HasData.Color, description: "Seroprevalence estimates"},
        {color: MapSymbology.CountryFeature.Default.Color, description: "No Seroprevalence estimates"}
    ]

    const esmLegendElements: {color: string, description: string}[] = [
        {color: 'bg-black', description: "Suitable Environment"},
      
    ]

    return (
        <Card className={className}>
            <CardHeader className={"py-3"}>
                <h2 className="text-lg">Legend</h2>
            </CardHeader>
            <CardContent>
                {shadingLegendElements.map(({color, description}, index) => {
                    return (
                    <div className="items-center flex space-x-2 my-1" key={index}>
                        <div
                            className={`w-[1em] ${color} h-[1em] border-2 border-gray-500`}
                            style={{ backgroundColor: color}}
                        ></div>
                        <p>{description}</p>
                    </div>
                    )
                })}
                {state.selectedFilters.esm?.length > 0 && esmLegendElements.map(({color, description}, index) => {
                    return (
                    <div className="items-center flex space-x-2 my-1" key={index}>
                        <div
                            className={`w-[1em] ${color} h-[1em] border-2 border-gray-500`}
                            style={{ backgroundColor: color}}
                        ></div>
                        <p>{description}</p>
                    </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}