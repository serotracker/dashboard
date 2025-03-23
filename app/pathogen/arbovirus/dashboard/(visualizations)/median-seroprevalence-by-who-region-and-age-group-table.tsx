import { useContext, useMemo, useCallback } from "react";
import uniq from "lodash/uniq";

import {
  mixColours,
  typedGroupBy,
  typedObjectEntries,
  typedObjectFromEntries,
  typedObjectKeys,
  cn
} from "@/lib/utils";
import { median } from "./recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { useChartArbovirusDropdown } from "./chart-arbovirus-dropdown";
import { ArboContext, ArbovirusEstimate } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { WhoRegion } from "@/gql/graphql";

enum AgeGroup {
  "Adults (18-64 years)" = "Adults (18-64 years)",
  "Children and Youth (0-17 years)" = "Children and Youth (0-17 years)",
  "Seniors (65+ years)" = "Seniors (65+ years)",
  "Multiple groups" = "Multiple groups",
}

interface GetMedianSeroprevalenceInformationFromDataInput {
  data: Array<Pick<ArbovirusEstimate,'seroprevalence'>>;
}

interface GetMedianSeroprevalenceInformationFromDataOutput {
  seroprevalenceNumber: number | undefined;
  seroprevalencePercentageString: string;
  backgroundColourHexCode: string;
}

const ageGroupToSortOrderMap: {[key in AgeGroup]: number } = {
  [AgeGroup["Children and Youth (0-17 years)"]]: 1,
  [AgeGroup["Adults (18-64 years)"]]: 2,
  [AgeGroup["Seniors (65+ years)"]]: 3,
  [AgeGroup["Multiple groups"]]: 4
};

const zeroValuedColourHexCode = "#f9f1f0";
const oneValuedColourHexCode = "#f79489";

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
          zeroValuedColourHexCode,
          oneValuedColourHexCode,
          value: seroprevalenceNumber / 100,
        })
      : "#ffffff";

  return {
    seroprevalenceNumber,
    seroprevalencePercentageString,
    backgroundColourHexCode,
  };
};

interface MedianSeroprevalenceByWhoRegionAndAgeGroupTableProps {
  data: ArbovirusEstimate[];
}

export const MedianSeroprevalenceByWhoRegionAndAgeGroupTable = (props: MedianSeroprevalenceByWhoRegionAndAgeGroupTableProps) => {
  const { data } = props;

  const datasetGroupedByArbovirus = useMemo(
    () => typedGroupBy( data, (dataPoint) => dataPoint.pathogen),
    [data]
  );

  const datasetGroupedByArbovirusAndWhoRegion = useMemo(
    () =>
      typedObjectFromEntries(
        typedObjectEntries(datasetGroupedByArbovirus).map(
          ([arbovirus, dataPoints]) => [
            arbovirus,
            typedGroupBy(
              dataPoints,
              (dataPoint) => dataPoint.whoRegion as WhoRegion
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
                .filter(([whoRegion]) =>
                  Object.values(WhoRegion).includes(whoRegion)
                )
                .map(([whoRegion, dataPoints]) => [
                  whoRegion,
                  typedGroupBy(
                    dataPoints
                      .flatMap((dataPoint) => dataPoint.ageGroup.map((ageGroup) => ({ ...dataPoint, ageGroup })))
                      .filter((dataPoint): dataPoint is Omit<typeof dataPoint,'ageGroup'> & {
                        ageGroup: AgeGroup;
                      } => Object.values(AgeGroup).some((element) => dataPoint.ageGroup === element)
                    ),
                    (dataPoint) => dataPoint.ageGroup
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
    () => selectedArbovirus !== 'N/A' ? tableDatasets[selectedArbovirus] : {} as Record<WhoRegion, Record<AgeGroup, any[]>>,
    [selectedArbovirus, tableDatasets]
  );

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
      <div className="flex justify-between mb-2">
        {chartArbovirusDropdown}
        <div className="grow flex justify-center"> 
          <p className="hidden lg:flex items-center"> Seroprevalence: </p>
          {[0, 0.25, 0.5, 0.75, 1].map((value) => (
            <div className="items-center inline-flex mx-2 my-1" key={value}>
              <div
                className={`w-[1em] h-[1em] border-2 border-gray-500 mr-2`}
                style={{ backgroundColor: mixColours({
                  zeroValuedColourHexCode,
                  oneValuedColourHexCode,
                  value
                })}}
              ></div>
              <p>{`${(value * 100).toFixed(0)}%`}</p>
            </div>
          ))}
        </div>
        <div className="space-x-2 justify-between ignore-for-visualization-download">
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
