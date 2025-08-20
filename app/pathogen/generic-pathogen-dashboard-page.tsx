"use client";
import React, { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

import { useIsLargeScreen } from "@/hooks/useIsLargeScreen";
import { FiltersButton } from "./filters-button";
import { DashboardSectionId, DashboardType, dashboardTypeToMapIdMap } from "./dashboard-enums";
import { useMap } from "react-map-gl";

interface FiltersComponentProps {
  className?: string;
  areFiltersMinimized: boolean;
}

export interface MapSectionComponentProps {
  areFiltersMinimized: boolean;
}

interface GenericPathogenDashboardPageProps {
  dashboardType: DashboardType;
  banners?: () => React.ReactNode;
  filtersComponent: (props: FiltersComponentProps) => React.ReactNode;
  mapSectionComponent: (props: MapSectionComponentProps) => React.ReactNode;
  betweenMapAndDataSectionElement?: (() => React.ReactNode) | null;
  dataSectionComponent: () => React.ReactNode;
  visualizationsSectionComponent: () => React.ReactNode;
}

export const GenericPathogenDashboardPage = (props: GenericPathogenDashboardPageProps) => {
  const { dashboardType } = props;
  const isLargeScreen = useIsLargeScreen();
  const [areFiltersMinimized, _setAreFiltersMinimized] = useState<boolean>(false);

  const allMaps = useMap();

  const map = useMemo(() => {
    return allMaps[dashboardTypeToMapIdMap[dashboardType]]
  }, [ allMaps, dashboardType ]);

  const setAreFiltersMinimized = useCallback((value: boolean) => {
    _setAreFiltersMinimized(value);
    setTimeout(() => {
      map?.resize();
    }, 50)
  }, [ map, _setAreFiltersMinimized ]);


  return (
    <div className="col-span-12 grid gap-0 grid-cols-12 grid-rows-4 lg:grid-rows-2 row-span-2 grid-flow-col w-screen overflow-hidden border-box">
      <props.filtersComponent
        className={cn(
          "p-4 border-background overflow-y-scroll row-span-1 lg:row-span-2 border-b lg:border-b-0",
          !areFiltersMinimized ? "col-span-12 lg:col-span-2" : "col-span-12 lg:hidden"
        )}
        areFiltersMinimized={areFiltersMinimized && (isLargeScreen ?? false)}
      />
      <div
        className={cn(
          "overflow-y-scroll snap-y scroll-smooth row-span-3 lg:row-span-2 px-4",
          !areFiltersMinimized ? 'col-span-12 lg:col-span-10' : 'col-span-12'
        )}
      >
        <FiltersButton
          dashboardType={dashboardType}
          isLargeScreen={isLargeScreen ?? false}
          areFiltersMinimized={areFiltersMinimized && (isLargeScreen ?? false)}
          setAreFiltersMinimized={setAreFiltersMinimized}
        />
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
          className="w-full h-[95%] scroll-smooth overflow-hidden relative row-span-2 mt-4 lg:mt-[-32px] rounded-md border border-background"
        >
          <props.mapSectionComponent 
            areFiltersMinimized={areFiltersMinimized && (isLargeScreen ?? false)}
          />
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