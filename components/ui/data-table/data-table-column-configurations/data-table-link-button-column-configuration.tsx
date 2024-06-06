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
      let url: string | undefined = undefined;

      try {
        url = new URL(row.getValue(input.columnConfiguration.fieldNameForLink)).hostname;
      } catch (error) {}

      if(!url) {
        try {
          url = new URL(`https://${row.getValue(input.columnConfiguration.fieldNameForLink)}`).hostname;
        } catch (error) {}
      }

      if(!!url) {
        return (
          <Button onClick={() => window.open(url)} className="w-full">
            {url}
          </Button>
        )
      }

      return <p> URL unavailable </p>
    }

    return <p> URL unavailable </p>
    
  },
});