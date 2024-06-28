import { flexRender } from "@tanstack/react-table";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Row } from "@tanstack/react-table";
import { Button } from '@/components/ui/button'

interface DataTableExpandedRowContentProps<TData extends Record<string, unknown>> {
  row: Row<Record<string, unknown>>;
  data: TData[];
  visualization: (props: {className: string, data: TData[], row: Row<Record<string, unknown>>}) => React.ReactNode;
  viewOnMapHandler: (props: {data: TData[], row: Row<Record<string, unknown>>}) => void;
}

export const DataTableExpandedRowContent = <TData extends Record<string, unknown>>(props: DataTableExpandedRowContentProps<TData>) => {
  return (
    <TableRow>
      <TableCell colSpan={props.row.getVisibleCells().length} className="p-0">
        <div className="
          lg:flex
          block
          w-auto
          overflow-x-hidden
          max-w-[92vw]
          lg:max-w-[79vw]
          sticky
          left-0
          p-4
          max-h-half-screen
          overflow-y-scroll
          border-b
          border-l
        "
        >
          <div className="h-full lg:max-w-[50%] w-full flex flex-col">
            <table className="w-full mb-4">
              <tr>
                <th> Field </th>
                <th> Value </th>
              </tr>

              {props.row.getAllCells().map((cell) => (
                <tr key={cell.id}>
                  <td className="p-2 border-2"> {cell.column.id} </td>
                  <td className="p-2 border-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                </tr>
              ))}
            </table> 
            <Button
              className="mx-auto"
              onClick={() => props.viewOnMapHandler({ data: props.data, row: props.row })}
            >
              View On Map
            </Button>
          </div>
          <div className="h-full lg:pl-8 grow">
            <props.visualization
              className="h-full-screen"
              data={props.data}
              row={props.row}
            />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}