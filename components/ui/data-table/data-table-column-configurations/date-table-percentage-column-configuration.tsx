import { DataTableColumnDef } from "../data-table";
import { DataTableColumnConfigurationEntryType, PercentageDataTableColumnConfigurationEntry } from "../data-table-column-config";
import { getSortableColumnDataTableHeaderComponent } from "../sortable-column-data-table-header";
import { getDataTableStandardColumnConfiguration } from "./data-table-standard-column-configuration";

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
  ...getDataTableStandardColumnConfiguration({columnConfiguration: {...input.columnConfiguration, type: DataTableColumnConfigurationEntryType.STANDARD }}),
  cell: ({ row }) => {
    const value = row.getValue(input.columnConfiguration.fieldName);
    const valueAsNumber = valueToNumber(value);

    if(valueAsNumber === 'N/A') {
      return 'N/A';
    }

    return `${(valueAsNumber * 100).toFixed(1)}%`;
  },
});