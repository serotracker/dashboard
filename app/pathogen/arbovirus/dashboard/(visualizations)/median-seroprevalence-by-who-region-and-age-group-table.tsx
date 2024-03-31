import { useContext, useMemo, useState, useCallback } from "react";

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
import { mkConfig, generateCsv, download } from "export-to-csv";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

enum AgeGroup {
  "Adults (18-64 years)" = "Adults (18-64 years)",
  "Children and Youth (0-17 years)" = "Children and Youth (0-17 years)",
  "Seniors (65+ years)" = "Seniors (65+ years)",
  "Multiple groups" = "Multiple groups",
}

interface GetMedianSeroprevalenceInformationFromDataInput {
  data: any[];
}

interface GetMedianSeroprevalenceInformationFromDataOutput {
  seroprevalenceNumber: number | undefined;
  seroprevalencePercentageString: string;
  backgroundColourHexCode: string;
}

const getMedianSeroprevalenceInformationFromData = (
  input: GetMedianSeroprevalenceInformationFromDataInput
): GetMedianSeroprevalenceInformationFromDataOutput => {
  const seroprevalenceNumber =
    !!input.data && input.data.length > 0
      ? parseFloat(
          median(
            (input.data ?? []).map(
              (dataPoint) => dataPoint.seroprevalence * 100
            )
          ).toFixed(1)
        )
      : undefined;

  const seroprevalencePercentageString =
    seroprevalenceNumber !== undefined ? `${seroprevalenceNumber}%` : "N/A";

  const backgroundColourHexCode =
    seroprevalenceNumber !== undefined
      ? mixColours({
          zeroValuedColourHexCode: "#f9f1f0",
          oneValuedColourHexCode: "#f79489",
          value: seroprevalenceNumber / 100,
        })
      : "#ffffff";
  
  return {
    seroprevalenceNumber,
    seroprevalencePercentageString,
    backgroundColourHexCode
  }
};

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
  const [selectedArbovirus, setSelectedArbovirus] = useState<arbovirusesSF>(pathogenOrder[0]);

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
                    dataPoints.filter((dataPoint) =>
                      Object.values(AgeGroup).includes(dataPoint.ageGroup)
                    ),
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

  const datasetToDisplay = useMemo(
    () => tableDatasets[selectedArbovirus],
    [selectedArbovirus, tableDatasets]
  );

  const downloadCsv = useCallback(() => {
    const dataForCsv = typedObjectEntries(tableDatasets).flatMap(
      ([arbovirus, dataForArbovirus]) =>
        typedObjectEntries(dataForArbovirus).flatMap(
          ([whoRegion, dataForWhoRegion]) => ({
            Arbovirus: arbovirus,
            "WHO Region": whoRegion,
            ...Object.values(AgeGroup).map((ageGroup) => {
              const columnName = `Median Seroprevalence (${ageGroup})`
              const { seroprevalencePercentageString: columnValue } = getMedianSeroprevalenceInformationFromData({data: dataForWhoRegion[ageGroup]})
              return {[columnName]: columnValue}
            }).reduce((a, b) => ({...a, ...b}))
        })
    ));

    const csvConfig = mkConfig({
      useKeysAsHeaders: true,
      filename: "median-seroprevalence-by-who-region-and-age-group",
    });
    const csv = generateCsv(csvConfig)(dataForCsv);
    download(csvConfig)(csv);
  }, [tableDatasets]);

  return (
    <div className="p-2">
      <div className="flex justify-between mb-2 ignore-for-visualization-download">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="mx-2 whitespace-nowrap text-white ignore-for-visualization-download">
              Currently viewing: {convertArboSFtoArbo(selectedArbovirus)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-2">
            {pathogenOrder.map((pathogen) => 
              <DropdownMenuItem onSelect={() => setSelectedArbovirus(pathogen)} disabled={selectedArbovirus === pathogen} asChild>
                <button className="w-full hover:cursor-pointer">
                  {convertArboSFtoArbo(pathogen)}
                </button>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="space-x-2 justify-between">
          <Button
            variant="outline"
            size="sm"
            className="text-white"
            onClick={() => downloadCsv()}
          >
            Download CSV
          </Button>
        </div>
      </div>
      <Table className="border-separate border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead className="border-l border-b border-t bg-white whitespace-nowrap" />
            {Object.values(AgeGroup).map((ageGroup) => (
              <TableHead
                className="border bg-white whitespace-nowrap"
                key={`median-seroprevalence-by-who-region-and-age-group-table-${ageGroup}-header`}
              >
                {ageGroup}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(WHORegion).map((whoRegion) => (
            <TableRow
              key={`median-seroprevalence-by-who-region-and-age-group-table-${whoRegion}-row`}
            >
              <TableCell className="border-l border-b bg-white group-hover:bg-zinc-100 whitespace-nowrap">
                {whoRegion}
              </TableCell>
              {Object.values(AgeGroup).map((ageGroup) => {
                const dataForCell =
                  !!datasetToDisplay && !!datasetToDisplay[whoRegion]
                    ? datasetToDisplay[whoRegion][ageGroup]
                    : [];
                
                const {
                  seroprevalencePercentageString,
                  backgroundColourHexCode
                } = getMedianSeroprevalenceInformationFromData({data: dataForCell})

                return (
                  <TableCell
                    className="border-l border-r border-b bg-white group-hover:bg-zinc-100 whitespace-nowrap"
                    key={`median-seroprevalence-by-who-region-and-age-group-table-${whoRegion}-${ageGroup}-cell`}
                    style={{ backgroundColor: backgroundColourHexCode }}
                  >
                    {seroprevalencePercentageString}
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
