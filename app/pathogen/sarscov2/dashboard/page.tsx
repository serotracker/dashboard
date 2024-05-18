"use client";
import React from "react";

import { GenericPathogenDashboardPage } from "../../generic-pathogen-dashboard-page";
import { SarsCov2Map } from "./(map)/SarsCov2Map";
import { SarsCov2Filters } from "./filters";

export default function SarsCov2Dashboard() {
  return (
    <GenericPathogenDashboardPage
      filtersComponent={SarsCov2Filters}
      mapSectionComponent={SarsCov2Map}
      dataSectionComponent={() => <p> WIP </p>}
      visualizationsSectionComponent={() => <p> WIP </p>}
    />
  );
}
