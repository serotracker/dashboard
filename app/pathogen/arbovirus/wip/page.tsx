"use client"
import { useScrollSectionGroup } from "@/components/ui/scroll-section-group/use-scroll-section-group";
import { notFound, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { RedesignedArbovirusPageSectionId, redesignedArbovirusPageSections, sectionUrlParameterToSectionId } from "./sections";
import { FilterableField, Filters } from "../dashboard/filters";

export default function RedesignedArbovirusPage() {
  const searchParams = useSearchParams();

  const { renderScrollSectionGroup, moveScrollSectionGroupToSection, idOfCurrentlyViewedSection } = useScrollSectionGroup({
    scrollSectionGroupProps: {
      sections: redesignedArbovirusPageSections,
      className:"col-span-10 row-span-2",
      scrollThrottleThresholdMilliseconds: 700
    }
  })

  useEffect(() => {
    const sectionUrlParameter = searchParams.get('section');
    const sectionId = sectionUrlParameterToSectionId({ urlParam: sectionUrlParameter })

    if(sectionId) {
      moveScrollSectionGroupToSection({ sectionId });
    }
  }, [searchParams])

  if(process.env.NEXT_PUBLIC_WEBSITE_REDESIGN_ENABLED !== 'true') {
    return notFound();
  }
  
  return (
    <div className="col-span-12 row-span-2 grid gap-0 grid-cols-12 grid-rows-2 grid-flow-col w-screen overflow-hidden border-box -my-4 -ml-4">
      <div className="overflow-y-scroll col-span-2 h-full row-span-2 border-black border-r-2">
        <Filters
          className="p-4"
          excludedFields={
            idOfCurrentlyViewedSection === RedesignedArbovirusPageSectionId.MAP ? [FilterableField.pathogen] : [] 
          }
        />
      </div>
      {renderScrollSectionGroup()}
    </div>
  )
}