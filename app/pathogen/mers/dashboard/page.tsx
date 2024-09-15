"use client";
import React from "react";

import { GenericPathogenDashboardPage } from "../../generic-pathogen-dashboard-page";
import { MersMap } from "./(map)/mers-map";
import { MersFilters } from "./filters";
import { MersVisualizationsSection } from "./(visualizations)/visualizations-section";
import { MersDataTable } from "./(table)/mers-data-table";
import { MersBanner } from "./mers-banner";

export default function SarsCov2Dashboard() {
  return (
    <GenericPathogenDashboardPage
      filtersComponent={MersFilters}
      mapSectionComponent={MersMap}
      dataSectionComponent={MersDataTable}
      banners={MersBanner}
      visualizationsSectionComponent={MersVisualizationsSection}
    />
  );
}
