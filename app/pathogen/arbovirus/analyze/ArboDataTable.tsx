"use client";

import { columns } from "@/app/pathogen/arbovirus/analyze/columns";
import { DataTable } from "@/components/ui/data-table";
import React, { useContext } from "react";
import { ArboContext } from "@/contexts/arbo-context";

interface ArboDataTableProps {
  expandFilters: () => void;
  areFiltersExpanded: boolean;
}

export default function ArboDataTable({expandFilters, areFiltersExpanded}: ArboDataTableProps) {
  const state = useContext(ArboContext);

  if(state.filteredData?.length > 0) {
    return <DataTable 
      columns={columns}
      data={state.filteredData}
      expandFilters={expandFilters}
      areFiltersExpanded={areFiltersExpanded}
    />;
  } else {
    return <>Loading Data ...</>
  }
}
