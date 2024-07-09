import { useMemo } from "react";
import { typedGroupBy, typedObjectEntries, typedObjectFromEntries, typedObjectKeys } from "@/lib/utils";
import { groupDataPointsIntoTimeBuckets } from "@/lib/time-bucket-grouping";
import { useIsLargeScreen } from "@/hooks/useIsLargeScreen";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import clsx from "clsx";
import { CustomXAxisTick } from "./custom-x-axis-tick";

export interface SplitTimeBucketedBarChartProps<
  TData,
  TPrimaryGroupingKey extends string,
> {
  graphId: string;
  data: TData[];
  primaryGroupingFunction: (dataPoint: TData) => TPrimaryGroupingKey;
  bucketingConfiguration: {
    desiredBucketCount: number;
    validBucketSizes: Array<{
      years: number;
    }>;
  }
  getIntervalStartDate: (dataPoint: TData) => Date;
  getIntervalEndDate: (dataPoint: TData) => Date;
  getBarColour: (primaryKey: TPrimaryGroupingKey) => string;
  getBarName: (primaryKey: TPrimaryGroupingKey) => string;
  percentageFormattingEnabled: boolean;
  transformOutputValue: (data: TData[]) => number;
}

export const SplitTimeBucketedBarChart = <
  TData,
  TPrimaryGroupingKey extends string,
>(props: SplitTimeBucketedBarChartProps<TData, TPrimaryGroupingKey>) => {
  const { data, primaryGroupingFunction, getIntervalStartDate, getIntervalEndDate, percentageFormattingEnabled } = props;
  const { desiredBucketCount, validBucketSizes } = props.bucketingConfiguration;

  const eventsGroupedByPrimaryKey = useMemo(() => {
    return typedGroupBy(data, primaryGroupingFunction)
  }, [data, primaryGroupingFunction]);

  const eventsGroupedByPrimaryKeyAndThenTimeBucket = useMemo(() => typedObjectFromEntries(
    typedObjectEntries(eventsGroupedByPrimaryKey).map(
      ([primaryKey, dataPointsForPrimaryKey]) => [
        primaryKey,
        groupDataPointsIntoTimeBuckets({
          dataPoints: dataPointsForPrimaryKey
            .map((dataPoint) => ({
              ...dataPoint,
              groupingTimeInterval: {
                intervalStartDate: getIntervalStartDate(dataPoint),
                intervalEndDate: getIntervalEndDate(dataPoint),
              },
            })),
            desiredBucketCount,
            validBucketSizes
        }).groupedDataPoints,
      ]
    )
  ), [ eventsGroupedByPrimaryKey, desiredBucketCount, validBucketSizes, getIntervalStartDate, getIntervalEndDate ])

  const yAxisProps = useMemo(() => percentageFormattingEnabled ? {
    domain: [0, 100],
    tickFormatter:(tick: string) => `${tick}%`
  } : {}, [ percentageFormattingEnabled ])

  const tooltipProps = useMemo(() => percentageFormattingEnabled ? {
    itemStyle: {color: "black"},
    formatter: (value: number) => `${value.toFixed(2)}%`
  } : {
    itemStyle: {color: "black"}
  }, [ percentageFormattingEnabled ])

  const isLargeScreen = useIsLargeScreen();

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-row flex-wrap">
        {typedObjectKeys(eventsGroupedByPrimaryKeyAndThenTimeBucket).map((primaryKey, index) => {
          const dataForType = eventsGroupedByPrimaryKeyAndThenTimeBucket[primaryKey].map(({interval, dataPoints}) => ({
            intervalAsString: interval.intervalStartDate.getFullYear() !== interval.intervalEndDate.getFullYear() ?
              `${interval.intervalStartDate.getFullYear()}-${interval.intervalEndDate.getFullYear()}` :
              `${interval.intervalStartDate.getFullYear()}`,
            dataPoints,
            valueForBar: props.transformOutputValue(dataPoints)
          }));

          const numberOfSubgraphsDisplayed = Object.keys(eventsGroupedByPrimaryKeyAndThenTimeBucket).length;

          const width = numberOfSubgraphsDisplayed < 3 ? "w-full" : "w-1/2 lg:w-1/3";
          const height =
            numberOfSubgraphsDisplayed === 1
              ? "h-full"
              : "h-1/3 lg:h-1/2"
            

          return (
            <div
              className={clsx(width, height)}
              key={`${props.graphId}-${primaryKey}`}
            >
              <p className="w-full text-center ">
                {primaryKey}
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
                  <YAxis {...yAxisProps}/>
                  <Bar
                    dataKey="valueForBar"
                    fill={props.getBarColour(primaryKey)}
                    name={props.getBarName(primaryKey)}
                  />
                  <Tooltip {...tooltipProps} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}