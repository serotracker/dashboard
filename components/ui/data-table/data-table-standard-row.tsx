import { flexRender } from "@tanstack/react-table";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Row } from "@tanstack/react-table";
import { GenerateClassnameForHeaderInput } from "./use-data-table-styles";
import { cn } from "@/lib/utils";

interface DataTableStandardRowProps<TData extends Record<string, unknown>> {
  row: Row<TData>;
  generateClassnameForCell: (input: GenerateClassnameForHeaderInput) => string;
}

export const DataTableStandardRow = <TData extends Record<string, unknown>>(props: DataTableStandardRowProps<TData>) => (
  <TableRow
    data-state={props.row.getIsSelected()}
    onClick={() => props.row.getToggleExpandedHandler()()}
    className="cursor-pointer"
  >
    {props.row.getVisibleCells().map((cell, index) => (
      <TableCell
        key={cell.id}
        className={cn(
          props.generateClassnameForCell({
            columnId: cell.column.id,
          }),
          index === 0 ? "border-l" : ""
        )}
      >
        {cell.column.columnDef.size ? (
          <div className="block p-4 -m-4 overflow-x-hidden" style={{
            width: cell.column.columnDef.size,
          }}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        ) : (
          flexRender(cell.column.columnDef.cell, cell.getContext())
        )}
      </TableCell>
    ))}
  </TableRow>
)