"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import React, { useContext } from "react";
import { ArboContext } from "@/contexts/arbo-context";
import { columns } from "./columns";

export const ArboDataTable = () => {
  const state = useContext(ArboContext);

  if (state.filteredData?.length > 0) {
    return (
      <DataTable
        columns={columns}
        data={state.filteredData}
      />
    );
  } else {
    return <>Loading Data ...</>;
  }
}
