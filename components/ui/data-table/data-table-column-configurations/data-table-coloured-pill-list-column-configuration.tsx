import { cn } from "@/lib/utils";
import { DataTableColumnDef } from "../data-table";
import { ColouredPillListDataTableColumnConfigurationEntry } from "../data-table-column-config";
import { getDataTableHeaderComponent } from "../data-table-header";

interface GetDataTableColouredPillListColumnConfigurationInput {
  columnConfiguration: ColouredPillListDataTableColumnConfigurationEntry;
}

export const getDataTableColouredPillListColumnConfiguration = (input: GetDataTableColouredPillListColumnConfigurationInput): DataTableColumnDef<Record<string, unknown>, unknown> => ({
  accessorKey: input.columnConfiguration.fieldName,
  header: getDataTableHeaderComponent({ columnName: input.columnConfiguration.label }),
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
          {value}
        </span>
      ))
    };

    return 'N/A';
  }
});