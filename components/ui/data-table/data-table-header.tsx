import { HeaderContext } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface DataTableHeaderProps {
  columnName: string
}

export const getDataTableHeaderComponent = <TEstimate extends Record<string, unknown>>(props: DataTableHeaderProps) => {
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