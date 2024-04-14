import { useContext, useMemo, useState, useCallback } from "react";
import uniq from "lodash/uniq";

import { ArboContext } from "@/contexts/arbo-context/arbo-context";
import {
  mixColours,
  typedGroupBy,
  typedObjectEntries,
  typedObjectFromEntries,
  typedObjectKeys,
  cn
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
import { useChartArbovirusDropdown } from "./chart-arbovirus-dropdown";

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
    backgroundColourHexCode,
  };
};

export const MedianSeroprevalenceByWhoRegionAndAgeGroupTable = () => {
  const state = useContext(ArboContext);

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
              typedObjectEntries(dataGroupedByWHORegion)
                .filter(([whoRegion, dataPoints]) =>
                  Object.values(WHORegion).includes(whoRegion)
                )
                .map(([whoRegion, dataPoints]) => [
                  whoRegion,
                  typedGroupBy(
                    dataPoints.filter((dataPoint) =>
                      Object.values(AgeGroup).includes(dataPoint.ageGroup)
                    ),
                    (dataPoint) => dataPoint.ageGroup as AgeGroup
                  ),
                ])
            ),
          ]
        )
      ),
    [datasetGroupedByArbovirusAndWhoRegion]
  );

  const { chartArbovirusDropdown, selectedArbovirus } = useChartArbovirusDropdown({
    possibleArboviruses: typedObjectKeys(tableDatasets)
  });

  const datasetToDisplay = useMemo(
    () => selectedArbovirus !== 'N/A' ? tableDatasets[selectedArbovirus] : {} as Record<WHORegion, Record<AgeGroup, any[]>>,
    [selectedArbovirus, tableDatasets]
  );

  const ageGroupToSortOrderMap: {[key in AgeGroup]: number } = {
    [AgeGroup["Children and Youth (0-17 years)"]]: 1,
    [AgeGroup["Adults (18-64 years)"]]: 2,
    [AgeGroup["Seniors (65+ years)"]]: 3,
    [AgeGroup["Multiple groups"]]: 4
  }

  const allIncludedAgeGroupsInDatasetToDisplay = useMemo(() => 
    uniq(typedObjectEntries(datasetToDisplay ?? {}).flatMap(([whoRegion, dataForWhoRegion]) => typedObjectKeys(dataForWhoRegion)))
  , [datasetToDisplay])

  const downloadCsv = useCallback(() => {
    const allIncludedAgeGroups = uniq(typedObjectEntries(tableDatasets ?? {}).flatMap(([arbovirus, dataForArbovirus]) =>
      typedObjectEntries(dataForArbovirus).flatMap(([whoRegion, dataForWhoRegion]) => typedObjectKeys(dataForWhoRegion))
    ))

    const dataForCsv = typedObjectEntries(tableDatasets ?? {}).flatMap(
      ([arbovirus, dataForArbovirus]) =>
        typedObjectEntries(dataForArbovirus).flatMap(
          ([whoRegion, dataForWhoRegion]) => ({
            Arbovirus: arbovirus,
            "WHO Region": whoRegion,
            ...allIncludedAgeGroups
              .sort((a,b) => ageGroupToSortOrderMap[a] - ageGroupToSortOrderMap[b])
              .map((ageGroup) => {
                const columnName = `Median Seroprevalence (${ageGroup})`;
                const { seroprevalencePercentageString: columnValue } =
                  getMedianSeroprevalenceInformationFromData({
                    data: dataForWhoRegion[ageGroup],
                  });
                return { [columnName]: columnValue };
              })
              .reduce((a, b) => ({ ...a, ...b })),
          })
        )
    );

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
        {chartArbovirusDropdown}
        <div className="space-x-2 justify-between">
          <Button
            variant="outline"
            size="sm"
            className={cn("text-white", typedObjectKeys(tableDatasets ?? {}).length === 0 ? 'hidden' : '')}
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
            {(allIncludedAgeGroupsInDatasetToDisplay ?? [])
              .sort((a,b) => ageGroupToSortOrderMap[a] - ageGroupToSortOrderMap[b])
              .map((ageGroup) => (
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
          {typedObjectKeys(datasetToDisplay ?? {})
            .sort()
            .map((whoRegion) => (
            <TableRow
              key={`median-seroprevalence-by-who-region-and-age-group-table-${whoRegion}-row`}
            >
              <TableCell className="border-l border-b bg-white group-hover:bg-zinc-100 whitespace-nowrap">
                {whoRegion}
              </TableCell>
              {(allIncludedAgeGroupsInDatasetToDisplay ?? [])
                .sort((a,b) => ageGroupToSortOrderMap[a] - ageGroupToSortOrderMap[b])
                .map((ageGroup) => {
                  const dataForCell =
                    !!datasetToDisplay && !!datasetToDisplay[whoRegion]
                      ? datasetToDisplay[whoRegion][ageGroup]
                      : [];

                  const {
                    seroprevalencePercentageString,
                    backgroundColourHexCode,
                  } = getMedianSeroprevalenceInformationFromData({
                    data: dataForCell,
                  });

                  return (
                    <TableCell
                      className="border-l border-r border-b bg-white group-hover:bg-zinc-100 whitespace-nowrap"
                      key={`median-seroprevalence-by-who-region-and-age-group-table-${whoRegion}-${ageGroup}-cell`}
                      style={{ backgroundColor: backgroundColourHexCode }}
                    >
                      {seroprevalencePercentageString}
                    </TableCell>
                  );
                }
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
