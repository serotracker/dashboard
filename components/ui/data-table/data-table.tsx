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
import { ColumnDef, ExpandedState, Row, flexRender, useReactTable } from "@tanstack/react-table";
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
import { DataTableStandardRow } from "./data-table-standard-row";
import { DataTableExpandedRow } from "./data-table-expanded-row";
import { DataTableExpandedRowContent } from "./data-table-expanded-row-content";

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

interface RowExpansionConfigurationDisabled {
  enabled: false;
}

export interface RowExpansionConfigurationEnabled<TData extends Record<string, unknown>> {
  enabled: true;
  generateExpandedRowStatement: (input: {data: TData[], row: Row<Record<string, unknown>>}) => string;
  visualization: (props: {className: string, data: TData[], row: Row<Record<string, unknown>>}) => React.ReactNode;
}

interface DataTableProps<TData extends Record<string, unknown>, TValue> {
  columns: DataTableColumnDef<Record<string, unknown>, TValue>[];
  csvFilename: string;
  tableHeader:string;
  csvCitationConfiguration: CsvCitationConfigurationDisabled | CsvCitationConfigurationEnabled;
  rowExpansionConfiguration: RowExpansionConfigurationDisabled | RowExpansionConfigurationEnabled<TData>;
  data: TData[];
}

export function DataTable<TData extends Record<string, unknown>, TValue>(props: DataTableProps<TData, TValue>) {
  const { csvCitationConfiguration, rowExpansionConfiguration } = props;
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
    useDataTableStyles<Record<string, unknown>, TValue>({ columns: props.columns });

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
        <h3>{props.tableHeader}</h3>
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
                {(row.getIsExpanded() && rowExpansionConfiguration.enabled == true) ? (
                  <DataTableExpandedRow
                    row={row}
                    data={props.data}
                    generateExpandedRowStatement={rowExpansionConfiguration.generateExpandedRowStatement}
                  />
                ): (
                  <DataTableStandardRow
                    row={row}
                    generateClassnameForCell={generateClassnameForCell}
                  />
                )}
                {(row.getIsExpanded() && rowExpansionConfiguration.enabled == true) &&
                  <DataTableExpandedRowContent
                    row={row}
                    data={props.data}
                    visualization={rowExpansionConfiguration.visualization}
                  />
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
