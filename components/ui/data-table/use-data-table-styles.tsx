import { DataTableColumnDef } from "./data-table";

interface useDataStylesInput<TData, TValue> {
  columns: DataTableColumnDef<TData, TValue>[];
}

export interface GenerateClassnameForHeaderInput {
  columnId: string;
}

interface GenerateClassnameForCellInput {
  columnId: string;
}

export const useDataTableStyles = <TData, TValue>(input: useDataStylesInput<TData, TValue>) => {
  const { columns } = input;

  const generateClassnameForHeader = (input: GenerateClassnameForHeaderInput) => {
    const { columnId } = input;

    const baseClassnameForHeader = "border-b bg-white whitespace-nowrap";
    const classnameForLeftColumnFixation = "lg:sticky lg:left-0 lg:border-r";

    const columnDefinition = columns.find((column) => column.accessorKey === columnId);

    if (!columnDefinition || columnDefinition.fixed !== true) {
      return baseClassnameForHeader;
    }

    return baseClassnameForHeader
      .concat(" ")
      .concat(classnameForLeftColumnFixation);
  };

  const generateClassnameForCell = (input: GenerateClassnameForCellInput) => {
    const { columnId } = input;

    const baseClassnameForHeader = "border-b bg-white group-hover:bg-zinc-100 whitespace-nowrap";
    const classnameForLeftColumnFixation = "lg:sticky lg:left-0 lg:border-r";

    const columnDefinition = columns.find((column) => column.accessorKey === columnId);

    if (!columnDefinition || columnDefinition.fixed !== true) {
      return baseClassnameForHeader;
    }

    return baseClassnameForHeader
      .concat(" ")
      .concat(classnameForLeftColumnFixation);
  };

  return {
    generateClassnameForHeader,
    generateClassnameForCell
  };
};
