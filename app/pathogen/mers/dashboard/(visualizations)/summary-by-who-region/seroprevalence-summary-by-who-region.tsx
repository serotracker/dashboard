
import { median } from "@/app/pathogen/arbovirus/dashboard/(visualizations)/recharts";
import { CustomXAxisTick } from "@/components/customs/visualizations/custom-x-axis-tick";
import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { WhoRegion } from "@/gql/graphql";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { useIsLargeScreen } from "@/hooks/useIsLargeScreen";
import { groupDataPointsIntoTimeBuckets } from "@/lib/time-bucket-grouping";
import { typedGroupBy, typedObjectEntries, typedObjectFromEntries, typedObjectKeys } from "@/lib/utils";
import clsx from "clsx";
import parseISO from "date-fns/parseISO";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface SeroprevalenceSummaryByWhoRegionProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
}

const barColoursForWhoRegions: Record<WhoRegion, string> = {
  [WhoRegion.Afr]: "#e15759",
  [WhoRegion.Amr]: "#59a14f",
  [WhoRegion.Emr]: "#f1ce63",
  [WhoRegion.Eur]: "#f28e2b",
  [WhoRegion.Sear]: "#d37295",
  [WhoRegion.Wpr]: "#4e79a7",
};

export const SeroprevalenceSummaryByWhoRegion = (props: SeroprevalenceSummaryByWhoRegionProps) => {
  const estimates = props.data.filter((dataPoint): dataPoint is MersEstimate => dataPoint.__typename === 'MersEstimate');

  const dataGroupedByWhoRegion = typedGroupBy(estimates
    .filter((estimate): estimate is Omit<typeof estimate, 'whoRegion'> & {whoRegion: NonNullable<typeof estimate['whoRegion']>} => !!estimate.whoRegion)
    .map((estimate) => ({
      ...estimate,
      //TODO remove these when we have real data
      samplingStartDate: '2024-07-09T00:28:53Z',
      samplingEndDate: '2024-07-09T00:28:53Z',
      seroprevalence: 0.1
    })),
    (event) => event.whoRegion
  );

  const eventsGroupedByWhoRegionAndThenTimeBucket = typedObjectFromEntries(
    typedObjectEntries(dataGroupedByWhoRegion).map(
      ([whoRegion, eventsForWhoRegion]) => [
        whoRegion,
        groupDataPointsIntoTimeBuckets({
          dataPoints: eventsForWhoRegion
            .map((dataPoint) => ({
              ...dataPoint,
              groupingTimeInterval: {
                intervalStartDate: parseISO(dataPoint.samplingStartDate),
                intervalEndDate: parseISO(dataPoint.samplingEndDate),
              },
            })),
            desiredBucketCount: 10,
            validBucketSizes: [
              { years: 5 },
              { years: 4 },
              { years: 3 },
              { years: 2 },
              { years: 1 }
            ]
        }).groupedDataPoints,
      ]
    )
  );
  
  const isLargeScreen = useIsLargeScreen();

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-row flex-wrap">
        {typedObjectKeys(eventsGroupedByWhoRegionAndThenTimeBucket).map((whoRegion, index) => {
          const dataForType = eventsGroupedByWhoRegionAndThenTimeBucket[whoRegion].map(({interval, dataPoints}) => ({
            intervalAsString: interval.intervalStartDate.getFullYear() !== interval.intervalEndDate.getFullYear() ?
              `${interval.intervalStartDate.getFullYear()}-${interval.intervalEndDate.getFullYear()}` :
              `${interval.intervalStartDate.getFullYear()}`,
            dataPoints,
            median: median(dataPoints.map((dataPoint) => dataPoint.seroprevalence * 100))
          }));

          const numberOfSubgraphsDisplayed = Object.keys(eventsGroupedByWhoRegionAndThenTimeBucket).length;

          const width = numberOfSubgraphsDisplayed < 3 ? "w-full" : "w-1/2 lg:w-1/3";
          const height =
            numberOfSubgraphsDisplayed === 1
              ? "h-full"
              : "h-1/3 lg:h-1/2"
            

          return (
            <div
              className={clsx(width, height)}
              key={`median-seroprevalence-over-time-by-who-region-${whoRegion}`}
            >
              <p className="w-full text-center ">
                {whoRegion}
              </p>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  margin={{
                    top: 10,
                    right: 10,
                    left: index % 2 === 0 ? 0 : 40,
                    bottom: 40,
                  }}
                  data={dataForType}
                  width={500}
                  height={450}
                  barCategoryGap={1}
                  barGap={0}
                >
                  <CartesianGrid />
                  <XAxis
                    dataKey="intervalAsString"
                    interval={0}
                    tick={(props) => CustomXAxisTick({...props, tickSlant: 35 })}
                    hide={!isLargeScreen}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(tick) => `${tick}%`}
                  />
                  <Bar dataKey="median" fill={barColoursForWhoRegions[whoRegion]} name="Median Seroprevalence"/>
                  <Tooltip itemStyle={{"color": "black"}} formatter={(value) => `${(value as number).toFixed(2)}%`}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}