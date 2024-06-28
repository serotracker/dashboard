import { DataTable, DropdownTableHeader } from "@/components/ui/data-table/data-table";
import { DataTableColumnConfigurationEntryType, columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { WhoRegion } from "@/gql/graphql";
import { useContext } from "react";
import { AvailableMersDataTables } from "./mers-data-table";

const mersSeroprevalenceEstimateColumnConfiguration = [{
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
  fieldName: 'country',
  label: 'Country'
}];

interface MersSeroprevalenceEstimateDataTableProps {
  tableHeader: DropdownTableHeader<AvailableMersDataTables>;
}

export const MersSeroprevalenceEstimateDataTable = (props: MersSeroprevalenceEstimateDataTableProps) => {
  const state = useContext(MersContext);

  return (
    <DataTable
      columns={columnConfigurationToColumnDefinitions({ columnConfiguration: mersSeroprevalenceEstimateColumnConfiguration })}
      csvFilename="merstracker_dataset"
      tableHeader={props.tableHeader}
      csvCitationConfiguration={{
        enabled: false
      }}
      rowExpansionConfiguration={{
        enabled: false
      }}
      data={state.filteredData}
    />
  )
}