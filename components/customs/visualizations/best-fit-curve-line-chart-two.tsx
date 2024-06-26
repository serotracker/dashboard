import uniq from 'lodash/uniq';
import { useBestFitCurve } from "./line-fitting/use-best-fit-curve";
import { LegendConfiguration } from "./stacked-bar-chart";
import { generateRange, typedGroupBy } from '@/lib/utils';
import { groupDataForRechartsOnce } from './group-data-for-recharts/group-data-for-recharts-once';
import { LineChartTwo } from './line-chart-two';

interface BestFitLineSettings {
  maximumPolynomialOrder: number;
  yAxisDomain: {
    maximumValue: number;
    minimumValue: number;
  }
  xAxisTicks: number[];
  allowStrictlyIncreasingLinesOnly: boolean;
}

interface BestFitCurveLineChartTwoProps<
  TData extends Record<'xAxisValue', number> & Record<'yAxisValue', number>,
  TPrimaryGroupingKey extends string,
> {
  graphId: string;
  data: TData[];
  primaryGroupingFunction: (data: TData) => TPrimaryGroupingKey | TPrimaryGroupingKey[];
  primaryGroupingSortFunction?: (
    a: TPrimaryGroupingKey,
    b: TPrimaryGroupingKey
  ) => number;
  primaryGroupingKeyToLabel?: (input: TPrimaryGroupingKey) => string;
  getLineColour: (secondaryKey: TPrimaryGroupingKey, index: number) => string;
  xAxisTickSettings?: {
    interval?: number;
    ticks?: number[];
  };
  yAxisTickSettings: {
    percentageFormattingEnabled?: boolean;
  }
  bestFitLineSettings: BestFitLineSettings;
  legendConfiguration: LegendConfiguration;
}

export const BestFitCurveLineChartTwo = <
  TData extends Record<'xAxisValue', number> & Record<'yAxisValue', number>,
  TPrimaryGroupingKey extends string,
>(
  props: BestFitCurveLineChartTwoProps<
    TData,
    TPrimaryGroupingKey
  >
) => {
  const { generateBestFitCurve } = useBestFitCurve();

  const { xAxisValueToYAxisValue } = generateBestFitCurve({
    data: props.data,
    maximumPolynomialOrder: props.bestFitLineSettings.maximumPolynomialOrder
  });

  const { rechartsData: dataGroupedByPrimaryKey, allPrimaryKeys } = groupDataForRechartsOnce({
    data: props.data,
    primaryGroupingFunction: props.primaryGroupingFunction,
    primaryGroupingSortFunction: props.primaryGroupingSortFunction,
    transformOutputValue: (({ data }) => data)
  })

  const lineData = allPrimaryKeys.flatMap((primaryKey) => {
    const dataForPrimaryKey = dataGroupedByPrimaryKey[primaryKey];

    const allXAxisValues = uniq(dataForPrimaryKey.map(({ xAxisValue }) => xAxisValue));
    const smallestXAxisValue = Math.min(...allXAxisValues);
    const largestXAxisValue = Math.max(...allXAxisValues);

    return props.bestFitLineSettings.xAxisTicks
      .filter((xAxisValue) => xAxisValue >= smallestXAxisValue && xAxisValue <= largestXAxisValue)
      .map((xAxisValue) => ({
        xAxisValue,
        yAxisValue: xAxisValueToYAxisValue({ xAxisValue }),
        primaryKey
      }))
  })

  console.log('lineData', lineData)
  console.log('scatterPointData', props.data)

  return (
    <LineChartTwo 
      graphId={props.graphId}
      data={lineData}
      scatterPointData={props.data}
      primaryGroupingFunction={(dataPoint) => dataPoint.primaryKey}
      scatterPointPrimaryGroupingFunction={props.primaryGroupingFunction}
      primaryGroupingSortFunction={props.primaryGroupingSortFunction}
      getLineColour={props.getLineColour}
      yAxisTickSettings={props.yAxisTickSettings}
      legendConfiguration={props.legendConfiguration}
    />
  )
}