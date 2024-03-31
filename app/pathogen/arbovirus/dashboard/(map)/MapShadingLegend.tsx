import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { lastIndexOf } from "lodash";

interface MapShadingLegendProps {
    className?: string;
  }


export const MapShadingLegend = ({className}: MapShadingLegendProps) => {
    const shadingLegendElements: {color: string, description: string}[] = [
        {color: "blue", description: "Seroprevalence estimates"},
        {color: "red", description: "No Seroprevalence estimates"}
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
                            className={`w-[1em] ${color} h-[1em]`}
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