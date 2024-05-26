import { cn } from "@/lib/utils";
import { DataTableColumnDef } from "../data-table";
import { ColouredPillListDataTableColumnConfigurationEntry, DataTableColumnConfigurationEntryType } from "../data-table-column-config";
import { getSortableColumnDataTableHeaderComponent } from "../sortable-column-data-table-header";
import { getDataTableStandardColumnConfiguration } from "./data-table-standard-column-configuration";

interface GetDataTableColouredPillListColumnConfigurationInput {
  columnConfiguration: ColouredPillListDataTableColumnConfigurationEntry;
}

export const getDataTableColouredPillListColumnConfiguration = (input: GetDataTableColouredPillListColumnConfigurationInput): DataTableColumnDef<Record<string, unknown>, unknown> => ({
  ...getDataTableStandardColumnConfiguration({columnConfiguration: {...input.columnConfiguration, type: DataTableColumnConfigurationEntryType.STANDARD }}),
  cell: ({ row }) => {
    const values = row.getValue(input.columnConfiguration.fieldName);
    if (Array.isArray(values) && values.length > 0) {
      return values.map((value) => (
        <span
          className={
            cn(
              "m-1 p-2 rounded-sm",
              input.columnConfiguration.valueToColourSchemeClassnameMap[value] ?? input.columnConfiguration.defaultColourSchemeClassname
            )}
            key={value}
        >
          {input.columnConfiguration.valueToDisplayLabel ? input.columnConfiguration.valueToDisplayLabel(value) ?? value : value}
        </span>
      ))
    };

    return 'N/A';
  }
});