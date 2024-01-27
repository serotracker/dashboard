"use client";

import { columns } from "@/app/pathogen/arbovirus/analyze/columns";
import { DataTable } from "@/components/ui/data-table/data-table";
import React, { useContext } from "react";
import { ArboContext } from "@/contexts/arbo-context";

//TODO: SeanKennyNF remove this type, the typeguard, and all references to expanding and minimizing visualizations once the redesign is rolled out.
interface OldArboDataTableProps {
  expandFilters: () => void;
  minimizeFilters: () => void;
  areFiltersExpanded: boolean;
}

const isOldArboDataTableProps = (props: ArboDataTableProps): props is OldArboDataTableProps =>
  'areFiltersExpanded' in props && typeof props.areFiltersExpanded === 'boolean' &&
  'expandFilters' in props && typeof props.expandFilters === 'function' &&
  'minimizeFilters' in props && typeof props.minimizeFilters === 'function'

interface NewArboDataTableProps {};

type ArboDataTableProps = OldArboDataTableProps | NewArboDataTableProps;

export const ArboDataTable = (props: ArboDataTableProps) => {
  const state = useContext(ArboContext);

  if (state.filteredData?.length > 0) {
    return (
      <DataTable
        columns={columns}
        data={state.filteredData}
        {...(isOldArboDataTableProps(props) ? {
          areFiltersExpanded: props.areFiltersExpanded,
          expandFilters: props.expandFilters,
          minimizeFilters: props.minimizeFilters
        } : {})}
      />
    );
  } else {
    return <>Loading Data ...</>;
  }
}
