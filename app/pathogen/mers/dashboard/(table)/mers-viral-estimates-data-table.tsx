import { DataTable, DropdownTableHeader, RowExpansionConfiguration } from "@/components/ui/data-table/data-table";
import { DataTableColumnConfigurationEntryType, columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { MersContext, MersEstimate, MersViralEstimate, isMersViralEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { WhoRegion } from "@/gql/graphql";
import { useContext, useMemo } from "react";
import { AvailableMersDataTables } from "./mers-data-table";
import { useDataTableMapViewingHandler } from "./use-data-table-map-viewing-handler";
import { RechartsVisualization } from "@/components/customs/visualizations/recharts-visualization";
import { MersVisualizationId, getUrlParameterFromVisualizationId, useVisualizationPageConfiguration } from "../../visualizations/visualization-page-config";
import { VisualizationDisplayNameType } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { ageGroupToColourClassnameMap, animalSpeciesToColourClassnameMap, animalSpeciesToStringMap, animalTypeToColourClassnameMap, animalTypeToStringMap, isMersAnimalSpecies, isMersAnimalType, isMersSeroprevalenceEstimateTypename, isMersViralEstimateTypename, mersDataTypeToColourClassnameMap, mersDataTypeToLabelMap } from "../(map)/shared-mers-map-pop-up-variables";

const mersViralEstimateColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.LINK as const,
  fieldName: 'estimateId',
  label: 'Estimate ID',
  isHideable: false,
  isFixed: true,
  fieldNameForLink: 'sourceUrl',
  size: 400,
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: '__typename',
  valueToDisplayLabel: (typename: string) => isMersViralEstimateTypename(typename) ? mersDataTypeToLabelMap[typename] : typename,
  valueToColourSchemeClassnameMap: mersDataTypeToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Estimate Type'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'whoRegion',
  label: 'WHO Region',
  valueToColourSchemeClassnameMap: {
    [WhoRegion.Afr]: "bg-who-region-afr",
    [WhoRegion.Amr]: "bg-who-region-amr",
    [WhoRegion.Emr]: "bg-who-region-emr",
    [WhoRegion.Eur]: "bg-who-region-eur",
    [WhoRegion.Sear]: "bg-who-region-sear",
    [WhoRegion.Wpr]: "bg-who-region-wpr text-white"
  },
  defaultColourSchemeClassname: 'bg-sky-100'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'city',
  label: 'City'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'state',
  label: 'State'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'country',
  label: 'Country'
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'positivePrevalence',
  label: 'Positive Prevalence'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'firstAuthorFullName',
  label: 'First Author Full Name'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sourceType',
  label: 'Source Type'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sourceTitle',
  label: 'Source Title'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'insitutution',
  label: 'Institution'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'animalType',
  valueToDisplayLabel: (animalType: string) => isMersAnimalType(animalType) ? animalTypeToStringMap[animalType] : animalType,
  valueToColourSchemeClassnameMap: animalTypeToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Animal Type'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'animalSpecies',
  valueToDisplayLabel: (animalSpecies: string) => isMersAnimalSpecies(animalSpecies) ? animalSpeciesToStringMap[animalSpecies] : animalSpecies,
  valueToColourSchemeClassnameMap: animalSpeciesToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Animal Species'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'ageGroup',
  valueToColourSchemeClassnameMap: ageGroupToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Age Group'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sampleSize',
  label: 'Sample Size'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'studyInclusionCriteria',
  label: 'Study Inclusion Criteria',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'studyExclusionCriteria',
  label: 'Study Exclusion Criteria',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.LINK_BUTTON as const,
  fieldName: 'sourceUrl',
  label: 'Source',
  fieldNameForLink: 'sourceUrl',
  isSortable: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'id',
  label: 'ID',
  isHideable: false,
  initiallyVisible: false
}];

interface MersViralEstimateDataTableProps {
  tableHeader: DropdownTableHeader<AvailableMersDataTables>;
}

export const MersViralEstimateDataTable = (props: MersViralEstimateDataTableProps) => {
  const state = useContext(MersContext);
  const { viewOnMapHandler } = useDataTableMapViewingHandler();
  const { mersVisualizationInformation } = useVisualizationPageConfiguration();

  const rowExpansionConfiguration: RowExpansionConfiguration<MersEstimate> = useMemo(() => ({
    enabled: true,
    generateExpandedRowStatement: (input) => {
      const estimateId = input.row.getValue('estimateId');
      const estimate = estimateId ? input.data.find((dataPoint) => dataPoint.estimateId === estimateId) : undefined;
      const inclusionCriteriaStatement = estimate?.studyInclusionCriteria ? `The inclusion criteria for the study was "${estimate.studyInclusionCriteria}"` : "No inclusion criteria was specified"
      const exclusionCriteriaStatement = estimate?.studyExclusionCriteria ? `The exclusion criteria for the study was "${estimate.studyExclusionCriteria}"` : "No exclusion criteria was specified"

      return `${inclusionCriteriaStatement}. ${exclusionCriteriaStatement}. Clicking on this row in the table again will minimize it.`
    },
    visualization: ({ data, row, className }) => {
      const idOfEstimate = row.getValue('id');

      if(!idOfEstimate) {
        return null;
      }

      const estimate = data.find((dataPoint) => dataPoint.id === idOfEstimate);

      if(!estimate) {
        return null;
      }

      const countryName = estimate.country;

      const filteredData = data
        .filter((dataPoint) => dataPoint.country === countryName)

      return (
        <RechartsVisualization
          className="h-full-screen"
          data={filteredData}
          highlightedDataPoint={estimate}
          hideArbovirusDropdown={true}
          visualizationInformation={{
            ...mersVisualizationInformation[MersVisualizationId.MEDIAN_VIRAL_POSITIVE_PREVALENCE_OVER_TIME],
            getDisplayName: () => ({
              type: VisualizationDisplayNameType.STANDARD,
              displayName: `Median Viral Positive Prevalence for ${countryName} over time`
            })
          }}
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
    },
    viewOnMapHandler
  }), [ viewOnMapHandler, mersVisualizationInformation ]);

  return (
    <DataTable
      columns={columnConfigurationToColumnDefinitions({ columnConfiguration: mersViralEstimateColumnConfiguration })}
      csvFilename="merstracker_dataset"
      tableHeader={props.tableHeader}
      csvCitationConfiguration={{
        enabled: false
      }}
      rowExpansionConfiguration={rowExpansionConfiguration}
      data={state.filteredData
        .filter((dataPoint): dataPoint is MersViralEstimate => isMersViralEstimate(dataPoint))
      }
    />
  )
}