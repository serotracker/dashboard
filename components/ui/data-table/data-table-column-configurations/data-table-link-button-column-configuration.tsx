import validator from "validator";
import { Button } from "@/components/ui/button";
import { DataTableColumnDef } from "../data-table";
import { DataTableColumnConfigurationEntryType, LinkButtonDataTableColumnConfigurationEntry } from "../data-table-column-config";
import { getDataTableStandardColumnConfiguration } from "./data-table-standard-column-configuration";

interface GetDataTableLinkButtonColumnConfigurationInput {
  columnConfiguration: LinkButtonDataTableColumnConfigurationEntry;
}

export const getDataTableLinkButtonColumnConfiguration = (input: GetDataTableLinkButtonColumnConfigurationInput): DataTableColumnDef<Record<string, unknown>, unknown> => ({
  ...getDataTableStandardColumnConfiguration({columnConfiguration: {...input.columnConfiguration, type: DataTableColumnConfigurationEntryType.STANDARD }}),
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
});