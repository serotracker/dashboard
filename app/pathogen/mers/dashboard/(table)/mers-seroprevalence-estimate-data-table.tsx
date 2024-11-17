import { useContext, useMemo } from "react";
import { DataTable, DropdownTableHeader, RowExpansionConfiguration } from "@/components/ui/data-table/data-table";
import { columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { AvailableMersDataTables } from "./mers-data-table";
import { useDataTableMapViewingHandler } from "./use-data-table-map-viewing-handler";
import { useVisualizationPageConfiguration } from "../../visualizations/visualization-page-config";
import {
  generateMersEstimateTableConfigurations,
  GenerateMersEstimateTableConfigurationsType
} from "../(map)/shared-mers-map-pop-up-variables";
import { useMersEstimateColumnConfiguration } from "./mers-seroprevalence-and-viral-estimates-shared-column-configuration";
import { MersSeroprevalenceEstimateForDataTable } from "./use-mers-data-table-data";
import { SubestimateTable } from "@/components/ui/pathogen-map/map-pop-up/subestimate-table";
import { MersFilterMetadataContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-filter-metadata-context";

interface MersSeroprevalenceEstimateDataTableProps {
  tableData: MersSeroprevalenceEstimateForDataTable[];
  tableHeader: DropdownTableHeader<AvailableMersDataTables>;
}

export const MersSeroprevalenceEstimateDataTable = (props: MersSeroprevalenceEstimateDataTableProps) => {
  const { viewOnMapHandler } = useDataTableMapViewingHandler();
  const { dataTableAdditionalButtonConfig } = useContext(MersFilterMetadataContext);

  const { mersSeroprevalenceEstimateColumnConfiguration } = useMersEstimateColumnConfiguration();
  
  const rowExpansionConfiguration: RowExpansionConfiguration<MersSeroprevalenceEstimateForDataTable> = useMemo(() => ({
    enabled: true,
    generateExpandedRowStatement: (input) => {
      const idOfEstimate = input.row.getValue('id');
      const estimate = idOfEstimate ? input.data.find((dataPoint) => dataPoint.id === idOfEstimate) : undefined;
      const inclusionCriteriaStatement = estimate?.primaryEstimateInfo.studyInclusionCriteria ? `The inclusion criteria for the study was "${estimate.primaryEstimateInfo.studyInclusionCriteria}"` : "No inclusion criteria was specified"
      const exclusionCriteriaStatement = estimate?.primaryEstimateInfo.studyExclusionCriteria ? `The exclusion criteria for the study was "${estimate.primaryEstimateInfo.studyExclusionCriteria}"` : "No exclusion criteria was specified"

      return `${inclusionCriteriaStatement}. ${exclusionCriteriaStatement}. Clicking on this row in the table again will minimize it.`
    },
    visualization: (({ data, row, className }) => null),
    additionalTable: ({ data, row }) => {
      const idOfEstimate = row.getValue('id');

      if(!idOfEstimate) {
        return null;
      }

      const estimate = data.find((dataPoint) => dataPoint.id === idOfEstimate);

      if(!estimate) {
        return null;
      }

      const tableConfigurations = generateMersEstimateTableConfigurations({
        type: GenerateMersEstimateTableConfigurationsType.SEROPREVALENCE_ESTIMATES,
        estimate
      });

      return <SubestimateTable tableConfigurations={tableConfigurations} />
    },
    viewOnMapHandler
  }), [ viewOnMapHandler ]);

  return (
    <DataTable
      columns={columnConfigurationToColumnDefinitions({ columnConfiguration: mersSeroprevalenceEstimateColumnConfiguration })}
      csvFilename="merstracker_dataset"
      tableHeader={props.tableHeader}
      csvCitationConfiguration={{
        enabled: false
      }}
      additionalButtonConfiguration={dataTableAdditionalButtonConfig}
      secondAdditionalButtonConfiguration={{
        enabled: true,
        buttonText: "Data Dictionary",
        link: "https://airtable.com/app3ebPi0gt39r3xI/shrWqXLuWPhnic2xw"
      }}
      rowExpansionConfiguration={rowExpansionConfiguration}
      data={props.tableData}
    />
  )
}