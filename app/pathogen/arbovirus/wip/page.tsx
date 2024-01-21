"use client"
import { useScrollSectionGroup } from "@/components/ui/scroll-section-group/use-scroll-section-group";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { redesignedArbovirusPageSections, sectionUrlParameterToSectionId } from "./sections";

export default function RedesignedArbovirusPage() {
  const searchParams = useSearchParams();

  const {renderScrollSectionGroup, moveScrollSectionGroupToSection} = useScrollSectionGroup({
    scrollSectionGroupProps: {
      sections: redesignedArbovirusPageSections,
      className:"overflow-y-scroll col-span-10 h-full row-span-2 snap-y scroll-smooth",
      scrollThrottleThresholdMilliseconds: 700
    }
  })

  useEffect(() => {
    const sectionUrlParameter = searchParams.get('section');
    const sectionId = sectionUrlParameterToSectionId({urlParam: sectionUrlParameter})

    if(sectionId) {
      moveScrollSectionGroupToSection({ sectionId });
    }
  }, [searchParams])
  
  return (
    <div className="col-span-12 row-span-2 grid gap-0 grid-cols-12 grid-rows-2 grid-flow-col w-screen overflow-hidden border-box -my-4 -ml-4">
      <div className="col-span-2 h-full row-span-2">
        <div className="w-full h-full bg-orange-500"> placeholder for filters </div>
      </div>
      {renderScrollSectionGroup()}
    </div>
  )
}