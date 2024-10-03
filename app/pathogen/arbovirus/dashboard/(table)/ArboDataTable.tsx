"use client";

import { DataTable, RowExpansionConfigurationEnabled, TableHeaderType } from "@/components/ui/data-table/data-table";
import React, { useContext } from "react";
import { parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { ArboContext, ArbovirusEstimate } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { DataTableColumnConfigurationEntryType, columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { ToastId } from "@/contexts/toast-provider";
import { RechartsVisualization } from "@/components/customs/visualizations/recharts-visualization";
import { ArbovirusVisualizationId, arbovirusVisualizationInformation, getUrlParameterFromVisualizationId } from "../../visualizations/visualization-page-config";
import { useMap } from "react-map-gl";
import { shortenedArboTrackerCitationText, suggestedArboTrackerCitationText } from "../../arbotracker-citations";

export const generateConciseEstimateId = (estimate: ArbovirusEstimate) => {
  const country = estimate.country
  const sampleFrame = estimate.sampleFrame ?? '';
  const samplingStartYear = estimate.sampleStartDate
    ? parseISO(estimate.sampleStartDate).getFullYear()
    : undefined;
  const samplingEndYear = estimate.sampleEndDate
    ? parseISO(estimate.sampleEndDate).getFullYear()
    : undefined;
  const samplingYearString = samplingStartYear !== undefined && samplingEndYear !== undefined
    ? (samplingStartYear !== samplingEndYear
      ? `${samplingStartYear}_${samplingEndYear}`
      : `${samplingStartYear}`
    )
    : undefined;


  return `${country}_${sampleFrame}_${samplingYearString}`.replaceAll(/ /g, '_');
}

const arboColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.LINK as const,
  fieldName: 'conciseEstimateId',
  label: 'Estimate ID',
  isHideable: false,
  isFixed: true,
  fieldNameForLink: 'url',
  size: 400,
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'estimateId',
  label: 'Full Estimate ID',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'pathogen',
  label: 'Arbovirus',
  valueToColourSchemeClassnameMap: {
    'DENV': 'bg-denv',
    'ZIKV': 'bg-zikv',
    'CHIKV': 'bg-chikv',
    'YF': 'bg-yf',
    'WNV': 'bg-wnv',
    'MAYV': 'bg-mayv',
  },
  defaultColourSchemeClassname: 'bg-gray-100'
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'seroprevalence',
  label: 'Seroprevalence',
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'antibodies',
  label: 'Antibodies',
  valueToColourSchemeClassnameMap: {
    'IgG': 'bg-blue-700 text-white',
    'IgM': 'bg-black text-white',
    'IgAM': 'bg-green-200',
    'NAb': 'bg-yellow-400',
  },
  defaultColourSchemeClassname: 'bg-sky-100',
  fallbackText: 'Not reported'
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'sampleStartDate',
  label: 'Sampling Start Date',
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'sampleEndDate',
  label: 'Sampling End Date',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'whoRegion',
  label: 'WHO Region',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'assay',
  label: 'Assay',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'assayOther',
  label: 'Assay Other',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'producer',
  label: 'Producer',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'producerOther',
  label: 'Producer Other',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sampleFrame',
  label: 'Sample Frame',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sampleNumerator',
  label: 'Sample Numerator',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sampleSize',
  label: 'Sample Size',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'city',
  label: 'City',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'country',
  label: 'Country',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sex',
  label: 'Sex',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'ageMinimum',
  label: 'Minimum Age',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'ageMaximum',
  label: 'Maximum Age',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'ageGroup',
  label: 'Age Group',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'pediatricAgeGroup',
  label: 'Pediatric Age Group',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'serotype',
  label: 'Serotype (DENV only)',
}, {
  type: DataTableColumnConfigurationEntryType.LINK_BUTTON as const,
  fieldName: 'url',
  label: 'Source',
  fieldNameForLink: 'url',
  isSortable: false
}] as const;

export const arboDataTableRows = arboColumnConfiguration.map(({fieldName, label}) => ({fieldName, label}));

export const ArboDataTable = () => {
  const state = useContext(ArboContext);
  const allMaps = useMap();
  const arboMap = allMaps['arboMap'];
  const router = useRouter();

  const rowExpansionConfiguration: RowExpansionConfigurationEnabled<ArbovirusEstimate> = {
    enabled: true,
    generateExpandedRowStatement: (input) => {
      const estimateId = input.row.getValue('estimateId');
      const estimate = estimateId ? input.data.find((dataPoint) => dataPoint.estimateId === estimateId) : undefined;
      const inclusionCriteriaStatement = estimate?.inclusionCriteria ? `The inclusion criteria for the study was "${estimate.inclusionCriteria}"` : "No inclusion criteria specified"

      return `${inclusionCriteriaStatement}. Clicking on this row in the table again will minimize it.`
    },
    viewOnMapHandler: (input) => {
      const estimateId = input.row.getValue('estimateId');

      if(!estimateId || !arboMap) {
        return;
      }

      const estimate = input.data.find((dataPoint) => dataPoint.estimateId === estimateId);

      if(!estimate) {
        return;
      }
      
      router.push('/pathogen/arbovirus/dashboard#MAP')

      const boxSize = 2;

      arboMap.fitBounds([
        estimate.longitude - (boxSize / 2),
        estimate.latitude - (boxSize / 2),
        estimate.longitude + (boxSize / 2),
        estimate.latitude + (boxSize / 2),
      ])
    },
    visualization: (input) => {
      const estimateId = input.row.getValue('estimateId');

      if(!estimateId) {
        return null;
      }

      const estimate = input.data.find((dataPoint) => dataPoint.estimateId === estimateId);

      if(!estimate) {
        return null;
      }

      return (
        <RechartsVisualization
          className="h-full-screen"
          data={input.data.filter((dataPoint) => 
            dataPoint.country === estimate.country && dataPoint.pathogen === estimate.pathogen)
          }
          highlightedDataPoint={estimate}
          hideArbovirusDropdown={true}
          visualizationInformation={arbovirusVisualizationInformation[ArbovirusVisualizationId.COUNTRY_SEROPREVALENCE_COMPARISON_SCATTER_PLOT]}
          getUrlParameterFromVisualizationId={getUrlParameterFromVisualizationId}
          buttonConfig={{
            downloadButton: {
              enabled: true,
            },
            zoomInButton: {
              enabled: false,
            },
            closeButton: {
              enabled: false,
            }
          }}
        />
      );
    }
  }

  if (state.filteredData?.length > 0) {
    return (
      <DataTable
        columns={columnConfigurationToColumnDefinitions({ columnConfiguration: arboColumnConfiguration })}
        csvFilename="arbotracker_dataset"
        tableHeader={{
          type: TableHeaderType.STANDARD,
          headerText: "Explore arbovirus seroprevalence estimates in our database"
        }}
        csvCitationConfiguration={{
          enabled: true,
          citationText: suggestedArboTrackerCitationText,
          csvDownloadCitationText: shortenedArboTrackerCitationText,
          toastId: ToastId.DOWNLOAD_CSV_CITATION_TOAST
        }}
        additionalButtonConfiguration={{
          enabled: false
        }}
        rowExpansionConfiguration={rowExpansionConfiguration}
        data={state.filteredData.map((estimate) => ({
          ...estimate,
          conciseEstimateId: generateConciseEstimateId(estimate)
        }))}
      />
    );
  } else {
    return <>Loading Data ...</>;
  }
}
