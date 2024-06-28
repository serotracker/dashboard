"use client";

import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { download, generateCsv, mkConfig } from "export-to-csv";
import Link from "next/link";
import { ToastContext, ToastId } from "@/contexts/toast-provider";
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { typedObjectFromEntries, typedObjectKeys } from "@/lib/utils";
import { arboDataTableRows } from "./(table)/ArboDataTable";

export const ArboBanner = () => {
    const state = useContext(ArboContext);
    const { openToast } = useContext(ToastContext)
    
    const downloadData = () => {
      const csvConfig = mkConfig({
        useKeysAsHeaders: true,
        filename: "arbotracker_dataset",
      });

      const csv = generateCsv(csvConfig)(
        state.filteredData.map((dataPoint) => (
          typedObjectFromEntries(arboDataTableRows.map(({ fieldName, label }) => {
            const value = dataPoint[fieldName]

            if(Array.isArray(value)) {
              const joinedArrayValue = value.join(";")

              return [label, joinedArrayValue];
            }

            return [label, value]
          }))
        ))
      );

      download(csvConfig)(csv);
    }

    return (
      <div className="w-full h-fit relative row-span-2 rounded-md mt-4 border border-background p-4">
        <p>
          ArboTracker is a dashboard and platform for Arbovirus serosurveys. 
          We conduct an <Link href={"/about/about-our-data"} className={"underline text-link"}>ongoing systematic review</Link> to track serosurveys 
          (antibody testing-based surveillance efforts) around the world and 
          visualize findings on this dashboard.
        </p>
        <Button className="w-[30%] bg-background hover:bg-backgroundHover" onClick={downloadData}>
          Download CSV
        </Button>
        <Button className="w-[30%] bg-background hover:bg-backgroundHover ml-2" onClick={() => {
          navigator.clipboard.writeText(
            "Harriet Ware, Mairead Whelan, Anabel Selemon, Emilie Toews, Shaila Akter, Niklas Bobrovitz, Rahul Arora, Yannik Roell, Thomas Jaenisch. A living systematic review of arbovirus seroprevalence studies. PROSPERO 2024 CRD42024551000 Available from: https://www.crd.york.ac.uk/prospero/display_record.php?ID=CRD42024551000"
          );

          openToast({ toastId: ToastId.DOWNLOAD_CSV_CITATION_TOAST })
        }}>
          Get Citation for CSV
        </Button>
      </div>
    );
}
