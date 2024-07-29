import { Button } from "@/components/ui/button";
import { cn, mixColours, typedGroupBy, typedObjectKeys } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WhoRegion } from "@/gql/graphql";
import uniq from "lodash/uniq";
import { groupDataForRechartsTwice } from "@/components/customs/visualizations/group-data-for-recharts/group-data-for-recharts-twice";
import sum from "lodash/sum";

export const EstimateSummaryByWhoRegion = () => {
  const zeroValuedColourHexCode = "#f9f1f0";
  const oneValuedColourHexCode = "#f79489";

  const brokenDownEstimates = [
    { sampleNumerator: 1, sampleDenominator: 10, whoRegion: WhoRegion.Afr, sex: 'Male' },
    { sampleNumerator: 100, sampleDenominator: 200, whoRegion: WhoRegion.Afr, sex: 'Male' },
    { sampleNumerator: 100, sampleDenominator: 200, whoRegion: WhoRegion.Afr, sex: 'Female' },
    { sampleNumerator: 100, sampleDenominator: 200, whoRegion: undefined, sex: 'Male' },
    { sampleNumerator: 100, sampleDenominator: 200, whoRegion: WhoRegion.Emr, sex: 'Female' },
    { sampleNumerator: 100, sampleDenominator: 200, whoRegion: WhoRegion.Emr, sex: undefined },
  ]
  const validGroups = ['All', ...uniq(brokenDownEstimates.map((estimate) => estimate.sex))
    .filter((group): group is NonNullable<typeof group> => !!group)
    .sort()
  ];

  const validWhoRegions = uniq(brokenDownEstimates.map((estimate) => estimate.whoRegion))
    .filter((group): group is NonNullable<typeof group> => !!group)
    .sort();

  const filteredData = brokenDownEstimates
    .filter((estimate): estimate is Omit<typeof estimate, 'whoRegion'|'sex'|'sampleNumerator'|'sampleDenominator'> & {
      whoRegion: NonNullable<typeof estimate['whoRegion']>,
      sex: NonNullable<typeof estimate['sex']>,
      sampleNumerator: NonNullable<typeof estimate['sampleNumerator']>,
      sampleDenominator: NonNullable<typeof estimate['sampleDenominator']>
    } => 
      estimate.whoRegion !== undefined && estimate.whoRegion !== null &&
      estimate.sex !== undefined && estimate.sex !== null &&
      estimate.sampleNumerator !== undefined && estimate.sampleNumerator !== null &&
      estimate.sampleDenominator !== undefined && estimate.sampleDenominator !== null
    )

  const {
    rechartsData: groupedBrokenDownEstimates,
  } = groupDataForRechartsTwice({
    data: filteredData,
    primaryGroupingFunction: (data) => data.whoRegion,
    secondaryGroupingFunction: (data) => data.sex,
    transformOutputValue: (data) => data
  })

  return (
    <div className="p-2">
      <div className="flex justify-between mb-2">
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
            className={cn("text-white", validGroups.length === 0 ? 'hidden' : '')}
            onClick={() => {}}
          >
            Download CSV
          </Button>
        </div>
      </div>
      <Table className="border-separate border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead className="border-l border-b border-t bg-white whitespace-nowrap" />
            {validGroups.map((group) => (
              <TableHead
                className="border bg-white whitespace-nowrap"
                key={`estimate-summary-by-who-region-table-${group}-header`}
              >
                {group}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {validWhoRegions
            .sort()
            .map((whoRegion) => (
            <TableRow
              key={`estimate-summary-by-who-region-table-${whoRegion}-row`}
            >
              <TableCell className="border-l border-b bg-white group-hover:bg-zinc-100 whitespace-nowrap">
                {whoRegion}
              </TableCell>
              {validGroups.map((group) => {
                const dataForRow = groupedBrokenDownEstimates
                  .find(({primaryKey}) => primaryKey === whoRegion);
                const dataForCell = dataForRow
                  ? group === 'All'
                    ? validGroups.filter((group) => group !== 'All').flatMap((group) => dataForRow[group]?.data ?? [])
                    : (dataForRow[group]?.data ?? [])
                  : [];

                const totalNumerator = sum(dataForCell.map((subestimate) => subestimate.sampleNumerator));
                const totalDenominator = sum(dataForCell.map((subestimate) => subestimate.sampleDenominator));
                const seroprevalencePercentageString = (totalDenominator !== 0)
                  ? `${((totalNumerator / totalDenominator) * 100).toFixed(1)}%`
                  : 'N/A'
                const backgroundColourHexCode = (totalDenominator !== 0)
                  ? mixColours({
                      zeroValuedColourHexCode,
                      oneValuedColourHexCode,
                      value: (totalNumerator / totalDenominator)
                    })
                  : "#ffffff";

                return (
                  <TableCell
                    className="border-l border-r border-b bg-white group-hover:bg-zinc-100 whitespace-nowrap"
                    key={`estimate-summary-by-who-region-table-${whoRegion}-${group}-cell`}
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
}