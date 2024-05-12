import { DataTable } from "@/components/ui/data-table/data-table";
import { columnConfigurationToColumnDefinitions } from "@/components/ui/data-table/data-table-column-config";
import { DataTableColumnConfigurationEntryType } from "@/components/ui/data-table/data-table-column-config";
import { SarsCov2Context } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { useContext } from "react";

const sarsCov2ColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'whoRegion',
  label: 'WHO Region',
  isHideable: true,
  isFixed: false
}];

export const SarsCov2DataTable = () => {
  const state = useContext(SarsCov2Context);

  return (
    <DataTable
      columns={columnConfigurationToColumnDefinitions({ columnConfiguration: sarsCov2ColumnConfiguration } )}
      data={state.filteredData}
    />
  )
}