"use client";
import React from "react";

import { useIsLargeScreen } from "@/hooks/useIsLargeScreen";

export enum DashboardSectionId {
  MAP = 'MAP',
  TABLE = 'TABLE',
  VISUALIZATIONS = 'VISUALIZATIONS'
}

interface FiltersComponentProps {
  className?: string;
}

interface GenericPathogenDashboardPageProps {
  banners?: () => React.ReactNode;
  filtersComponent: (props: FiltersComponentProps) => React.ReactNode;
  mapSectionComponent: () => React.ReactNode;
  betweenMapAndDataSectionElement?: (() => React.ReactNode) | null;
  dataSectionComponent: () => React.ReactNode;
  visualizationsSectionComponent: () => React.ReactNode;
}

export const GenericPathogenDashboardPage = (props: GenericPathogenDashboardPageProps) => {
  const isLargeScreen = useIsLargeScreen();

  return (
    <div className="col-span-12 grid gap-0 grid-cols-12 grid-rows-4 lg:grid-rows-2 row-span-2 grid-flow-col w-screen overflow-hidden border-box">
      <props.filtersComponent className="p-4 border-background overflow-y-scroll col-span-12 row-span-1 lg:col-span-2 lg:row-span-2 border-b lg:border-b-0" />
      <div
        className={
          "overflow-y-scroll snap-y scroll-smooth row-span-3 col-span-12 lg:col-span-10 lg:row-span-2 px-4"
        }
      >
        {(isLargeScreen === false) && (
          <section className="w-full h-fit relative row-span-2 rounded-md mt-4 border border-background p-4">
            We suggest viewing our dashboard on a larger screen or in landscape
            mode for the best experience. Support for smaller devices is coming
            soon!
          </section>
        )}
        {props.banners && <props.banners />}
        <section
          id={DashboardSectionId.MAP}
          className="w-full h-[95%] scroll-smooth overflow-hidden relative row-span-2 mt-4 rounded-md border border-background"
        >
          <props.mapSectionComponent />
        </section>
        {props.betweenMapAndDataSectionElement ? <props.betweenMapAndDataSectionElement /> : null}
        <section
          id={DashboardSectionId.TABLE}
          className="w-full h-fit scroll-smooth mt-4 border border-background rounded-md px-4"
        >
          <props.dataSectionComponent />
        </section>
        <section
          id={DashboardSectionId.VISUALIZATIONS}
          className="w-full grid-cols-2 grid-rows-1 grid overflow-y-visible gap-6 mt-4"
        >
          <props.visualizationsSectionComponent />
        </section>
      </div>
    </div>
  );
}