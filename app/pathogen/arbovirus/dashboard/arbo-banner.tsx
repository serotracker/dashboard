"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { ToastId } from "@/contexts/toast-provider";
import { ArbovirusDataTableType, getArboDataTableRows } from "./(table)/ArboDataTable";
import { ArboTrackerCitationButtonContent, shortenedArboTrackerCitationText, suggestedArboTrackerCitationText } from "../arbotracker-citations";
import { DashboardTopBanner } from "@/components/customs/dashboard-top-banner";
import { ArbovirusEstimateType } from "@/gql/graphql";
import { useGroupedArbovirusEstimateData } from "../use-arbo-primary-estimate-data";
import { DashboardType } from "../../dashboard-enums";

export const ArboBanner = () => {
  const { primaryEstimateData: state } = useGroupedArbovirusEstimateData();

  return <DashboardTopBanner
    headerContent={
      <div className="mb-2">
        <p className="inline"> ArboTracker is a dashboard and platform for Arbovirus serosurveys. We conduct an </p>
        <Link href="/about/about-our-data" className="underline text-link inline">ongoing systematic review</Link>
        <p className="inline"> to track serosurveys (antibody testing-based surveillance efforts) around the world and visualize findings on this dashboard.</p>
      </div>
    }
    dashboardType={DashboardType.ARBOVIRUS}
    downloadCsvButtonOneConfiguration={{
      enabled: true,
      csvDownloadFilename: "arbotracker_dataset",
      buttonContent: "Download CSV",
      filteredData: state.filteredData
        .filter((estimate) => estimate.isPrimaryEstimate)
        .filter((estimate) => estimate.estimateType === ArbovirusEstimateType.Seroprevalence),
      dataTableRows: getArboDataTableRows(ArbovirusDataTableType.SEROPREVALENCE),
      citationText: shortenedArboTrackerCitationText
    }}
    downloadCsvButtonTwoConfiguration={{
      enabled: false
    }}
    citationButtonConfiguration={{
      enabled: true,
      suggestedCitationText: suggestedArboTrackerCitationText,
      citationToastId: ToastId.ARBOTRACKER_DOWNLOAD_CSV_CITATION_TOAST,
      buttonContent: <ArboTrackerCitationButtonContent />
    }}
    dataLastUpdatedNoteConfiguration={{
      enabled: false
    }}
    mapButtonConfiguration={{
      header: 'Map',
      text: 'A map displaying our arbovirus seroprevalence dataset.'
    }}
    dataButtonConfiguration={{
      header: 'Data',
      text: 'View or download our entire arbovirus dataset.'
    }}
    visualizationsButtonConfiguration={{
      header: 'Visualizations',
      text: 'A collection of visualizations for our arbovirus dataset.'
    }}
  />
}
