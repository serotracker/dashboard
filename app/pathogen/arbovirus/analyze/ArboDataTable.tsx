"use client";

import { columns } from "@/app/pathogen/arbovirus/analyze/columns";
import { DataTable } from "@/components/ui/data-table";
import React, { useContext } from "react";
import { ArboContext } from "@/contexts/arbo-context";
import useArboData from "@/hooks/useArboData";

export default function ArboDataTable() {
  const dataQuery = useArboData();
  const state = useContext(ArboContext);
  if(state.filteredData?.length > 0 || (dataQuery.isSuccess && dataQuery.data)) {
  return <DataTable columns={columns} data={state.filteredData?.length > 0 ? state.filteredData : dataQuery.data.records} />;
  } else {
    return <>Loading Data ...</>
  }
}
