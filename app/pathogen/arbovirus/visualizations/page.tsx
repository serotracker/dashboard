"use client"

import { notFound, useRouter, useSearchParams } from "next/navigation";
import { getVisualizationInformationFromVisualizationUrlParameter, isVisualizationUrlParameter } from "./visualizations";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { isSafeReferrerLink } from "@/utils/referrer-link-util";
import { Filters } from "../dashboard/filters";

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
    <div className="w-screen overflow-y-hidden grid grid-cols-12 grid-rows-2 -my-4 -ml-4 h-full-screen">
      <Filters className="col-span-2 row-span-2 overflow-y-scroll p-4 border-black border-r-2 h-full" />
      <div className="flex-col flex h-full overflow-y-scroll col-span-10 row-span-2">
        <div className="flex pt-4">
          <h3 className="w-full text-center text-lg">
            {visualizationInformation.displayName}
          </h3>
          <button 
            className="pr-8"
            hidden={!referrerRoute || !isSafeReferrerLink(referrerRoute)}
            onClick={() => {
              if(referrerRoute && isSafeReferrerLink(referrerRoute)) {
                router.push(referrerRoute)
              }
            }}
            aria-label="Close Visualization"
          >
            <X />
          </button>
        </div>
        <div className={cn("flex-1", visualizationInformation.classNameWhenFullscreen)}>
          {visualizationInformation.renderVisualization()}
        </div>
      </div>
    </div>
  )
}