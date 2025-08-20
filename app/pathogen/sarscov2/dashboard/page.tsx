"use client";
import React from "react";

import { GenericPathogenDashboardPage } from "../../generic-pathogen-dashboard-page";
import { SarsCov2Map } from "./(map)/SarsCov2Map";
import { SarsCov2Filters } from "./filters";
import { SarsCov2VisualizationsSection } from "./(visualizations)/visualizations-section";
import { SarsCov2DataTable } from "./(table)/sars-cov-2-data-table";
import { DashboardType } from "../../dashboard-enums";

export default function SarsCov2Dashboard() {
  return (
    <GenericPathogenDashboardPage
      dashboardType={DashboardType.SARS_COV_2}
      filtersComponent={SarsCov2Filters}
      mapSectionComponent={SarsCov2Map}
      dataSectionComponent={SarsCov2DataTable}
      visualizationsSectionComponent={SarsCov2VisualizationsSection}
    />
  );
}
