"use client"
import React from "react";
import { Filters } from "./filters";
import { VisualizationsSection } from "./(visualizations)/visualizations-section";
import { ArboDataTable } from "./(table)/ArboDataTable";
import { ArbovirusMap } from "./(map)/ArbovirusMap";
import { ArbovirusPageSectionId } from "../../../constants";

export default function ArbovirusDashboardPage() {
  return (
    <div className="col-span-12 row-span-2 grid gap-0 grid-cols-12 grid-rows-2 grid-flow-col w-screen overflow-hidden border-box">
      <div className="overflow-y-scroll col-span-2 h-full row-span-2 border-black border-r-2">
        <Filters
          className="p-4"
        />
      </div>
      <div
        className={"overflow-y-scroll snap-y scroll-smooth col-span-10 row-span-2"}
      >
        <section
          id={ArbovirusPageSectionId.MAP}
          className="w-full h-[95%] snap-start snap-always scroll-smooth overflow-hidden relative row-span-2 border-black border-b-2"
        >
          <ArbovirusMap />
        </section>
        <section
          id={ArbovirusPageSectionId.TABLE}
          className="w-full h-[95%] snap-start snap-always scroll-smooth overflow-scroll border-black border-b-2"
        >
          <ArboDataTable />
        </section>
        <section
          id={ArbovirusPageSectionId.VISUALIZATIONS}
          className="w-full snap-start snap-always scroll-smooth grid-cols-2 grid-rows-1 grid overflow-y-visible gap-y-6 pr-4"
        >
          <VisualizationsSection />
        </section>
      </div>
    </div>
  )
}
