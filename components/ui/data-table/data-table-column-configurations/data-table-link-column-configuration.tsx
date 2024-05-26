import validator from "validator";
import Link from "next/link";
import { DataTableColumnDef } from "../data-table";
import { DataTableColumnConfigurationEntryType, LinkDataTableColumnConfigurationEntry } from "../data-table-column-config";
import { getSortableColumnDataTableHeaderComponent } from "../sortable-column-data-table-header";
import { getDataTableStandardColumnConfiguration } from "./data-table-standard-column-configuration";

interface GetDataTableLinkColumnConfigurationInput {
  columnConfiguration: LinkDataTableColumnConfigurationEntry;
}

export const getDataTableLinkColumnConfiguration = (input: GetDataTableLinkColumnConfigurationInput): DataTableColumnDef<Record<string, unknown>, unknown> => ({
  ...getDataTableStandardColumnConfiguration({columnConfiguration: {...input.columnConfiguration, type: DataTableColumnConfigurationEntryType.STANDARD }}),
  cell: ({ row }) => {
    const link = row.getValue(input.columnConfiguration.fieldNameForLink);

    if(!!link && typeof link === 'string' && validator.isURL(link)) {
      return (
        // TODO: Link styling needs to be globalised. 
        <Link className="w-full underline hover:text-blue-400" href={link} rel="noopener noreferrer" target="_blank">
          {row.getValue(input.columnConfiguration.fieldName)}
        </Link>
      )
    }

    return <p> {row.getValue(input.columnConfiguration.fieldName)} </p>
    
  },
});