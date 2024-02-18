"use client"
import { notFound } from "next/navigation";
import React from "react";
import { Filters } from "../dashboard/filters";
import { VisualizationsSection } from "./visualizations-section";
import { ArboDataTable } from "../analyze/ArboDataTable";
import { ArbovirusMap } from "../dashboard/(map)/ArbovirusMap";
import { RedesignedArbovirusPageSectionId } from "./sections";

export default function RedesignedArbovirusPage() {
  if(process.env.NEXT_PUBLIC_WEBSITE_REDESIGN_ENABLED !== 'true') {
    return notFound();
  }

  return (
    <div className="col-span-12 row-span-2 grid gap-0 grid-cols-12 grid-rows-2 grid-flow-col w-screen overflow-hidden border-box -my-4 -ml-4">
      <div className="overflow-y-scroll col-span-2 h-full row-span-2 border-black border-r-2">
        <Filters
          className="p-4"
        />
      </div>
      <div
        className={"overflow-y-scroll snap-y scroll-smooth col-span-10 row-span-2"}
      >
        <section
          id={RedesignedArbovirusPageSectionId.MAP}
          className="w-full h-[95%] snap-start snap-always scroll-smooth overflow-hidden relative row-span-2 border-black border-b-2"
        >
          <ArbovirusMap />
        </section>
        <section
          id={RedesignedArbovirusPageSectionId.TABLE}
          className="w-full h-[95%] snap-start snap-always scroll-smooth overflow-scroll border-black border-b-2"
        >
          <ArboDataTable />
        </section>
        <section
          id={RedesignedArbovirusPageSectionId.VISUALIZATIONS}
          className="w-full h-full snap-start snap-always scroll-smooth grid-cols-2 grid-rows-1 grid overflow-y-scroll gap-y-6 pr-4"
        >
          <VisualizationsSection />
        </section>
      </div>
    </div>
  )
}