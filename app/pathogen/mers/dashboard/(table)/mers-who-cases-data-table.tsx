import { DataTable, DropdownTableHeader, RowExpansionConfiguration } from "@/components/ui/data-table/data-table";
import { DataTableColumnConfigurationEntryType, columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { useMemo } from "react";
import { AvailableMersDataTables } from "./mers-data-table";
import { WhoRegion } from "@/gql/graphql";
import { useDataTableMapViewingHandler } from "./use-data-table-map-viewing-handler";
import { MersWhoCaseDataEntryForDataTable } from "./use-mers-data-table-data";
import { defaultBackgroundColourClassnamesForUnRegions, isUNRegion, unRegionEnumToLabelMap } from "@/lib/un-regions";

const mersWhoCasesDataTableColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'countryName',
  label: 'Country or Area',
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
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'unRegion',
  label: 'UN Region',
  valueToColourSchemeClassnameMap: defaultBackgroundColourClassnamesForUnRegions,
  valueToDisplayLabel: (unRegion: string) => isUNRegion(unRegion) ? unRegionEnumToLabelMap[unRegion] : unRegion,
  defaultColourSchemeClassname: 'bg-sky-100'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'positiveCases',
  label: 'Positive Cases'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'id',
  label: 'ID',
  isHideable: false,
  initiallyVisible: false
}];

interface MersWhoCasesDataTableProps {
  tableData: MersWhoCaseDataEntryForDataTable[];
  tableHeader: DropdownTableHeader<AvailableMersDataTables>;
}

export const MersWhoCasesDataTable = (props: MersWhoCasesDataTableProps) => {
  const { viewOnMapHandler } = useDataTableMapViewingHandler();

  const rowExpansionConfiguration: RowExpansionConfiguration<MersWhoCaseDataEntryForDataTable> = useMemo(() => ({
    enabled: true,
    generateExpandedRowStatement: ({ data, row }) => 'Clicking on this row in the table again will minimize it',
    visualization: ({ data, row, className }) => null,
    viewOnMapHandler
  }), [ viewOnMapHandler ]);

  return (
    <DataTable
      columns={columnConfigurationToColumnDefinitions({ columnConfiguration: mersWhoCasesDataTableColumnConfiguration })}
      csvFilename="merstracker_mers_positive_cases"
      tableHeader={props.tableHeader}
      csvCitationConfiguration={{
        enabled: false
      }}
      additionalButtonConfiguration={{
        enabled: false
      }}
      secondAdditionalButtonConfiguration={{
        enabled: false
      }}
      rowExpansionConfiguration={rowExpansionConfiguration}
      data={props.tableData}
    />
  )
}