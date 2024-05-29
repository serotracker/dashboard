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
import { RechartsVisualization } from "@/components/customs/visualizations/recharts-visualization";
import { ArbovirusVisualizationId, arbovirusVisualizationInformation, getUrlParameterFromVisualizationId } from "@/app/pathogen/arbovirus/visualizations/visualization-page-config";

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

interface DataTableProps<TData extends Record<string, unknown>, TValue> {
  columns: DataTableColumnDef<TData, TValue>[];
  csvFilename: string;
  csvCitationConfiguration: CsvCitationConfigurationDisabled | CsvCitationConfigurationEnabled;
  data: TData[];
}

export function DataTable<TData extends Record<string, unknown>, TValue>(props: DataTableProps<TData, TValue>) {
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
                {row.getIsExpanded() ? (
                  <TableRow
                    data-state={row.getIsSelected()}
                    onClick={() => row.getToggleExpandedHandler()()}
                  >
                    <TableCell colSpan={(row.getVisibleCells().length)} className="p-0">
                      <div className="
                        flex
                        w-auto
                        overflow-x-hidden
                        max-w-[95vw]
                        lg:max-w-[79vw]
                        sticky
                        left-0
                      "
                      >
                        <div
                          className="p-4 border-2"
                        >
                          {flexRender(row.getVisibleCells().at(0)?.column.columnDef.cell, row.getVisibleCells().at(0)?.getContext() as any)}
                        </div>
                        <div
                          className="p-4 border-2 grow"
                        >
                          <p> {(props.data.filter((dataPoint) => dataPoint.estimateId === '761101_MiamiSchoolOfMed_Ehrenkranz_DENV_age01')?.at(0) as any).inclusionCriteria ?? "No inclusion criteria specified."} </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ): (
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
                )}
                {row.getIsExpanded() && 
                  <TableRow>
                    <TableCell colSpan={row.getVisibleCells().length} className="p-0">
                      <div className="
                        flex
                        w-auto
                        overflow-x-hidden
                        max-w-[95vw]
                        lg:max-w-[80vw]
                        sticky
                        left-0
                        p-4
                        max-h-half-screen
                        overflow-y-scroll
                      "
                      >
                        <table className="h-full">
                          <tr>
                            <th> Field </th>
                            <th> Value </th>
                          </tr>

                          {row.getAllCells().map((cell) => (
                            <tr>
                              <td className="p-2 border-2"> {cell.column.id} </td>
                              <td className="p-2 border-2">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                            </tr>
                          ))}
                        </table> 
                        <div className="h-full pl-8 grow">
                          <RechartsVisualization 
                            className="h-full-screen"
                            data={props.data.filter((dataPoint) => dataPoint.country === 'Haiti' && dataPoint.pathogen==='DENV') as any}
                            highlightedDataPoint={props.data.filter((dataPoint) => dataPoint.estimateId === '761101_MiamiSchoolOfMed_Ehrenkranz_DENV_age01').at(0) as any}
                            visualizationInformation={arbovirusVisualizationInformation[ArbovirusVisualizationId.COUNTRY_SEROPREVALENCE_COMPARISON_SCATTER_PLOT]}
                            getUrlParameterFromVisualizationId={getUrlParameterFromVisualizationId}
                            buttonConfig={{
                              downloadButton: {
                                enabled: true,
                              },
                              zoomInButton: {
                                enabled: false,
                              },
                              closeButton: {
                                enabled: false,
                              }
                            }}
                          />
                        </div>
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
