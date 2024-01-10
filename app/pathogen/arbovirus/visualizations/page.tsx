"use client"

import { notFound, useRouter, useSearchParams } from "next/navigation";
import { getVisualizationInformationFromVisualizationUrlParameter, isVisualizationUrlParameter } from "./visualizations";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { isSafeReferrerLink } from "@/utils/referrer-link-util";

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
    <div className="flex-col flex w-screen h-screen">
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
  )
}