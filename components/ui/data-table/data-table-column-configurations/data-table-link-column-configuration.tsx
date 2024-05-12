import validator from "validator";
import Link from "next/link";
import { DataTableColumnDef } from "../data-table";
import { LinkDataTableColumnConfigurationEntry } from "../data-table-column-config";
import { getDataTableHeaderComponent } from "../data-table-header";

interface GetDataTableLinkColumnConfigurationInput {
  columnConfiguration: LinkDataTableColumnConfigurationEntry;
}

export const getDataTableLinkColumnConfiguration = (input: GetDataTableLinkColumnConfigurationInput): DataTableColumnDef<Record<string, unknown>, unknown> => ({
  accessorKey: input.columnConfiguration.fieldName,
  header: getDataTableHeaderComponent({ columnName: input.columnConfiguration.label }),
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
  enableHiding: input.columnConfiguration.isHideable,
  fixed: input.columnConfiguration.isFixed
});