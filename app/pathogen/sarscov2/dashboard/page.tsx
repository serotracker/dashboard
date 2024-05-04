"use client";
import React from "react";

import { GenericPathogenDashboardPage } from "../../generic-pathogen-dashboard-page";
import { SarsCov2Map } from "./(map)/SarsCov2Map";

export default function SarsCov2Dashboard() {
  return (
    <GenericPathogenDashboardPage
      filtersComponent={() => <p> WIP </p>}
      mapSectionComponent={() => <SarsCov2Map />}
      dataSectionComponent={() => <p> WIP </p>}
      visualizationsSectionComponent={() => <p> WIP </p>}
    />
  );
}
