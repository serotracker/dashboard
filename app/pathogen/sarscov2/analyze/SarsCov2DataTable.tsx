"use client";

import { columns } from "@/app/pathogen/sarscov2/analyze/columns";
import { DataTable } from "@/components/ui/data-table";
import React, { useContext } from "react";
import { SarsCov2Context } from "@/contexts/sarscov2-context";

export default function SarsCov2DataTable() {
  const state = useContext(SarsCov2Context);
  return <DataTable columns={columns} data={state.filteredData} />;
}
