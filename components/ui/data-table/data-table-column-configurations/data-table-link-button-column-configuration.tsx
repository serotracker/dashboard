import validator from "validator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTableColumnDef } from "../data-table";
import { LinkButtonDataTableColumnConfigurationEntry } from "../data-table-column-config";
import { getDataTableHeaderComponent } from "../data-table-header";

interface GetDataTableLinkButtonColumnConfigurationInput {
  columnConfiguration: LinkButtonDataTableColumnConfigurationEntry;
}

export const getDataTableLinkButtonColumnConfiguration = (input: GetDataTableLinkButtonColumnConfigurationInput): DataTableColumnDef<Record<string, unknown>, unknown> => ({
  accessorKey: input.columnConfiguration.fieldName,
  header: getDataTableHeaderComponent({ columnName: input.columnConfiguration.label }),
  cell: ({ row }) => {
    const link = row.getValue(input.columnConfiguration.fieldNameForLink);

    if(!!link && typeof link === 'string' && validator.isURL(link)) {
      return (
        <Button onClick={() => window.open(row.getValue(input.columnConfiguration.fieldNameForLink))} className="w-full">
          {new URL(row.getValue(input.columnConfiguration.fieldNameForLink)).hostname}
        </Button>
      )
    }

    return <p> URL unavailable </p>
    
  },
  enableHiding: input.columnConfiguration.isHideable,
  fixed: input.columnConfiguration.isFixed
});