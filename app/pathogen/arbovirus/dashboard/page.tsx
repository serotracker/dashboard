"use client";
import React from "react";
import { VisualizationsSection } from "./(visualizations)/visualizations-section";
import { ArboDataTable } from "./(table)/ArboDataTable";
import { ArbovirusMap } from "./(map)/ArbovirusMap";
import { ArboBanner } from "./ArboBanner";
import { GenericPathogenDashboardPage } from "../../generic-pathogen-dashboard-page";
import { ArbovirusFilters } from "./filters";

export default function ArbovirusDashboardPage() {
  return (
    <GenericPathogenDashboardPage
      banners={ArboBanner}
      filtersComponent={ArbovirusFilters}
      mapSectionComponent={ArbovirusMap}
      dataSectionComponent={ArboDataTable}
      visualizationsSectionComponent={VisualizationsSection}
    />
  );
}
