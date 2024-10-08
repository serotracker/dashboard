"use client";
import React from "react";
import { ArbovirusVisualizationsSection } from "./(visualizations)/visualizations-section";
import { ArboDataTable } from "./(table)/ArboDataTable";
import { ArbovirusMap } from "./(map)/ArbovirusMap";
import { ArboBanner } from "./arbo-banner";
import { GenericPathogenDashboardPage } from "../../generic-pathogen-dashboard-page";
import { ArbovirusFilters } from "./filters";

export default function ArbovirusDashboardPage() {
  return (
    <GenericPathogenDashboardPage
      banners={ArboBanner}
      filtersComponent={ArbovirusFilters}
      mapSectionComponent={ArbovirusMap}
      dataSectionComponent={ArboDataTable}
      visualizationsSectionComponent={ArbovirusVisualizationsSection}
    />
  );
}
