import { X, Check } from "lucide-react";

import { DataTableColumnDef } from "../data-table";
import { DataTableColumnConfigurationEntryType, BooleanDataTableColumnConfigurationEntry } from "../data-table-column-config";
import { getDataTableStandardColumnConfiguration } from "./data-table-standard-column-configuration";

interface GetDataTableBooleanColumnConfigurationInput {
  columnConfiguration: BooleanDataTableColumnConfigurationEntry;
}

export const getDataTableBooleanColumnConfiguration = (input: GetDataTableBooleanColumnConfigurationInput): DataTableColumnDef<Record<string, unknown>, unknown> => ({
  ...getDataTableStandardColumnConfiguration({columnConfiguration: {...input.columnConfiguration, type: DataTableColumnConfigurationEntryType.STANDARD }}),
  cell: ({ row }) => {
    const value = row.getValue(input.columnConfiguration.fieldName);
    
    return value ? <Check /> : <X />;
  },
});