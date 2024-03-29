import { useContext, useMemo, useState } from "react";

import { ArboContext } from "@/contexts/arbo-context/arbo-context";
import {
  mixColours,
  typedGroupBy,
  typedObjectEntries,
  typedObjectFromEntries,
  typedObjectKeys,
} from "@/lib/utils";
import { arbovirusesSF, convertArboSFtoArbo, median } from "./recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WHORegion } from "@/lib/who-regions";
import { Button } from "@/components/ui/button";

enum AgeGroup {
  "Adults (18-64 years)" = "Adults (18-64 years)",
  "Children and Youth (0-17 years)" = "Children and Youth (0-17 years)",
  "Seniors (65+ years)" = "Seniors (65+ years)",
  "Multiple groups" = "Multiple groups",
}

export const MedianSeroprevalenceByWhoRegionAndAgeGroupTable = () => {
  const state = useContext(ArboContext);
  const pathogenOrder: arbovirusesSF[] = [
    "ZIKV",
    "DENV",
    "CHIKV",
    "YF",
    "WNV",
    "MAYV",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const datasetGroupedByArbovirus = useMemo(
    () =>
      typedGroupBy(
        state.filteredData,
        (dataPoint) => dataPoint.pathogen as arbovirusesSF
      ),
    [state.filteredData]
  );

  const datasetGroupedByArbovirusAndWhoRegion = useMemo(
    () =>
      typedObjectFromEntries(
        typedObjectEntries(datasetGroupedByArbovirus).map(
          ([arbovirus, dataPoints]) => [
            arbovirus,
            typedGroupBy(
              dataPoints,
              (dataPoint) => dataPoint.whoRegion as WHORegion
            ),
          ]
        )
      ),
    [datasetGroupedByArbovirus]
  );

  const tableDatasets = useMemo(
    () =>
      typedObjectFromEntries(
        typedObjectEntries(datasetGroupedByArbovirusAndWhoRegion).map(
          ([arbovirus, dataGroupedByWHORegion]) => [
            arbovirus,
            typedObjectFromEntries(
              typedObjectEntries(dataGroupedByWHORegion).map(
                ([whoRegion, dataPoints]) => [
                  whoRegion,
                  typedGroupBy(
                    dataPoints,
                    (dataPoint) => dataPoint.ageGroup as AgeGroup
                  ),
                ]
              )
            ),
          ]
        )
      ),
    [datasetGroupedByArbovirusAndWhoRegion]
  );

  const currentlySelectedArbovirus = useMemo(
    () => pathogenOrder[currentIndex],
    [pathogenOrder, currentIndex]
  );

  const datasetToDisplay = useMemo(
    () => tableDatasets[currentlySelectedArbovirus],
    [currentlySelectedArbovirus, tableDatasets]
  );

  return (
    <div className="p-2">
      <div className="flex justify-between mb-2 ignore-for-visualization-download">
        <h2 className="text-center">
          {convertArboSFtoArbo(currentlySelectedArbovirus)}
        </h2>
        <div className="space-x-2 justify-between">
          <Button
            variant="outline"
            size="sm"
            className="text-white"
            onClick={() => setCurrentIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-white"
            onClick={() => setCurrentIndex(currentIndex + 1)}
            disabled={currentIndex === pathogenOrder.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
      <Table className="border-separate border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead className="border-l border-b border-t bg-white whitespace-nowrap" />
            {Object.values(AgeGroup).map((ageGroup) => (
              <TableHead className="border bg-white whitespace-nowrap" key={`median-seroprevalence-by-who-region-and-age-group-table-${ageGroup}-header`}>
                {ageGroup}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(WHORegion).map((whoRegion) => (
            <TableRow key={`median-seroprevalence-by-who-region-and-age-group-table-${whoRegion}-row`}>
              <TableCell className="border-l border-b bg-white group-hover:bg-zinc-100 whitespace-nowrap">
                {whoRegion}
              </TableCell>
              {Object.values(AgeGroup).map((ageGroup) => {
                const dataForCell =
                  !!datasetToDisplay && !!datasetToDisplay[whoRegion]
                    ? datasetToDisplay[whoRegion][ageGroup]
                    : [];

                const seroprevalenceNumber =
                  !!dataForCell && dataForCell.length > 0
                    ? parseFloat(
                        median(
                          (dataForCell ?? []).map(
                            (dataPoint) => dataPoint.seroprevalence * 100
                          )
                        ).toFixed(1)
                      )
                    : undefined;

                const seroprevalenceStringForCell =
                  seroprevalenceNumber !== undefined
                    ? `${seroprevalenceNumber}%`
                    : "N/A";

                const backgroundColourHexCode =
                  seroprevalenceNumber !== undefined
                    ? mixColours({
                        zeroValuedColourHexCode: "#f9f1f0",
                        oneValuedColourHexCode: "#f79489",
                        value: seroprevalenceNumber / 100,
                      })
                    : "#ffffff";

                return (
                  <TableCell
                    className="border-l border-r border-b bg-white group-hover:bg-zinc-100 whitespace-nowrap"
                    key={`median-seroprevalence-by-who-region-and-age-group-table-${whoRegion}-${ageGroup}-cell`}
                    style={{ backgroundColor: backgroundColourHexCode }}
                  >
                    {seroprevalenceStringForCell}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
