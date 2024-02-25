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

interface ValidBucketSizes {
  years: number
}

interface GroupDataPointsIntoTimeBucketsInput<
  TDataPoint extends GroupableIntoTimeBuckets
> {
  dataPoints: TDataPoint[];
  desiredBucketCount: number;
  validBucketSizes: ValidBucketSizes[];
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

  if(input.groupingBucketSize.years === 0) {
    throw new Error("Unable to group data points with a bucket size of zero years.")
  }

  while(isBefore(currentIntervalStartDate, input.latestDate)) {
    const currentIntervalEndDate = endOfYear(addYears(currentIntervalStartDate, input.groupingBucketSize.years - 1));
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

  if(input.validBucketSizes.length === 0) {
    return { groupedDataPoints: [] };
  }

  const { groupedDataPoints } = input.validBucketSizes.map((bucketSize) => {
    const { buckets } = generateBucketsForTimeInterval({
      earliestDate,
      latestDate,
      groupingBucketSize: bucketSize
    })

    const groupedDataPoints = buckets.map((bucket) => ({
      interval: bucket,
      dataPoints: input.dataPoints.filter((dataPoint) => doTimeIntervalsOverlap(bucket, dataPoint.groupingTimeInterval))
    })).filter((bucketAndDataPoints) => bucketAndDataPoints.dataPoints.length > 0)

    return {
      groupedDataPoints,
      bucketSize,
      differenceFromDesiredBucketCount: Math.abs(groupedDataPoints.length - input.desiredBucketCount),
    }
  }).sort((a, b) => {
    if(a.differenceFromDesiredBucketCount - b.differenceFromDesiredBucketCount !== 0) {
      return a.differenceFromDesiredBucketCount - b.differenceFromDesiredBucketCount
    }

    return a.bucketSize.years - b.bucketSize.years;
  })[0];

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
          dataPoints: dataPointsForAParticularArbovirus
            .filter((dataPoint) => dataPoint.sampleStartDate && dataPoint.sampleEndDate)
            .map((dataPoint) => ({
              ...dataPoint,
              groupingTimeInterval: {
                intervalStartDate: parseISO(dataPoint.sampleStartDate),
                intervalEndDate: parseISO(dataPoint.sampleEndDate),
              },
            })),
            desiredBucketCount: 10,
            validBucketSizes: [
              {years: 5},
              {years: 4},
              {years: 3},
              {years: 2},
              {years: 1}
            ]
        }).groupedDataPoints,
      ]
    )
  );

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-row flex-wrap">
        {Object.keys(dataGroupedByArbovirusThenByTimeBucket).map((arbovirus, index) => {
          const dataForArbovirus = dataGroupedByArbovirusThenByTimeBucket[arbovirus].map(({interval, dataPoints}) => ({
            intervalAsString: interval.intervalStartDate.getFullYear() !== interval.intervalEndDate.getFullYear() ?
              `${interval.intervalStartDate.getFullYear()}-${interval.intervalEndDate.getFullYear()}` :
              `${interval.intervalStartDate.getFullYear()}`,
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
              key={`change-in-med-sero-prev-${arbovirus}`}
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
                    tick={(props) => SlantedTick({...props, tickSlant: 35 })}
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
