import { TimeInterval, doTimeIntervalsOverlap } from "./date-utils";
import { isAfter, isBefore, startOfYear, addYears, endOfYear, parseISO } from "date-fns";

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

export const groupDataPointsIntoTimeBuckets = <
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