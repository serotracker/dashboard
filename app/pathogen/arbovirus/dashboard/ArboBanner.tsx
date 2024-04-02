"use client";

import React, { useContext } from "react";
import { ArboContext } from "@/contexts/arbo-context/arbo-context";
import { Button } from "@/components/ui/button";
import { download, generateCsv, mkConfig } from "export-to-csv";


export const ArboBanner = () => {
    const state = useContext(ArboContext);
    
    const downloadData = () => {
        const csvConfig = mkConfig({
            useKeysAsHeaders: true,
            filename: "arbotracker_filtered_dataset",
          });
          let csv = generateCsv(csvConfig)(state.filteredData);
          download(csvConfig)(csv);
    }

    return (
      <div className="w-full border border-background rounded-md items-center p-2 mt-4 flex justify-between">
        <p className="text-sm">
            ArboTracker is a dashboard and platform for Arbovirus serosurveys. 
            We conduct an ongoing systematic review to track serosurveys 
            (antibody testing-based surveillance efforts) around the world and 
            visualize findings on this dashboard.
        </p>
        <Button className="w-[30%] bg-background" onClick={downloadData}>
            Download CSV
        </Button>
      </div>
    );
}
