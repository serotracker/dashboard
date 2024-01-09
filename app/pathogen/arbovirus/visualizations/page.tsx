"use client"

import { useSearchParams } from "next/navigation";
import { getVisualizationInformationFromVisualizationUrlParameter, isVisualizationUrlParameter } from "./visualizations";
import { cn } from "@/lib/utils";

export default function VisualizationsPage() {
  const searchParams = useSearchParams();
  const visualizationUrlParameter = searchParams.get('visualization');
  
  if(!visualizationUrlParameter || !isVisualizationUrlParameter(visualizationUrlParameter)) {
    return <div> not found </div>
  }

  const visualizationInformation = getVisualizationInformationFromVisualizationUrlParameter({ visualizationUrlParameter });

  if(!visualizationInformation) {
    return <div> not found </div>
  }

  return (
    <div className="flex-col flex w-screen h-screen">
      <h3 className="text-center text-lg pt-4"> {visualizationInformation.displayName} </h3>
      <div className={cn("flex-1", visualizationInformation.classNameWhenFullscreen)}>
        {visualizationInformation.renderVisualization()}
      </div>
    </div>
  )
}