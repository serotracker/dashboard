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

    const { icon }  = value ? {
      icon: <Check className="p-0.5 bg-green-400 text-green-900 rounded-full" />,
    } : {
      icon: <X className="p-0.5 bg-red-400 text-red-900 rounded-full" />,
    }
    
    return (
      <div className="w-full h-full flex justify-center">
        {icon}
      </div>
    )
  },
});