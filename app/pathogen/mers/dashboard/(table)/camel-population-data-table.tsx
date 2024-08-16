import { DataTable, DropdownTableHeader, RowExpansionConfiguration } from "@/components/ui/data-table/data-table";
import { DataTableColumnConfigurationEntryType, columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { useMemo } from "react";
import { AvailableMersDataTables } from "./mers-data-table";
import { WhoRegion } from "@/gql/graphql";
import { useDataTableMapViewingHandler } from "./use-data-table-map-viewing-handler";
import { MersVisualizationId, getUrlParameterFromVisualizationId, useVisualizationPageConfiguration } from "../../visualizations/visualization-page-config";
import { RechartsVisualization } from "@/components/customs/visualizations/recharts-visualization";
import { useFaoYearlyCamelPopulationData } from "@/hooks/mers/useFaoYearlyCamelPopulationData";
import { VisualizationDisplayNameType } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { FaoYearlyCamelPopulationDataEntryForTable, unformatFaoCamelPopulationDataFromTable } from "./use-mers-data-table-data";

const camelPopulationDataTableColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'country',
  label: 'Country',
  isFixed: true,
  size: 500,
  isHideable: false
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
  fieldName: 'year',
  label: 'Year'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'camelCount',
  label: 'Camel Count'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'camelCountPerCapita',
  label: 'Camel Count Per Capita'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'note',
  label: 'Note'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'id',
  label: 'ID',
  isHideable: false,
  initiallyVisible: false
}];

interface CamelPopulationDataTableProps {
  tableData: FaoYearlyCamelPopulationDataEntryForTable[];
  tableHeader: DropdownTableHeader<AvailableMersDataTables>;
}

export const CamelPopulationDataTable = (props: CamelPopulationDataTableProps) => {
  const { viewOnMapHandler } = useDataTableMapViewingHandler();
  const { yearlyFaoCamelPopulationData } = useFaoYearlyCamelPopulationData();
  const { mersVisualizationInformation } = useVisualizationPageConfiguration();

  const rowExpansionConfiguration: RowExpansionConfiguration<FaoYearlyCamelPopulationDataEntryForTable> = useMemo(() => ({
    enabled: true,
    generateExpandedRowStatement: ({ data, row }) => 'Clicking on this row in the table again will minimize it',
    visualization: ({ data, row, className }) => {
      const camelDataPointId = row.getValue('id');

      if(!camelDataPointId) {
        return null;
      }

      const camelDataPoint = data.find((dataPoint) => dataPoint.id === camelDataPointId);

      if(!camelDataPoint) {
        return null;
      }

      const countryName = camelDataPoint.country

      const formattedDataPoint = unformatFaoCamelPopulationDataFromTable(camelDataPoint);
      const formattedData = (yearlyFaoCamelPopulationData ?? [])
        .filter((dataPoint) => dataPoint.country.name === countryName)
      
      return (
        <RechartsVisualization
          className="h-full-screen"
          data={formattedData}
          highlightedDataPoint={formattedDataPoint}
          hideArbovirusDropdown={true}
          visualizationInformation={{
            ...mersVisualizationInformation[MersVisualizationId.CAMEL_POPULATION_OVER_TIME],
            getDisplayName: () => ({
              type: VisualizationDisplayNameType.STANDARD,
              displayName: `Camel Population over time for ${countryName}`
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
  }), [ viewOnMapHandler, yearlyFaoCamelPopulationData, mersVisualizationInformation ]);

  return (
    <DataTable
      columns={columnConfigurationToColumnDefinitions({ columnConfiguration: camelPopulationDataTableColumnConfiguration })}
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