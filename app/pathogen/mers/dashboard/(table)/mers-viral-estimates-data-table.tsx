import { DataTable, DropdownTableHeader, RowExpansionConfiguration } from "@/components/ui/data-table/data-table";
import { DataTableColumnConfigurationEntryType, columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { MersContext, MersEstimate, MersViralEstimate, isMersViralEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { useContext, useMemo } from "react";
import { AvailableMersDataTables } from "./mers-data-table";
import { useDataTableMapViewingHandler } from "./use-data-table-map-viewing-handler";
import { RechartsVisualization } from "@/components/customs/visualizations/recharts-visualization";
import { MersVisualizationId, getUrlParameterFromVisualizationId, useVisualizationPageConfiguration } from "../../visualizations/visualization-page-config";
import { VisualizationDisplayNameType } from "@/app/pathogen/generic-pathogen-visualizations-page";
import {
  isMersViralEstimateTypename,
  mersDataTypeToColourClassnameMap,
  mersDataTypeToLabelMap
} from "../(map)/shared-mers-map-pop-up-variables";
import { mapMersEstimateBaseForDataTable, mersSeroprevalenceAndViralEstimateSharedColumnConfiguration } from "./mers-seroprevalence-and-viral-estimates-shared-column-configuration";
import { MersViralEstimateForDataTable } from "./use-mers-data-table-data";

const mersViralEstimateColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.LINK as const,
  fieldName: 'primaryEstimateId',
  label: 'Estimate ID',
  isHideable: false,
  isFixed: true,
  fieldNameForLink: 'primaryEstimateSourceUrl',
  size: 700,
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'primaryEstimateTypename',
  valueToDisplayLabel: (typename: string) => isMersViralEstimateTypename(typename) ? mersDataTypeToLabelMap[typename] : typename,
  valueToColourSchemeClassnameMap: mersDataTypeToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Estimate Type'
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'primaryEstimatePositivePrevalence',
  label: 'Positive Prevalence'
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'primaryEstimatePositivePrevalence95CILower',
  label: 'Positive Prevalence (95% Confidence Interval Lower Bound)',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'primaryEstimatePositivePrevalence95CIUpper',
  label: 'Positive Prevalence (95% Confidence Interval Upper Bound)',
  initiallyVisible: false
},
...mersSeroprevalenceAndViralEstimateSharedColumnConfiguration
];

interface MersViralEstimateDataTableProps {
  tableData: MersViralEstimateForDataTable[];
  tableHeader: DropdownTableHeader<AvailableMersDataTables>;
}

export const MersViralEstimateDataTable = (props: MersViralEstimateDataTableProps) => {
  const state = useContext(MersContext);
  const { viewOnMapHandler } = useDataTableMapViewingHandler();
  const { mersVisualizationInformation } = useVisualizationPageConfiguration();

  const rowExpansionConfiguration: RowExpansionConfiguration<MersViralEstimateForDataTable> = useMemo(() => ({
    enabled: true,
    generateExpandedRowStatement: (input) => {
      const idOfEstimate = input.row.getValue('id');
      const estimate = idOfEstimate ? input.data.find((dataPoint) => dataPoint.id === idOfEstimate) : undefined;
      const inclusionCriteriaStatement = estimate?.primaryEstimateInfo.studyInclusionCriteria ? `The inclusion criteria for the study was "${estimate.primaryEstimateInfo.studyInclusionCriteria}"` : "No inclusion criteria was specified"
      const exclusionCriteriaStatement = estimate?.primaryEstimateInfo.studyExclusionCriteria ? `The exclusion criteria for the study was "${estimate.primaryEstimateInfo.studyExclusionCriteria}"` : "No exclusion criteria was specified"

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

      const countryName = estimate.primaryEstimateInfo.country;

      const filteredData = data
        .filter((dataPoint) => dataPoint.primaryEstimateInfo.country === countryName)

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
      data={props.tableData}
    />
  )
}