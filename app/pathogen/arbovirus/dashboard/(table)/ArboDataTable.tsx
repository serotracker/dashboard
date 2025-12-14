"use client";

import { RowExpansionConfigurationEnabled, TableHeader, TableHeaderType } from "@/components/ui/data-table/data-table";
import React, { useContext, useMemo, useState } from "react";
import { parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { ArboContext, ArbovirusEstimate } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { DataTableColumnConfigurationEntryType } from "@/components/ui/data-table/data-table-column-config";
import { ToastId } from "@/contexts/toast-provider";
import { RechartsVisualization } from "@/components/customs/visualizations/recharts-visualization";
import { ArbovirusVisualizationId, getUrlParameterFromVisualizationId, useVisualizationPageConfiguration } from "../../visualizations/visualization-page-config";
import { useMap } from "react-map-gl/mapbox";
import { ArboTrackerCitationButtonContent, shortenedArboTrackerCitationText, suggestedArboTrackerCitationText } from "../../arbotracker-citations";
import { ArbovirusEstimateType, ArbovirusStudyGeographicScope } from "@/gql/graphql";
import { assertNever } from "assert-never";
import { ArboSeroprevalenceDataTable } from "./arbo-seroprevalence-data-table";
import { ArboViralPrevalenceDataTable } from "./arbo-viral-prevalence-data-table";
import { useGroupedArbovirusEstimateData } from "../../use-arbo-primary-estimate-data";
import { DashboardType, dashboardTypeToMapIdMap } from "@/app/pathogen/dashboard-enums";
import { cleanGeographicScope, geographicScopeToColourClassnameMap } from "../../utils";

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

const generateLocationForDataTable = (estimate: ArbovirusEstimate) => {
  const { country, district, city, state } = estimate;

  return city ?? district ?? state ?? '';
}

export enum ArbovirusDataTableType {
  SEROPREVALENCE = 'SEROPREVALENCE',
  VIRAL_PREVALENCE = 'VIRAL_PREVALENCE',
  UNAVAILABLE = 'UNAVAILABLE'
}

const arbovirusEstimateTypeToPrevalenceColumnConfiguration = (
  dataTableType: ArbovirusDataTableType.SEROPREVALENCE | ArbovirusDataTableType.VIRAL_PREVALENCE
) => {
  if(dataTableType === ArbovirusDataTableType.SEROPREVALENCE) {
    return [{
      type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
      fieldName: 'seroprevalence',
      label: 'Seroprevalence',
    }]
  }

  if(dataTableType === ArbovirusDataTableType.VIRAL_PREVALENCE) {
    return [{
      type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
      fieldName: 'seroprevalence',
      label: 'Viral Prevalence',
    }]
  }

  assertNever(dataTableType)
}

const getArboColumnConfiguration = (
  dataTableType: ArbovirusDataTableType.SEROPREVALENCE | ArbovirusDataTableType.VIRAL_PREVALENCE
) => [{
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
    'YFV': 'bg-yfv',
    'WNV': 'bg-wnv',
    'MAYV': 'bg-mayv',
    'OROV': 'bg-orov',
  },
  defaultColourSchemeClassname: 'bg-gray-100'
},
...arbovirusEstimateTypeToPrevalenceColumnConfiguration(dataTableType),
{
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
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'studyDesign',
  label: 'Study Design',
  valueToColourSchemeClassnameMap: {
    'Cross-sectional': 'bg-orange-200',
    'Repeated cross-sectional': 'bg-green-200',
    'Prospective cohort': 'bg-indigo-200',
    'Retrospective cohort': 'bg-rose-200',
    'Cross-sectional study with prospective cohort follow-up': 'bg-purple-200',
    'Case-control': 'bg-amber-200',
    'Clinical trial': 'bg-lime-200'
  },
  defaultColourSchemeClassname: 'bg-sky-100',
  fallbackText: 'Not reported'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'cleanedGeographicScope',
  label: 'Geographic Scope',
  valueToColourSchemeClassnameMap: geographicScopeToColourClassnameMap,
  defaultColourSchemeClassname: 'bg-sky-100',
  fallbackText: 'Not reported'
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
  label: 'Country or Area',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'district',
  label: 'District',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'location',
  label: 'Location'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'sex',
  label: 'Sex',
  valueToColourSchemeClassnameMap: {
    'Male': 'bg-lime-300',
    'Female': 'bg-yellow-300',
    'All': 'bg-sky-300',
  },
  defaultColourSchemeClassname: 'bg-sky-100',
  fallbackText: 'Not reported'
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
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'ageGroup',
  label: 'Age Group',
  valueToColourSchemeClassnameMap: {
    'Adults (18-64 years)': 'bg-orange-200',
    'Children and Youth (0-17 years)': 'bg-pink-200',
    'Multiple groups': 'bg-cyan-200',
    'Seniors (65+ years)': 'bg-purple-200',
  },
  defaultColourSchemeClassname: 'bg-sky-100',
  fallbackText: 'Not reported'
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

export const getArboDataTableRows = (
  dataTableType: ArbovirusDataTableType.SEROPREVALENCE | ArbovirusDataTableType.VIRAL_PREVALENCE
) => {
  const arboColumnConfiguration = getArboColumnConfiguration(dataTableType);

  return arboColumnConfiguration
    .map(({ fieldName, label }) => ({ fieldName, label }));
}

export const ArboDataTable = () => {
  const { filteredData } = useContext(ArboContext);
  const [ areSubEstimatesVisible, setAreSubEstimatesVisible] = useState<boolean>(false);
  const allMaps = useMap();
  const arboMap = allMaps[dashboardTypeToMapIdMap[DashboardType.ARBOVIRUS]];
  const router = useRouter();
  const { arbovirusVisualizationInformation } = useVisualizationPageConfiguration();
  const [ arboDataTableType, setArboDataTableType ] = useState<ArbovirusDataTableType>(ArbovirusDataTableType.SEROPREVALENCE);

  const tableDataWithConciseEstimateIds = useMemo(() => {
    return filteredData
      .map((estimate) => ({
        ...estimate,
        conciseEstimateId: generateConciseEstimateId(estimate),
        location: generateLocationForDataTable(estimate),
        cleanedGeographicScope: cleanGeographicScope(estimate.geographicScope),
      }))
      .filter((estimate) => areSubEstimatesVisible ? true : estimate.isPrimaryEstimate)
  }, [ filteredData, areSubEstimatesVisible ]);

  const dataForSeroprevalenceTable = useMemo(() => {
    return tableDataWithConciseEstimateIds
      .filter((estimate) => estimate.estimateType === ArbovirusEstimateType.Seroprevalence)
  }, [ tableDataWithConciseEstimateIds ]);

  const dataForViralPrevalenceTable = useMemo(() => {
    return tableDataWithConciseEstimateIds
      .filter((estimate) => estimate.estimateType === ArbovirusEstimateType.ViralPrevalence)
  }, [ tableDataWithConciseEstimateIds ]);

  const availableDropdownOptionGroups = useMemo(() => {
    const returnValue = [
      ...(dataForSeroprevalenceTable.length > 0 ? [ ArbovirusDataTableType.SEROPREVALENCE ] : []),
      ...(dataForViralPrevalenceTable.length > 0 ? [ ArbovirusDataTableType.VIRAL_PREVALENCE ] : []),
    ];

    if(returnValue.length === 0) {
      return [
        ArbovirusDataTableType.UNAVAILABLE
      ];
    }

    return returnValue;
  }, [ dataForSeroprevalenceTable, dataForViralPrevalenceTable ]);

  const cleanedSelectedDataTable = useMemo(() => {
    if(availableDropdownOptionGroups.includes(arboDataTableType)) {
      return arboDataTableType;
    }

    return availableDropdownOptionGroups.at(0) ?? ArbovirusDataTableType.UNAVAILABLE;
  }, [ arboDataTableType, availableDropdownOptionGroups ])

  const tableHeader: TableHeader<ArbovirusDataTableType> = useMemo(() => {
    const dropdownOptionToTextFillerMap = {
      [ArbovirusDataTableType.SEROPREVALENCE]: "seroprevalence",
      [ArbovirusDataTableType.VIRAL_PREVALENCE]: "viral prevalence",
      [ArbovirusDataTableType.UNAVAILABLE]: "Unavailable",
    }

    if(availableDropdownOptionGroups.length === 1) {
      return {
        type: TableHeaderType.STANDARD as const,
        headerText: `Explore arbovirus ${dropdownOptionToTextFillerMap[availableDropdownOptionGroups[0]]} estimates in our database`
      }
    }

    return {
      type: TableHeaderType.DROPDOWN as const,
      beforeDropdownHeaderText: "Explore arbovirus ",
      dropdownProps: {
        dropdownName: 'Data table selection',
        borderColourClassname: 'border-arbovirus',
        hoverColourClassname: 'hover:bg-arbovirus/50',
        highlightedColourClassname: 'data-[highlighted]:bg-arbovirusHover/50',
        dropdownOptionGroups: [{
          groupHeader: 'Available data tables',
          options: availableDropdownOptionGroups
        }],
        chosenDropdownOption: cleanedSelectedDataTable,
        dropdownOptionToLabelMap: {
          [ArbovirusDataTableType.SEROPREVALENCE]: "seroprevalence",
          [ArbovirusDataTableType.VIRAL_PREVALENCE]: "viral prevalence",
          [ArbovirusDataTableType.UNAVAILABLE]: "Unavailable",
        },
        onDropdownOptionChange: (option) => setArboDataTableType(option)
      },
      afterDropdownHeaderText: "estimates in our database",
      headerTooltipContent: null
    }
  }, [ availableDropdownOptionGroups, cleanedSelectedDataTable, setArboDataTableType ]);

  const csvCitationConfiguration = useMemo(() => ({
    enabled: true,
    citationText: suggestedArboTrackerCitationText,
    csvDownloadCitationText: shortenedArboTrackerCitationText,
    toastId: ToastId.ARBOTRACKER_DOWNLOAD_CSV_CITATION_TOAST,
    buttonContent: <ArboTrackerCitationButtonContent />
  }), []);

  const rowExpansionConfiguration: RowExpansionConfigurationEnabled<ArbovirusEstimate> = useMemo(() => ({
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
    visualization: cleanedSelectedDataTable === ArbovirusDataTableType.SEROPREVALENCE
      ? ((input) => {
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
              dataPoint.country === estimate.country && dataPoint.pathogen === estimate.pathogen && dataPoint.estimateType === ArbovirusEstimateType.Seroprevalence)
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
      })
      : () => null
  }), [ cleanedSelectedDataTable, arboMap, arbovirusVisualizationInformation, router ])

  if(cleanedSelectedDataTable === ArbovirusDataTableType.UNAVAILABLE) {
    return <> No Data Available </>;
  }

  if(cleanedSelectedDataTable === ArbovirusDataTableType.SEROPREVALENCE) {
    return (
      <ArboSeroprevalenceDataTable
        data={dataForSeroprevalenceTable}
        tableHeader={tableHeader}
        columnConfiguration={getArboColumnConfiguration(cleanedSelectedDataTable)}
        rowExpansionConfiguration={rowExpansionConfiguration}
        csvCitationConfiguration={csvCitationConfiguration}
        areSubEstimatesVisible={areSubEstimatesVisible}
        setAreSubEstimatesVisible={setAreSubEstimatesVisible}
      />
    )
  }

  if(cleanedSelectedDataTable === ArbovirusDataTableType.VIRAL_PREVALENCE) {
    return (
      <ArboViralPrevalenceDataTable
        data={dataForViralPrevalenceTable}
        tableHeader={tableHeader}
        columnConfiguration={getArboColumnConfiguration(cleanedSelectedDataTable)}
        rowExpansionConfiguration={rowExpansionConfiguration}
        csvCitationConfiguration={csvCitationConfiguration}
        areSubEstimatesVisible={areSubEstimatesVisible}
        setAreSubEstimatesVisible={setAreSubEstimatesVisible}
      />
    )
  }

  assertNever(cleanedSelectedDataTable)
}
