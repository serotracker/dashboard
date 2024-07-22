import { DataTable, DropdownTableHeader, RowExpansionConfiguration } from "@/components/ui/data-table/data-table";
import { DataTableColumnConfigurationEntryType, columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { MersContext, MersEstimate, MersSeroprevalenceEstimate, isMersSeroprevalenceEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { WhoRegion } from "@/gql/graphql";
import { useContext, useMemo } from "react";
import { AvailableMersDataTables } from "./mers-data-table";
import { useDataTableMapViewingHandler } from "./use-data-table-map-viewing-handler";
import { RechartsVisualization } from "@/components/customs/visualizations/recharts-visualization";
import { MersVisualizationId, getUrlParameterFromVisualizationId, useVisualizationPageConfiguration } from "../../visualizations/visualization-page-config";
import { VisualizationDisplayNameType } from "@/app/pathogen/generic-pathogen-visualizations-page";
import {
  isMersSeroprevalenceEstimateTypename,
  mersDataTypeToColourClassnameMap,
  mersDataTypeToLabelMap
} from "../(map)/shared-mers-map-pop-up-variables";
import { mersSeroprevalenceAndViralEstimateSharedColumnConfiguration } from "./mers-seroprevalence-and-viral-estimates-shared-column-configuration";

const mersSeroprevalenceEstimateColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.LINK as const,
  fieldName: 'estimateId',
  label: 'Estimate ID',
  isHideable: false,
  isFixed: true,
  fieldNameForLink: 'sourceUrl',
  size: 700,
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: '__typename',
  valueToDisplayLabel: (typename: string) => isMersSeroprevalenceEstimateTypename(typename) ? mersDataTypeToLabelMap[typename] : typename,
  valueToColourSchemeClassnameMap: mersDataTypeToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Estimate Type'
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'seroprevalence',
  label: 'Seroprevalence'
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'seroprevalence95CILower',
  label: 'Seroprevalence (95% Confidence Interval Lower Bound)',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'seroprevalence95CIUpper',
  label: 'Seroprevalence (95% Confidence Interval Upper Bound)',
  initiallyVisible: false
},
...mersSeroprevalenceAndViralEstimateSharedColumnConfiguration
];

interface MersSeroprevalenceEstimateDataTableProps {
  tableHeader: DropdownTableHeader<AvailableMersDataTables>;
}

export const MersSeroprevalenceEstimateDataTable = (props: MersSeroprevalenceEstimateDataTableProps) => {
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
            ...mersVisualizationInformation[MersVisualizationId.MEDIAN_SEROPREVALENCE_OVER_TIME],
            getDisplayName: () => ({
              type: VisualizationDisplayNameType.STANDARD,
              displayName: `Median Seroprevalence for ${countryName} over time`
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
      columns={columnConfigurationToColumnDefinitions({ columnConfiguration: mersSeroprevalenceEstimateColumnConfiguration })}
      csvFilename="merstracker_dataset"
      tableHeader={props.tableHeader}
      csvCitationConfiguration={{
        enabled: false
      }}
      rowExpansionConfiguration={rowExpansionConfiguration}
      data={state.filteredData
        .filter((dataPoint): dataPoint is MersSeroprevalenceEstimate => isMersSeroprevalenceEstimate(dataPoint))
      }
    />
  )
}