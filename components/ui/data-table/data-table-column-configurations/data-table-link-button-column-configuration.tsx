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
    const unvalidatedUrl = row.getValue(input.columnConfiguration.fieldNameForLink);

    if(!!unvalidatedUrl && typeof unvalidatedUrl === 'string' && validator.isURL(unvalidatedUrl)) {
      //validator.isURL has been known to return true for some URLS that are not actually valid so further validation is done.
      let validatedUrl: string | undefined = undefined;

      try {
        validatedUrl = new URL(unvalidatedUrl).hostname;
      } catch (error) {}

      if(!validatedUrl) {
        try {
          // There have been instances where the https:// was omitted but the link worked fine otherwise.
          validatedUrl = new URL(`https://${unvalidatedUrl}`).hostname;
        } catch (error) {}
      }

      if(!!validatedUrl) {
        return (
          <Button onClick={() => window.open(validatedUrl)} className="w-full">
            {validatedUrl}
          </Button>
        )
      }

      return <p> URL unavailable </p>
    }

    return <p> URL unavailable </p>
    
  },
});