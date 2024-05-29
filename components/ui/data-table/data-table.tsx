"use client";

import {
  SortingState,
  getSortedRowModel,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  VisibilityState,
  getFilteredRowModel,
} from "@tanstack/table-core";
import * as Toast from "@radix-ui/react-toast";
import { ColumnDef, ExpandedState, flexRender, useReactTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useContext, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { useDataTableStyles } from "./use-data-table-styles";
import { ToastContext, ToastId } from "@/contexts/toast-provider";

export type DataTableColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  fixed?: boolean;
  accessorKey: string;
};

interface CsvCitationConfigurationDisabled {
  enabled: false;
}

interface CsvCitationConfigurationEnabled {
  enabled: true;
  citationText: string;
  toastId: ToastId;
}

interface DataTableProps<TData, TValue> {
  columns: DataTableColumnDef<TData, TValue>[];
  csvFilename: string;
  csvCitationConfiguration: CsvCitationConfigurationDisabled | CsvCitationConfigurationEnabled;
  data: TData[];
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const { csvCitationConfiguration } = props;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const { openToast } = useContext(ToastContext);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [expandedState, setExpandedState] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowCanExpand: () => true,
    onExpandedChange: setExpandedState,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      expanded: expandedState
    }
  });

  const { generateClassnameForCell, generateClassnameForHeader } =
    useDataTableStyles<TData, TValue>({ columns: props.columns });

  const getAllVisibleData = () => {
    // Get the columns we want in the csv
    let visibleColumns = table
      .getAllColumns()
      .filter((column) => column.getIsVisible());
    let column_keys: string[] = visibleColumns.map((column) => {
      return column.id;
    });
    const newArrayWithSubsetAttributes: Record<string, any>[] = table
      .getFilteredRowModel()
      .rows.map((originalObject: any) => {
        const newObj: Record<string, any> = {};
        column_keys.forEach((attribute) => {
          let temp_data = originalObject["original"][attribute];
          if (Array.isArray(temp_data)) {
            temp_data = temp_data.join(";");
          }
          newObj[attribute] = temp_data;
        });
        return newObj;
      });
    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: props.csvFilename
    });
    let csv = generateCsv(csvConfig)(newArrayWithSubsetAttributes);
    download(csvConfig)(csv);
  };

  const setAllColumnVisibility = (visibility: boolean) => {
    // Iterate through all columns and toggle visibility based on selectAll state
    table.getAllColumns().forEach((column) => {
      if (column.getCanHide()) {
        column.toggleVisibility(visibility);
      }
    });
  };

  const handleSelectAll = () => {
    setAllColumnVisibility(true);
  };
  const handleClearAll = () => {
    setAllColumnVisibility(false);
  };

  const citationButton = useMemo(() => {
    if(csvCitationConfiguration.enabled === false) {
      return null;
    }

    return (
      <Button
        variant="outline"
        className="mx-2 whitespace-nowrap"
        onClick={() => {
          navigator.clipboard.writeText(csvCitationConfiguration.citationText);
          openToast({ toastId: csvCitationConfiguration.toastId });
        }}
      >
        Get Citation for CSV
      </Button>
    )
  }, [csvCitationConfiguration, openToast])

  return (
    <div>
      <div className="flex items-center justify-between py-4 px-2">
        <h3>Explore arbovirus seroprevalence estimates in our database</h3>
        <div className="flex flex-col lg:flex-row">
          <Button
            variant="outline"
            className="mx-2 whitespace-nowrap"
            onClick={getAllVisibleData}
          >
            Download CSV
          </Button>
          {citationButton}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mx-2 whitespace-nowrap">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-2">
              <Button
                variant="outline"
                className="mr-2 mb-2"
                onClick={handleSelectAll}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                className="mb-2"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize cursor-pointer"
                      checked={column.getIsVisible()}
                      onClick={(e) => {
                        column.toggleVisibility();
                        e.preventDefault();
                      }}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Table className="border-separate border-spacing-0">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const className = generateClassnameForHeader({
                  columnId: header.column.id,
                });

                return (
                  <TableHead key={header.id} className={className}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <>
                <TableRow
                  data-state={row.getIsSelected()}
                  onClick={() => row.getToggleExpandedHandler()()}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={generateClassnameForCell({
                        columnId: cell.column.id,
                      })}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && 
                  <TableRow>
                    <TableCell colSpan={row.getVisibleCells().length} className="p-0">
                      <div className="block w-auto overflow-x-hidden max-w-[95vw] lg:max-w-[80vw] sticky left-0 p-4 max-h-half-screen overflow-y-scroll">
                        <p> 
                        

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse enim nulla, viverra in ultricies nec, viverra nec odio. Aliquam elit felis, tincidunt non risus vitae, pharetra sagittis ipsum. Nunc sit amet blandit lacus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur tempus mi lectus, at porta elit convallis in. Proin a neque justo. Pellentesque vulputate consectetur posuere.

Aenean sit amet vehicula libero, vel porta turpis. Fusce volutpat, arcu sed vehicula sodales, tellus ligula elementum erat, a tempor augue sapien in leo. Mauris accumsan mattis enim ut elementum. Suspendisse quis nulla non lorem vestibulum facilisis. Suspendisse ac pretium velit. Proin luctus leo quis velit ullamcorper interdum non ultricies ligula. Quisque posuere, tortor vitae eleifend commodo, justo ex porttitor ex, sit amet tincidunt odio magna vel dolor. Pellentesque eu nunc ac sapien lacinia dapibus. Donec vitae mattis dolor. Nam rutrum, lacus in luctus tempus, massa risus accumsan dolor, sed iaculis ex erat suscipit lacus. Curabitur auctor scelerisque vestibulum.

Aliquam ut congue sem, id mattis metus. Ut eu quam vel nisi lobortis laoreet. Aliquam iaculis est mi, vitae rhoncus enim ornare non. Praesent libero turpis, rutrum in nisl sit amet, convallis scelerisque orci. Morbi congue facilisis est sit amet tempus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer vehicula velit a vestibulum consectetur. Mauris dictum purus non lectus dignissim ultricies. Curabitur vulputate dui at mollis egestas. Sed viverra ex purus, non mattis mi malesuada at. Quisque tempor a purus a iaculis. Curabitur venenatis sapien tortor, et consectetur massa laoreet in. Curabitur ullamcorper tempus pretium. Praesent aliquet ante eu elit tristique tempus. Vivamus sit amet sapien tortor.

Sed luctus in orci tincidunt vulputate. Vestibulum arcu turpis, commodo vel nisl sit amet, laoreet viverra dolor. Phasellus non nibh tortor. Proin volutpat laoreet blandit. Mauris in arcu dapibus, vulputate nisi et, sollicitudin ex. Nulla viverra scelerisque tincidunt. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec ac enim sit amet lacus tempus aliquam non vel lorem.

Suspendisse vehicula sed mi eu accumsan. Suspendisse lacus sapien, convallis vel ante in, finibus rhoncus justo. Sed tincidunt molestie nisl ut fermentum. Sed dapibus odio in fringilla consectetur. Curabitur et sapien molestie, tempor erat a, egestas enim. Donec et mattis libero. Proin in elit ut nunc scelerisque ultricies a vitae lacus. Nam luctus venenatis ipsum ut placerat. Nunc id sapien arcu. Suspendisse finibus, arcu vitae mattis facilisis, velit lacus sodales ipsum, eget bibendum magna nisi lobortis libero. Nulla dictum mollis condimentum. Sed at tristique justo, aliquet tempor risus. Pellentesque rhoncus elit in odio pharetra, at luctus tellus malesuada. Nunc elementum ante vitae dolor faucibus, eu dapibus ligula feugiat. 
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                }
              </>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={props.columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-white"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-white"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
