"use client";

import React, { useContext } from "react";
import { ArboContext } from "@/contexts/arbo-context/arbo-context";
import { Button } from "@/components/ui/button";
import { download, generateCsv, mkConfig } from "export-to-csv";


export const ArboBanner = () => {
    const state = useContext(ArboContext);
    
    // removing for now -- will add back once we get greenlight from the colorado team
    // const downloadData = () => {
    //     const csvConfig = mkConfig({
    //         useKeysAsHeaders: true,
    //         filename: "arbotracker_filtered_dataset",
    //       });
    //       let csv = generateCsv(csvConfig)(state.filteredData);
    //       download(csvConfig)(csv);
    // }

    return (
      <div className="w-full h-fit relative row-span-2 rounded-md mt-4 border border-background p-4">
        <p>
            ArboTracker is a dashboard and platform for Arbovirus serosurveys. 
            We conduct an ongoing systematic review to track serosurveys 
            (antibody testing-based surveillance efforts) around the world and 
            visualize findings on this dashboard.
        </p>
        {/* <Button className="w-[30%] bg-background hover:bg-backgroundHover" onClick={downloadData}>
            Download CSV
        </Button> */}
      </div>
    );
}
