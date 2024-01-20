"use client";

import { ArboContext } from "@/contexts/arbo-context";
import React, { useContext } from "react";
import { isAfter, isBefore, startOfYear, addYears, endOfYear, parseISO } from "date-fns";
import {
  typedGroupBy,
  typedObjectEntries,
  typedObjectFromEntries,
} from "@/lib/utils";
import { TimeInterval, doTimeIntervalsOverlap } from "@/lib/date-utils";
import clsx from "clsx";
import { SlantedTick, arbovirusesSF, convertArboSFtoArbo, median } from "../recharts";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { pathogenColors } from "../../dashboard/(map)/ArbovirusMap";

type GroupableIntoTimeBuckets = { groupingTimeInterval: TimeInterval };

interface GroupDataPointsIntoTimeBucketsInput<
  TDataPoint extends GroupableIntoTimeBuckets
> {
  dataPoints: TDataPoint[];
  groupingBucketSize: {
    years: number;
  };
}

interface GroupDataPointsIntoTimeBucketsOutput<
  TDataPoint extends GroupableIntoTimeBuckets
> {
  groupedDataPoints: {
    interval: TimeInterval;
    dataPoints: TDataPoint[];
  }[];
}

interface GenerateBucketsForTimeIntervalInput {
  earliestDate: Date;
  latestDate: Date;
  groupingBucketSize: {
    years: number;
  };
}

interface GenerateBucketsForTimeIntervalOutput {
  buckets: TimeInterval[];
}

const generateBucketsForTimeInterval = (input: GenerateBucketsForTimeIntervalInput): GenerateBucketsForTimeIntervalOutput => {
  let currentIntervalStartDate = startOfYear(input.earliestDate);
  const buckets: TimeInterval[] = [];
  
  while(isBefore(currentIntervalStartDate, input.latestDate)) {
    const currentIntervalEndDate = endOfYear(addYears(currentIntervalStartDate, input.groupingBucketSize.years));
    const bucketToAdd = {
      intervalStartDate: parseISO(currentIntervalStartDate.toISOString()),
      intervalEndDate: parseISO(currentIntervalEndDate.toISOString())
    }

    buckets.push(bucketToAdd);

    currentIntervalStartDate = startOfYear(addYears(currentIntervalEndDate, 1));
  }

  return {
    buckets
  }
}

const groupDataPointsIntoTimeBuckets = <
  TDataPoint extends GroupableIntoTimeBuckets
>(
  input: GroupDataPointsIntoTimeBucketsInput<TDataPoint>
): GroupDataPointsIntoTimeBucketsOutput<TDataPoint> => {
  const earliestDate = input.dataPoints
    .toSorted((a, b) => isBefore(a.groupingTimeInterval.intervalStartDate, b.groupingTimeInterval.intervalStartDate) ? -1 : 1)
    [0]?.groupingTimeInterval.intervalStartDate;

  const latestDate = input.dataPoints
    .toSorted((a, b) => isAfter(a.groupingTimeInterval.intervalEndDate, b.groupingTimeInterval.intervalEndDate) ? -1 : 1)
    [0]?.groupingTimeInterval.intervalEndDate;

  if (!earliestDate || !latestDate) {
    return {
      groupedDataPoints: [],
    };
  }

  const { buckets } = generateBucketsForTimeInterval({
    earliestDate,
    latestDate,
    groupingBucketSize: input.groupingBucketSize
  })

  let groupedDataPoints = buckets.map((bucket) => ({
    interval: bucket,
    dataPoints: input.dataPoints.filter((dataPoint) => doTimeIntervalsOverlap(bucket, dataPoint.groupingTimeInterval))
  })).filter((bucketAndDataPoints) => bucketAndDataPoints.dataPoints.length > 0)

  return {
    groupedDataPoints,
  };
};

export const ChangeInMedianSeroprevalenceOverTimeGraph = (): React.ReactNode => {
  const state = useContext(ArboContext);

  const dataGroupedByArbovirus = typedGroupBy(
    state.filteredData,
    (dataPoint) => dataPoint.pathogen
  );

  const dataGroupedByArbovirusThenByTimeBucket = typedObjectFromEntries(
    typedObjectEntries(dataGroupedByArbovirus).map(
      ([arbovirus, dataPointsForAParticularArbovirus]) => [
        arbovirus,
        groupDataPointsIntoTimeBuckets({
          dataPoints: dataPointsForAParticularArbovirus.map((dataPoint) => ({
            ...dataPoint,
            groupingTimeInterval: {
              intervalStartDate: parseISO(dataPoint.sampleStartDate),
              intervalEndDate: parseISO(dataPoint.sampleEndDate),
            },
          })),
          groupingBucketSize: {
            years: 5,
          },
        }).groupedDataPoints,
      ]
    )
  );

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-row flex-wrap">
        {Object.keys(dataGroupedByArbovirusThenByTimeBucket).map((arbovirus, index) => {
          const dataForArbovirus = dataGroupedByArbovirusThenByTimeBucket[arbovirus].map(({interval, dataPoints}) => ({
            intervalAsString: `${interval.intervalStartDate.getFullYear()}-${interval.intervalEndDate.getFullYear()}`,
            dataPoints,
            median: median(dataPoints.map((dataPoint) => dataPoint.seroprevalence * 100))
          }));

          const numberOfSubgraphsDisplayed = Object.keys(dataGroupedByArbovirus).length;

          const width = numberOfSubgraphsDisplayed < 3 ? "w-full" : "w-1/2";
          const height =
            numberOfSubgraphsDisplayed === 1
              ? "h-full"
              : numberOfSubgraphsDisplayed < 5
              ? "h-1/2"
              : "h-1/3";

          return (
            <div
              className={clsx(width, height)}
              key={`med-sero-prev-who-age-${arbovirus}`}
            >
              <h2 className="w-full text-center ">
                {convertArboSFtoArbo(arbovirus as arbovirusesSF)}
              </h2>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  margin={{
                    top: 10,
                    right: 10,
                    left: index % 2 === 0 ? 0 : 40,
                    bottom: 40,
                  }}
                  data={dataForArbovirus}
                  width={500}
                  height={450}
                  barCategoryGap={1}
                  barGap={0}
                >
                  <CartesianGrid />
                  <XAxis
                    dataKey="intervalAsString"
                    interval={0}
                    tick={<SlantedTick />}
                  />
                  <YAxis
                    domain={[0, 100]}
                    hide={index % 2 != 0}
                    tickFormatter={(tick) => `${tick}%`}
                  />
                  <Bar dataKey="median" fill={pathogenColors[arbovirus]}/>
                  <Tooltip itemStyle={{"color": "black"}} formatter={(value) => `${(value as number).toFixed(2)}%`}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
};
