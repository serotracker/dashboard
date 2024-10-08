"use client";

import React, { useContext, useMemo } from "react";
import Link from "next/link";
import { DashboardTopBanner } from "@/components/customs/dashboard-top-banner";
import { isMersSeroprevalenceEstimate, isMersViralEstimate, MersContext, MersSeroprevalenceEstimate, MersViralEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { formatMersSeroprevalenceEstimateForTable, formatMersViralEstimateForTable } from "./(table)/use-mers-data-table-data";
import { useMersEstimateColumnConfiguration } from "./(table)/mers-seroprevalence-and-viral-estimates-shared-column-configuration";
import { DashboardType } from "@/app/app-header-and-main";

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
      <div className="mb-2">
        <p className="inline"> MERSTracker is a dashboard and platform for MERS serosurveys, viral testing, and genomic sequencing studies. We conduct an </p>
        <Link href="/about/about-our-data" className="underline text-link inline">ongoing systematic review</Link>
        <p className="inline"> to track surveillance efforts around the world and visualize findings on this dashboard. We don&apos;t assess assay or study quality, please use your judgement when drawing conclusions. Our database is not comprehensive and we continue to add studies to our database. You can submit a MERS study that you believe belongs on the dashboard by using </p>
        <Link className="inline text-link underline text-end" target="_blank" rel="noopener noreferrer" href="https://forms.gle/ifwicQVVjj9CeNoA9">this form</Link>
        <p className='inline'> and it will be reviewed by a member of our team.</p>
      </div>
    }
    dashboardType={DashboardType.MERS}
    downloadCsvButtonOneConfiguration={{
      enabled: true,
      csvDownloadFilename: "merstracker_seroprevalence_dataset",
      buttonContent: "Download CSV with Seroprevalence Estimates",
      filteredData: seroprevalenceEstimateData,
      dataTableRows: mersSeroprevalenceEstimateColumnConfiguration
    }}
    downloadCsvButtonTwoConfiguration={{
      enabled: true,
      csvDownloadFilename: "merstracker_viral_dataset",
      buttonContent: "Download CSV with Viral Estimates",
      filteredData: viralEstimateData,
      dataTableRows: mersViralEstimateColumnConfiguration
    }}
    citationButtonConfiguration={{
      enabled: false
    }}
    dataLastUpdatedNoteConfiguration={{
      enabled: true,
      dataLastUpdatedText: 'The last major update to our data was on October 8th 2024'
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
