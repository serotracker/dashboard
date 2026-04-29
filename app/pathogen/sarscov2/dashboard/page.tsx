"use client";
import React from "react";
import Link from "next/link";

import { GenericPathogenDashboardPage } from "../../generic-pathogen-dashboard-page";
import { SarsCov2Map } from "./(map)/SarsCov2Map";
import { SarsCov2Filters } from "./filters";
import { SarsCov2VisualizationsSection } from "./(visualizations)/visualizations-section";
import { SarsCov2DataTable } from "./(table)/sars-cov-2-data-table";
import { DashboardType } from "../../dashboard-enums";

function SarsCov2Banner() {
  return (
    <div className="w-full h-fit relative row-span-2 rounded-md my-4 border border-background p-4 flex flex-col gap-4">
      <p>
        SeroTracker is a dashboard compiling published SARS-CoV-2 seroprevalence studies via a systematic review of
        available literature. Searches were conducted from 03-2020 to 03-2024; we have now transitioned to ad hoc
        updates and no longer routinely update our full review. You may{" "}
        <Link href="mailto:mairead.whelan@ucalgary.ca" className="underline text-link inline">
          contact our team
        </Link>{" "}
        with questions, and see more information on our review methods{" "}
        <Link href="/about/about-our-data" className="underline text-link inline">
          here
        </Link>
        . The data on our dashboard are extracted from publicly available independent research and do not reflect
        validation of the findings on behalf of SeroTracker or any of our funding or collaborating partners. Research
        studies are heterogeneous and vary in their quality, design, methodology, assay performance, and reporting, and
        results should be interpreted and compared with caution.
      </p>
      <div class="flex justify-start items-center gap-6">
        <Link
          href="#TABLE"
          class="flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground px-4 py-2 w-[30%] bg-background hover:bg-backgroundHover h-full">
          Download CSV with Seroprevalence Estimates
        </Link>
        <Link
          href="/about/about-our-data"
          class="flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground px-4 py-2 w-[30%] bg-background hover:bg-backgroundHover ml-2 h-full">
          Cite our Data
        </Link>
      </div>
    </div>
  );
}

export default function SarsCov2Dashboard() {
  return (
    <GenericPathogenDashboardPage
      dashboardType={DashboardType.SARS_COV_2}
      filtersComponent={SarsCov2Filters}
      mapSectionComponent={SarsCov2Map}
      dataSectionComponent={SarsCov2DataTable}
      banners={SarsCov2Banner}
      visualizationsSectionComponent={SarsCov2VisualizationsSection}
    />
  );
}
