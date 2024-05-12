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
    if(!rowA.original.samplingStartDate){
      return -1
    }

    if(!rowB.original.samplingStartDate){
      return 1
    }

    return parseISO(rowA.original.samplingStartDate as string).getTime() - parseISO(rowB.original.samplingStartDate as string).getTime();
  },
  cell: ({ row }) => {
    const samplingStartDate = row.original.samplingStartDate;

    if(!samplingStartDate) {
      return 'N/A';
    }

    return TranslateDate(samplingStartDate as string);
  }
});