"use client"
import React from "react";
import { Filters } from "./filters";
import { VisualizationsSection } from "./(visualizations)/visualizations-section";
import { ArboDataTable } from "./(table)/ArboDataTable";
import { ArbovirusMap } from "./(map)/ArbovirusMap";
import { ArbovirusPageSectionId } from "../../../constants";
import { ArboBanner } from "./ArboBanner";
import { useIsLargeScreen } from "@/hooks/useIsLargeScreen";

export default function ArbovirusDashboardPage() {

  const isLargeScreen = useIsLargeScreen();

  return (
    <div className="col-span-12 grid gap-0 grid-cols-12 grid-rows-4 lg:grid-rows-2 row-span-2 grid-flow-col w-screen overflow-hidden border-box">
      <div className="overflow-y-scroll col-span-12 row-span-1 lg:col-span-2 lg:row-span-4 h-full border-b border-background lg:border-b-0">
        <Filters
          className="p-4 border-background"
        />
      </div>
      <div
        className={"overflow-y-scroll snap-y scroll-smooth row-span-3 col-span-12 lg:col-span-10 lg:row-span-2 px-4"}
      >
        {!isLargeScreen && (
          <section
          className="w-full h-fit relative row-span-2 rounded-md mt-4 border border-background p-4"
        >
          We suggest viewing our dashboard on a larger screen or in landscape mode for the best experience. Support for smaller devices is coming soon!
        </section>
        )}
        <ArboBanner/>
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
