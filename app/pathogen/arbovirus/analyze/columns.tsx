"use client";

import { ColumnDef } from "@tanstack/table-core";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { pathogenColors } from "../dashboard/(map)/MapAndFilters";
import { HeaderContext } from "@tanstack/react-table";

export type Estimate = {
  age_group: string;
  age_maximum: number;
  age_minimum: number;
  antibodies: string[];
  assay: string;
  assay_other: null;
  city: string;
  country: string;
  created_at: string;
  id: string;
  inclusion_criteria: string;
  latitude: number;
  longitude: number;
  pathogen: "DENV" | "ZIKV" | "CHIKV" | "YF" | "WNV" | "MAYV" | undefined;
  producer: string;
  producer_other: string;
  same_frame_target_group: string;
  sample_end_date: string;
  sample_frame: string;
  sample_numerator: number;
  sample_size: number;
  sample_start_date: string;
  seroprevalence: number;
  sex: string;
  source_sheet_id: string;
  state: string;
  url: string;
};

const get_header = (columnName: string) => ({ column }: HeaderContext<Estimate, unknown>): React.JSX.Element => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {columnName}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const columns: ColumnDef<Estimate>[] = [
  {
    accessorKey: "pathogen",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pathogen
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const pathogen = row.getValue("pathogen");
      if (typeof pathogen === "string") {
        let color: string = "";
        switch (pathogen) {
          case "DENV":
            color = "bg-denv";
            break;
          case "ZIKV":
            color = "bg-zikv";
            break;
          case "CHIKV":
            color = "bg-chikv";
            break;
          case "YF":
            color = "bg-yf";
            break;
          case "WNV":
            color = "bg-wnv";
            break;
          case "MAYV":
            color = "bg-mayv";
            break;
          default:
            color = "bg-gray-100";
            break;
        }

        return (
          <div className={color + " p-2 rounded-sm text-center"}>{pathogen}</div>
        )

      }
      return "N/A";
    }
  },
  {
    accessorKey: "seroprevalence",
    header: get_header("Seroprevalence"),
    cell: ({ row }) => {
      const seroprevalence = row.getValue("seroprevalence");
      if (typeof seroprevalence === 'number') {
        return `${(seroprevalence * 100).toFixed(1)}%`;
      } else if (typeof seroprevalence === 'string') {
        const seroprevalenceNumber = parseFloat(seroprevalence);
        if (!isNaN(seroprevalenceNumber)) {
          return `${(seroprevalenceNumber * 100).toFixed(1)}%`;
        }
      }
      return 'N/A';
    }
  },
  {
    accessorKey: "antibodies",
    header: get_header("Antibodies"),
    cell: ({ row }) => {
      const antibodies = row.getValue("antibodies");
      if (Array.isArray(antibodies)) {
        return antibodies.sort().map((antibody) => {
          let color: string = ""
          switch (antibody) {
            case "IgG": 
              color = "bg-blue-700 text-white"
              break;
            case "IgM": 
              color = "bg-black text-white"
              break;
            case "IgAM": 
              color = "bg-green-200"
              break;
            case "NAb": 
              color = "bg-yellow-400"
              break;
            default:
              color = "bg-sky-100"
              break;
          }

          return (
            <span className={color + " m-1 p-2 rounded-sm"} key={antibody}>{antibody}</span>
          )
      });
      }
      return 'N/A';
    }
  },
  {
    accessorKey: "assay",
    header: get_header("Assay"),
  },
  {
    accessorKey: "assay_other",
    header: get_header("Assay Other"),
  },
  {
    accessorKey: "producer",
    header: get_header("Producer"),
  },
  {
    accessorKey: "producer_other",
    header: get_header("Producer Other"),
  },
  // {
  //   accessorKey: "same_frame_target_group",
  //   header: "Same Frame Target Group",
  // },
  // {
  //   accessorKey: "sample_end_date",
  //   header: "Sample End Date",
  // },
  {
    accessorKey: "sample_frame",
    header: get_header("Sample Frame"),
  },
  {
    accessorKey: "sample_numerator",
    header: get_header("Sample Numerator"),
  },
  {
    accessorKey: "sample_size",
    header: get_header("Sample Size"),
  },
  {
    accessorKey: "city",
    header: get_header("City"),
  },
  {
    accessorKey: "country",
    header: get_header("Country"),
  },
  // {
  //   accessorKey: "sample_start_date",
  //   header: "Sample Start Date",
  // },
  {
    accessorKey: "sex",
    header: get_header("Sex"),
  },
  {
    accessorKey: "age_group",
    header: get_header("Age Group"),
  },
  {
    accessorKey: "age_maximum",
    header: get_header("Age Maximum"),
  },
  {
    accessorKey: "age_minimum",
    header: get_header("Age Minimum"),
  },
  {
    accessorKey: "url",
    header: "Source",
    cell: ({ row }) => {
      return (
        <Button onClick={() => window.open(row.getValue("url"))} className="w-full">
          {new URL(row.getValue("url")).hostname}
        </Button>
      )
    },
  },
];
