import { DataTableColumnDef } from "../data-table";
import { StandardDataTableColumnConfigurationEntry } from "../data-table-column-config";
import { getDataTableHeaderComponent } from "../data-table-header";

interface GetDataTableStandardColumnConfigurationInput {
  columnConfiguration: StandardDataTableColumnConfigurationEntry;
}

export const getDataTableStandardColumnConfiguration = (input: GetDataTableStandardColumnConfigurationInput): DataTableColumnDef<Record<string, unknown>, unknown> => ({
  accessorKey: input.columnConfiguration.fieldName,
  header: getDataTableHeaderComponent({ columnName: input.columnConfiguration.label }),
  enableHiding: input.columnConfiguration.isHideable,
  fixed: input.columnConfiguration.isFixed
});