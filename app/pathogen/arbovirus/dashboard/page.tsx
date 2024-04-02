"use client"
import React from "react";
import { Filters } from "./filters";
import { VisualizationsSection } from "./(visualizations)/visualizations-section";
import { ArboDataTable } from "./(table)/ArboDataTable";
import { ArbovirusMap } from "./(map)/ArbovirusMap";
import { ArbovirusPageSectionId } from "../../../constants";
import { ArboBanner } from "./ArboBanner";

export default function ArbovirusDashboardPage() {
  return (
    <div className="col-span-12 row-span-2 grid gap-0 grid-cols-12 grid-rows-2 grid-flow-col w-screen overflow-hidden border-box">
      <div className="overflow-y-scroll col-span-2 h-full row-span-2 border-y">
        <Filters
          className="p-4 border-background"
        />
      </div>
      <div
        className={"overflow-y-scroll snap-y scroll-smooth col-span-10 row-span-2 px-4"}
      >
        <ArboBanner className="w-full border border-background rounded-md items-center p-2 mt-4 flex justify-between"/>
        <section
          id={ArbovirusPageSectionId.MAP}
          className="w-full h-[95%] scroll-smooth overflow-hidden relative row-span-2 mt-4 rounded-md border border-background"
        >
          <ArbovirusMap />
        </section>
        <section
          id={ArbovirusPageSectionId.TABLE}
          className="w-full h-fit scroll-smooth mt-4 border border-background rounded-md px-4"
        >
          <ArboDataTable />
        </section>
        <section
          id={ArbovirusPageSectionId.VISUALIZATIONS}
          className="w-full grid-cols-2 grid-rows-1 grid overflow-y-visible gap-6 mt-4"
        >
          <VisualizationsSection />
        </section>
      </div>
    </div>
  )
}
