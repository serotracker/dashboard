import { generateRange, mixColours } from "@/lib/utils";

interface GenerateMapColourBucketsInput<TData extends Record<string, unknown>> {
  idealBucketCount: number;
  smallestValuePaint: {
    fill: string;
    opacity: number;
  }
  largestValuePaint: {
    fill: string;
    opacity: number;
  }
  data: TData[];
  dataPointToValue: (dataPoint: TData) => number;
}

export interface ColourBucket<TData extends Record<string, unknown>> {
  fill: string;
  opacity: number;
  valueRange: {
    minimumInclusive: number | undefined,
    maximumExclusive: number | undefined,
  }
  dataPoints: TData[];
}

interface GenerateMapColourBucketsOutput<TData extends Record<string, unknown>> {
  mapColourBuckets: Array<ColourBucket<TData>>
}

export const generateMapColourBuckets = <
  TData extends Record<string, unknown>
>(input: GenerateMapColourBucketsInput<TData>): GenerateMapColourBucketsOutput<TData> => {
  const dataPointsWithValues = input.data
    .map((dataPoint) => ({ dataPoint, value: input.dataPointToValue(dataPoint) }))
  const allValues = dataPointsWithValues.map(({ value }) => value);
  const maximumValue = Math.max(...allValues);
  const minimumValue = Math.min(...allValues);

  const mapColourBuckets: ColourBucket<TData>[] = generateRange({
    startInclusive: minimumValue,
    endInclusive: maximumValue,
    stepSize: (maximumValue - minimumValue) / input.idealBucketCount
  }).slice(1).map((maximumExclusiveFromRange, index, array) => {
    const minimumInclusive = index === 0 ? undefined : array[index - 1];
    const maximumExclusive = index === (array.length - 1) ? undefined : maximumExclusiveFromRange;

    const valueOnZeroToOneScale = array.length > 1 ? (index / (array.length - 1)) : 0;
    const fill = mixColours({
      zeroValuedColourHexCode: input.smallestValuePaint.fill,
      oneValuedColourHexCode: input.largestValuePaint.fill,
      value: valueOnZeroToOneScale
    });
    const minimumOpacity = input.smallestValuePaint.opacity;
    const maximumOpacity = input.largestValuePaint.opacity;
    const opacity = ((maximumOpacity - minimumOpacity) * valueOnZeroToOneScale) + minimumOpacity;

    const dataPoints = dataPointsWithValues
      .filter(({ value }) => {
        const satisfiesMaximumConstraint = maximumExclusive === undefined || value < maximumExclusive;
        const satisfiesMinimumConstraint = minimumInclusive === undefined || value >= minimumInclusive;

        return satisfiesMaximumConstraint && satisfiesMinimumConstraint;
      })
      .map(({ dataPoint }) => dataPoint);

    return {
      fill,
      opacity,
      valueRange: {
        minimumInclusive,
        maximumExclusive,
      },
      dataPoints
    }
  });

  return {
    mapColourBuckets
  }
}