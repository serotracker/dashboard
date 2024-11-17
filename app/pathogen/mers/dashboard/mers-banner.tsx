"use client";

import React, { useContext, useMemo } from "react";
import Link from "next/link";
import { DashboardTopBanner } from "@/components/customs/dashboard-top-banner";
import { isMersSeroprevalenceEstimate, isMersViralEstimate, MersContext, MersSeroprevalenceEstimate, MersViralEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { formatMersSeroprevalenceEstimateForTable, formatMersViralEstimateForTable } from "./(table)/use-mers-data-table-data";
import { useMersEstimateColumnConfiguration } from "./(table)/mers-seroprevalence-and-viral-estimates-shared-column-configuration";
import { DashboardType } from "@/app/app-header-and-main";
import { MERSTrackerCitationButtonContent, shortenedMERSTrackerCitationText, suggestedMERSTrackerCitationText } from "../merstracker-citations";
import { ToastId } from "@/contexts/toast-provider";

export const cleanEstimateForMersBanner = (
  estimate: MersSeroprevalenceEstimate | MersViralEstimate
) => {
  const {
    primaryEstimateInfo,
    geographicalAreaSubestimates,
    sexSubestimates,
    ageGroupSubestimates,
    animalSpeciesSubestimates,
    testUsedSubestimates,
    timeFrameSubestimates,
    sampleTypeSubestimates,
    animalSamplingContextSubestimates,
    animalSourceLocationSubestimates,
    occupationSubestimates,
    camelExposureLevelSubestimates,
    nomadismSubestimates,
    humanCountriesOfTravelSubestimates,
    ...cleanedEstimate
  } = estimate;

  return cleanedEstimate;
}

export const MersBanner = () => {
  const { filteredData }= useContext(MersContext);
  
  const {
    mersSeroprevalenceEstimateColumnConfiguration,
    mersViralEstimateColumnConfiguration
  } = useMersEstimateColumnConfiguration();

  const seroprevalenceEstimateData = useMemo(() => filteredData
    .filter((dataPoint): dataPoint is MersSeroprevalenceEstimate => isMersSeroprevalenceEstimate(dataPoint))
    .map((dataPoint) => formatMersSeroprevalenceEstimateForTable(dataPoint))
    .map((estimate) => cleanEstimateForMersBanner(estimate))
  , [ filteredData ]);

  const viralEstimateData = useMemo(() => filteredData
    .filter((dataPoint): dataPoint is MersViralEstimate => isMersViralEstimate(dataPoint))
    .map((estimate) => formatMersViralEstimateForTable(estimate))
    .map((estimate) => cleanEstimateForMersBanner(estimate))
  , [ filteredData ])

  return <DashboardTopBanner
    headerContent={
      <div>
        <div className="mb-4">
          <p className="inline"> MERSTracker (by the SeroTracker group) is a dashboard displaying published MERS-CoV serosurveys, viral testing, and genomic sequencing studies. We compile and centralize resources on MERS-CoV via a systematic review of available literature. Our database is not comprehensive and we continue to add studies with new searches. You can see more information on our review methods </p>
          <Link href="/about/about-our-data" className="underline text-link inline">here</Link>
          <p className='inline'>.</p>
        </div>
        <div className="mb-2">
          <p className="inline">The data on our dashboard are extracted from publicly available independent research and do not reflect validation of the findings on behalf of SeroTracker or any of our funding or collaborating partners. Research studies are heterogeneous and vary in their quality, design, methodology, assay performance, and reporting, and results should be interpreted and compared with caution.</p>
        </div>
      </div>
    }
    dashboardType={DashboardType.MERS}
    downloadCsvButtonOneConfiguration={{
      enabled: true,
      csvDownloadFilename: "merstracker_seroprevalence_dataset",
      buttonContent: "Download CSV with Seroprevalence Estimates",
      filteredData: seroprevalenceEstimateData,
      dataTableRows: mersSeroprevalenceEstimateColumnConfiguration,
      citationText: shortenedMERSTrackerCitationText
    }}
    downloadCsvButtonTwoConfiguration={{
      enabled: false,
    }}
    citationButtonConfiguration={{
      enabled: true,
      suggestedCitationText: suggestedMERSTrackerCitationText,
      citationToastId: ToastId.MERSTRACKER_DOWNLOAD_CSV_CITATION_TOAST,
      buttonContent: 'Cite our Data'
    }}
    dataLastUpdatedNoteConfiguration={{
      enabled: true,
      dataLastUpdatedText: 'The last major update to our data was on November 9th 2024'
    }}
    mapButtonConfiguration={{
      header: 'Map',
      text: 'A map displaying MERS serosurveys, viral testing, and genomic sequencing data across the globe.'
    }}
    dataButtonConfiguration={{
      header: 'Data',
      text: 'View or download our entire MERS dataset.'
    }}
    visualizationsButtonConfiguration={{
      header: 'Visualizations',
      text: 'A collection of visualizations for our MERS dataset.'
    }}
  />
}
