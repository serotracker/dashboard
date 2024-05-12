import { DataTableColumnDef } from "../data-table";
import { PercentageDataTableColumnConfigurationEntry } from "../data-table-column-config";
import { getDataTableHeaderComponent } from "../data-table-header";

interface GetDataTablePercentageColumnConfigurationInput {
  columnConfiguration: PercentageDataTableColumnConfigurationEntry;
}

const valueToNumber = (value: unknown): number | "N/A" => {
  if (typeof value === 'number') {
    return value;
  }

  if( typeof value === 'string') {
    return parseFloat(value);
  }

  return 'N/A';
}

export const getDataTablePercentageColumnConfiguration = (input: GetDataTablePercentageColumnConfigurationInput): DataTableColumnDef<Record<string, unknown>, unknown> => ({
  accessorKey: input.columnConfiguration.fieldName,
  header: getDataTableHeaderComponent({ columnName: input.columnConfiguration.label }),
  cell: ({ row }) => {
    const value = row.getValue(input.columnConfiguration.fieldName);
    const valueAsNumber = valueToNumber(value);

    if(valueAsNumber === 'N/A') {
      return 'N/A';
    }

    return `${(valueAsNumber * 100).toFixed(1)}%`;
  },
  enableHiding: input.columnConfiguration.isHideable,
  fixed: input.columnConfiguration.isFixed
});