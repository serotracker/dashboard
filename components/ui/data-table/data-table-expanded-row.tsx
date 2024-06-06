import { flexRender } from "@tanstack/react-table";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Row } from "@tanstack/react-table";
import { Breakpoint, useBreakpoint } from "@/hooks/useBreakpoint";

interface DataTableExpandedRowProps<TData extends Record<string, unknown>> {
  row: Row<Record<string, unknown>>;
  data: TData[];
  generateExpandedRowStatement: (input: {data: TData[], row: Row<Record<string, unknown>>}) => string;
}

export const DataTableExpandedRow = <TData extends Record<string, unknown>>(props: DataTableExpandedRowProps<TData>) => {
  const remainingCell = props.row.getVisibleCells().at(0);
  const { currentBreakpoint, isGreaterThanOrEqualToBreakpoint } = useBreakpoint();

  if(!remainingCell) {
    return null;
  }

  return (
    <TableRow
      data-state={props.row.getIsSelected()}
      onClick={() => props.row.getToggleExpandedHandler()()}
      className="cursor-pointer"
    >
      <TableCell colSpan={(props.row.getVisibleCells().length)} className="p-0">
        <div className="
          flex
          w-auto
          overflow-x-hidden
          max-w-[92vw]
          lg:max-w-[79vw]
          sticky
          left-0
        "
        >
          <div
            className="p-4 flex items-center border-b bg-white group-hover:bg-zinc-100 whitespace-nowrap border-r border-l overflow-x-hidden"
            style={ isGreaterThanOrEqualToBreakpoint(currentBreakpoint, Breakpoint.LG) ? {
              width: remainingCell.column.getSize() + 2,
            } : {}}
          >
            {flexRender(remainingCell.column.columnDef.cell, remainingCell.getContext())}
          </div>
          <div className="p-4 grow inline w-0 border-b bg-white group-hover:bg-zinc-100">
            <p> {props.generateExpandedRowStatement({ data: props.data, row: props.row })} </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}