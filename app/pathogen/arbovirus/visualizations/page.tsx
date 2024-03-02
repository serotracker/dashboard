"use client"

import { notFound, useRouter, useSearchParams } from "next/navigation";
import { getVisualizationInformationFromVisualizationUrlParameter, isVisualizationUrlParameter } from "./visualizations";
import { Filters } from "../dashboard/filters";
import { RechartsVisualization } from "../dashboard/(visualizations)/recharts-visualization";

export default function VisualizationsPage() {
  const searchParams = useSearchParams();
  const visualizationUrlParameter = searchParams.get('visualization');
  const referrerRoute = searchParams.get('referrerRoute');
  const router = useRouter();
  
  if(!visualizationUrlParameter || !isVisualizationUrlParameter(visualizationUrlParameter)) {
    return notFound()
  }

  const visualizationInformation = getVisualizationInformationFromVisualizationUrlParameter({ visualizationUrlParameter });

  if(!visualizationInformation) {
    return notFound()
  }

  return (
    <div className="w-screen overflow-y-hidden grid grid-cols-12 grid-rows-2 h-full-screen">
      <Filters className="col-span-2 row-span-2 overflow-y-scroll p-4 border-black border-r-2 h-full" />
      <RechartsVisualization
        className="flex-col flex h-full overflow-y-scroll col-span-10 row-span-2"
        visualizationInformation={visualizationInformation}
        buttonConfig={{
          downloadButton: {
            enabled: true,
          },
          zoomInButton: {
            enabled: false,
          },
          closeButton: {
            enabled: true,
            referrerRoute
          }
        }}
      />
    </div>
  )
}