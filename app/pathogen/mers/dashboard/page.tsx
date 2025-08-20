"use client";
import React from "react";

import { GenericPathogenDashboardPage } from "../../generic-pathogen-dashboard-page";
import { MersMap } from "./(map)/mers-map";
import { MersFilters } from "./filters";
import { MersVisualizationsSection } from "./(visualizations)/visualizations-section";
import { MersDataTable } from "./(table)/mers-data-table";
import { MersBanner } from "./mers-banner";
import { MersTrackerBetweenMapandDataSectionComponent } from "./merstracker-between-map-and-data-section-component";
import { DashboardType } from "../../dashboard-enums";

export default function SarsCov2Dashboard() {
  return (
    <GenericPathogenDashboardPage
      dashboardType={DashboardType.MERS}
      filtersComponent={MersFilters}
      mapSectionComponent={MersMap}
      betweenMapAndDataSectionElement={MersTrackerBetweenMapandDataSectionComponent}
      dataSectionComponent={MersDataTable}
      banners={MersBanner}
      visualizationsSectionComponent={MersVisualizationsSection}
    />
  );
}
