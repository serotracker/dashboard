"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { ToastId } from "@/contexts/toast-provider";
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { arboDataTableRows } from "./(table)/ArboDataTable";
import { ArboTrackerCitationButtonContent, suggestedArboTrackerCitationText } from "../arbotracker-citations";
import { DashboardTopBanner } from "@/components/customs/dashboard-top-banner";

export const ArboBanner = () => {
  const state = useContext(ArboContext);

  return <DashboardTopBanner
    headerContent={
      <div>
        <p className="inline"> ArboTracker is a dashboard and platform for Arbovirus serosurveys. We conduct an </p>
        <Link href="/about/about-our-data" className="underline text-link inline">ongoing systematic review</Link>
        <p className="inline"> to track serosurveys (antibody testing-based surveillance efforts) around the world and visualize findings on this dashboard.</p>
      </div>
    }
    downloadCsvButtonOneConfiguration={{
      enabled: true,
      csvDownloadFilename: "arbotracker_dataset",
      buttonContent: "Download CSV",
      filteredData: state.filteredData,
      dataTableRows: arboDataTableRows
    }}
    downloadCsvButtonTwoConfiguration={{
      enabled: false
    }}
    citationButtonConfiguration={{
      enabled: true,
      suggestedCitationText: suggestedArboTrackerCitationText,
      citationToastId: ToastId.DOWNLOAD_CSV_CITATION_TOAST,
      buttonContent: <ArboTrackerCitationButtonContent />
    }}
  />
}
