import { flexRender } from "@tanstack/react-table";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Row } from "@tanstack/react-table";
import { GenerateClassnameForHeaderInput } from "./use-data-table-styles";

interface DataTableStandardRowProps<TData extends Record<string, unknown>> {
  row: Row<TData>;
  generateClassnameForCell: (input: GenerateClassnameForHeaderInput) => string;
}

export const DataTableStandardRow = <TData extends Record<string, unknown>>(props: DataTableStandardRowProps<TData>) => (
  <TableRow
    data-state={props.row.getIsSelected()}
    onClick={() => props.row.getToggleExpandedHandler()()}
  >
    {props.row.getVisibleCells().map((cell) => (
      <TableCell
        key={cell.id}
        className={props.generateClassnameForCell({
          columnId: cell.column.id,
        })}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    ))}
  </TableRow>
)