import { cn } from "@/lib/utils";
import { DataTableColumnDef } from "../data-table";
import { ColouredPillDataTableColumnConfigurationEntry } from "../data-table-column-config";
import { getDataTableHeaderComponent } from "../data-table-header";

interface GetDataTableColouredPillColumnConfigurationInput {
  columnConfiguration: ColouredPillDataTableColumnConfigurationEntry;
}

export const getDataTableColouredPillColumnConfiguration = (input: GetDataTableColouredPillColumnConfigurationInput): DataTableColumnDef<Record<string, unknown>, unknown> => ({
  accessorKey: input.columnConfiguration.fieldName,
  header: getDataTableHeaderComponent({ columnName: input.columnConfiguration.label }),
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
          {value}
        </div>
      )
    };

    return 'N/A';
  },
  enableHiding: input.columnConfiguration.isHideable,
  fixed: input.columnConfiguration.isFixed
});