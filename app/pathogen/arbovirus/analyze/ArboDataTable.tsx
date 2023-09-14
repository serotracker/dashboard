"use client";

import { columns } from "@/app/pathogen/arbovirus/analyze/columns";
import { DataTable } from "@/app/pathogen/arbovirus/analyze/data-table";
import React, { useContext } from "react";
import { ArboContext } from "@/contexts/arbo-context";

export default function ArboDataTable() {
  const state = useContext(ArboContext);
  return <DataTable columns={columns} data={state.filteredData} />;
}
