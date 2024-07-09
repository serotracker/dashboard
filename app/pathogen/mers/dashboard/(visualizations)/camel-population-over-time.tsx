import { CustomXAxisTick } from "@/components/customs/visualizations/custom-x-axis-tick";
import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { useIsLargeScreen } from "@/hooks/useIsLargeScreen";
import { groupDataPointsIntoTimeBuckets } from "@/lib/time-bucket-grouping";
import { typedGroupBy, typedObjectEntries, typedObjectFromEntries, typedObjectKeys } from "@/lib/utils";
import assertNever from "assert-never";
import clsx from "clsx";
import parseISO from "date-fns/parseISO";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface CamelPopulationOverTimeProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
}

const typenameToLabel = {
  ['YearlyFaoCamelPopulationDataEntry']: 'Camel Population',
}

const typenameToLineColour = {
  ['YearlyFaoCamelPopulationDataEntry']: '#d37295'
}

export const CamelPopulationOverTime = (props: CamelPopulationOverTimeProps) => {
  const consideredData = props.data.filter((
    element: MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry
  ): element is FaoYearlyCamelPopulationDataEntry => element.__typename === 'YearlyFaoCamelPopulationDataEntry')

  const dataGroupedByType = typedGroupBy(
    consideredData,
    (dataPoint) => dataPoint.__typename
  );

  const eventsGroupedByTypeAndThenTimeBucket = typedObjectFromEntries(
    typedObjectEntries(dataGroupedByType).map(
      ([type, eventsForType]) => [
        type,
        groupDataPointsIntoTimeBuckets({
          dataPoints: eventsForType
            .map((dataPoint) => ({
              ...dataPoint,
              groupingTimeInterval: {
                intervalStartDate: new Date(dataPoint.year, 3),
                intervalEndDate: new Date(dataPoint.year, 8)
              },
            })),
            desiredBucketCount: 10,
            validBucketSizes: [
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
        {typedObjectKeys(eventsGroupedByTypeAndThenTimeBucket).map((type, index) => {
          const dataForType = eventsGroupedByTypeAndThenTimeBucket[type].map(({interval, dataPoints}) => ({
            intervalAsString: interval.intervalStartDate.getFullYear() !== interval.intervalEndDate.getFullYear() ?
              `${interval.intervalStartDate.getFullYear()}-${interval.intervalEndDate.getFullYear()}` :
              `${interval.intervalStartDate.getFullYear()}`,
            dataPoints,
            sum: dataPoints.reduce((accumulator, dataPoint) => {
              return accumulator + dataPoint.camelCount;
            }, 0)
          }));

          const numberOfSubgraphsDisplayed = Object.keys(eventsGroupedByTypeAndThenTimeBucket).length;

          const width = numberOfSubgraphsDisplayed < 3 ? "w-full" : "w-1/2 lg:w-1/3";
          const height =
            numberOfSubgraphsDisplayed === 1
              ? "h-full"
              : "h-1/3 lg:h-1/2"
            

          return (
            <div
              className={clsx(width, height)}
              key={`camel-population-over-time-${type}`}
            >
              <p className="w-full text-center ">
                {typenameToLabel[type]}
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
                    hide={index % 2 != 0}
                  />
                  <Bar dataKey="sum" fill={typenameToLineColour[type]} name="Camel Population"/>
                  <Tooltip itemStyle={{"color": "black"}}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
};