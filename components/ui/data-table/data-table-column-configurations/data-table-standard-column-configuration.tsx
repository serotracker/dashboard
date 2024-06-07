import { DataTableColumnDef } from "../data-table";
import { StandardDataTableColumnConfigurationEntry } from "../data-table-column-config";
import { getSortableColumnDataTableHeaderComponent } from "../sortable-column-data-table-header";

interface GetDataTableStandardColumnConfigurationInput {
  columnConfiguration: StandardDataTableColumnConfigurationEntry;
}

export const getDataTableStandardColumnConfiguration = (input: GetDataTableStandardColumnConfigurationInput): DataTableColumnDef<Record<string, unknown>, unknown> => {
  const { valueSortingFunction, size } = input.columnConfiguration;

  return {
    accessorKey: input.columnConfiguration.fieldName,
    headerLabel: input.columnConfiguration.label,
    header: (input.columnConfiguration.isSortable === undefined || input.columnConfiguration.isSortable === true) ? getSortableColumnDataTableHeaderComponent({ columnName: input.columnConfiguration.label }) : input.columnConfiguration.label,
    enableHiding: input.columnConfiguration.isHideable ?? true,
    fixed: input.columnConfiguration.isFixed ?? false,
    ...(valueSortingFunction ? {sortingFn: (rowA, rowB, columnId) => valueSortingFunction(rowA.getValue(columnId), rowB.getValue(columnId))} : {}),
    ...(size !== undefined ? { size } : {}),
    cell: ({ row }) => {
      const value = row.getValue(input.columnConfiguration.fieldName);

      if(typeof value !== 'string') {
        return value;
      }

      return input.columnConfiguration.valueToDisplayLabel ? input.columnConfiguration.valueToDisplayLabel(value) ?? value : value
    }
  }
};
