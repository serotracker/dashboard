import { HeaderContext } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface SortableColumnDataTableHeaderComponentProps {
  columnName: string
}

export const getSortableColumnDataTableHeaderComponent = <TEstimate extends Record<string, unknown>>(props: SortableColumnDataTableHeaderComponentProps) => {
  const HeaderComponent: React.FC<HeaderContext<TEstimate, unknown>> = ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {props.columnName}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return HeaderComponent;
}