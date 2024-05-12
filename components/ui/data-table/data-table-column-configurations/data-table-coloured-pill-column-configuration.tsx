import { cn } from "@/lib/utils";
import { DataTableColumnDef } from "../data-table";
import { ColouredPillDataTableColumnConfigurationEntry, DataTableColumnConfigurationEntryType } from "../data-table-column-config";
import { getSortableColumnDataTableHeaderComponent } from "../sortable-column-data-table-header";
import { getDataTableStandardColumnConfiguration } from "./data-table-standard-column-configuration";

interface GetDataTableColouredPillColumnConfigurationInput {
  columnConfiguration: ColouredPillDataTableColumnConfigurationEntry;
}

export const getDataTableColouredPillColumnConfiguration = (input: GetDataTableColouredPillColumnConfigurationInput): DataTableColumnDef<Record<string, unknown>, unknown> => ({
  ...getDataTableStandardColumnConfiguration({columnConfiguration: {...input.columnConfiguration, type: DataTableColumnConfigurationEntryType.STANDARD }}),
  cell: ({ row }) => {
    const value = row.getValue(input.columnConfiguration.fieldName);
    if (typeof value === 'string') {
      return (
        <div
          className={cn(
            "p-2 rounded-sm text-center",
            input.columnConfiguration.valueToColourSchemeClassnameMap[value] ?? input.columnConfiguration.defaultColourSchemeClassname
          )}
        >
          {input.columnConfiguration.valueToDisplayLabel ? input.columnConfiguration.valueToDisplayLabel(value) ?? value : value}
        </div>
      )
    };

    return 'N/A';
  },
});