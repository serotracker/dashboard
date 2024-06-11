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
          typedObjectFromEntries(arboDataTableRows.map((key) => {
            const value = dataPoint[key]

            if(Array.isArray(value)) {
              const joinedArrayValue = value.join(";")

              return [key, joinedArrayValue];
            }

            return [key, value]
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
            "Ware H*, Whelan M*, Ranka H, Roell Y, Aktar S, Kenny S, Pinno E, SeroTracker Research Team, Bobrovitz N**, Arora RK**, Jaenisch T**. ArboTracker: A Dashboard and Data Platform for arbovirus serosurveys (2024); Website, accessible via www.new.SeroTracker.com."
          );

          openToast({ toastId: ToastId.DOWNLOAD_CSV_CITATION_TOAST })
        }}>
          Get Citation for CSV
        </Button>
      </div>
    );
}
