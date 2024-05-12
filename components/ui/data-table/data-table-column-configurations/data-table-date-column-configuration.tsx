import { Row } from "@tanstack/react-table";
import parseISO from "date-fns/parseISO";
import { DataTableColumnDef } from "../data-table";
import { DateDataTableColumnConfigurationEntry } from "../data-table-column-config";
import { getDataTableHeaderComponent } from "../data-table-header";
import { TranslateDate } from "@/utils/translate-util/translate-service";

interface GetDataTableDateColumnConfigurationInput {
  columnConfiguration: DateDataTableColumnConfigurationEntry;
}

export const getDataTableDateColumnConfiguration = (input: GetDataTableDateColumnConfigurationInput): DataTableColumnDef<Record<string, unknown>, unknown> => ({
  accessorKey: input.columnConfiguration.fieldName,
  header: getDataTableHeaderComponent({ columnName: input.columnConfiguration.label }),
  sortingFn: (rowA: Row<Record<string, unknown>>, rowB: Row<Record<string, unknown>>, columnId: string) => {
    const rowADate = rowA.original[input.columnConfiguration.fieldName];
    const rowBDate = rowA.original[input.columnConfiguration.fieldName];

    if(!rowADate || typeof rowADate !== 'string'){
      return -1
    }

    if(!rowBDate || typeof rowBDate !== 'string'){
      return 1
    }

    return parseISO(rowADate).getTime() - parseISO(rowBDate).getTime();
  },
  cell: ({ row }) => {
    const date = row.original[input.columnConfiguration.fieldName];

    if(!date || typeof date !== 'string') {
      return 'N/A';
    }

    return TranslateDate(date);
  },
  enableHiding: input.columnConfiguration.isHideable,
  fixed: input.columnConfiguration.isFixed
});