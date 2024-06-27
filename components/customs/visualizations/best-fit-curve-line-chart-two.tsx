import uniq from 'lodash/uniq';
import { useBestFitCurve } from "./line-fitting/use-best-fit-curve";
import { LegendConfiguration } from "./stacked-bar-chart";
import { generateRange, typedGroupBy } from '@/lib/utils';
import { groupDataForRechartsOnce } from './group-data-for-recharts/group-data-for-recharts-once';
import { NumericLineChart } from './numeric-line-chart';

interface BestFitLineSettings {
  maximumPolynomialOrder: number;
  yAxisDomain: {
    maximumValue: number;
    minimumValue: number;
  }
  xAxisTicks: number[];
  allowStrictlyIncreasingLinesOnly: boolean;
}

interface NumericBestFitCurveLineChartProps<
  TData extends Record<'xAxisValue', number> & Record<'yAxisValue', number>,
  TPrimaryGroupingKey extends string,
> {
  graphId: string;
  data: TData[];
  scatterPointsVisible: boolean;
  primaryGroupingFunction: (data: TData) => TPrimaryGroupingKey | TPrimaryGroupingKey[];
  primaryGroupingSortFunction?: (
    a: TPrimaryGroupingKey,
    b: TPrimaryGroupingKey
  ) => number;
  primaryGroupingKeyToLabel?: (input: TPrimaryGroupingKey) => string;
  getLineColour: (secondaryKey: TPrimaryGroupingKey, index: number) => string;
  xAxisTickSettings?: {
    domain?: [number, number];
    tickFormatter: (value: number) => string;
    interval?: number;
    tickCount?: number;
    ticks?: number[];
  };
  yAxisTickSettings: {
    percentageFormattingEnabled?: boolean;
  }
  bestFitLineSettings: BestFitLineSettings;
  legendConfiguration: LegendConfiguration;
}

export const NumericBestFitCurveLineChart = <
  TData extends Record<'xAxisValue', number> & Record<'yAxisValue', number>,
  TPrimaryGroupingKey extends string,
>(
  props: NumericBestFitCurveLineChartProps<
    TData,
    TPrimaryGroupingKey
  >
) => {
  const { generateBestFitCurve } = useBestFitCurve();

  const { rechartsData: dataGroupedByPrimaryKey, allPrimaryKeys } = groupDataForRechartsOnce({
    data: props.data,
    primaryGroupingFunction: props.primaryGroupingFunction,
    primaryGroupingSortFunction: props.primaryGroupingSortFunction,
    transformOutputValue: (({ data }) => data)
  })

  const lineData = allPrimaryKeys
    .map((primaryKey) => {
      const dataForPrimaryKey = dataGroupedByPrimaryKey[primaryKey];

      const { xAxisValueToYAxisValue } = generateBestFitCurve({
        data: dataForPrimaryKey,
        maximumPolynomialOrder: props.bestFitLineSettings.maximumPolynomialOrder
      });

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
    .flatMap((dataForPrimaryKey) => dataForPrimaryKey
      .sort((elementA, elementB) => elementA.xAxisValue - elementB.xAxisValue)
      .filter((element) =>
        element.yAxisValue <= props.bestFitLineSettings.yAxisDomain.maximumValue &&
        element.yAxisValue >= props.bestFitLineSettings.yAxisDomain.minimumValue
      )
      .filter((element, index, array) => {
        if(!props.bestFitLineSettings.allowStrictlyIncreasingLinesOnly) {
          return true;
        }

        if(index === 0 && array.length === 1) {
          return true;
        }
        if(index === 0 && array.length > 1) {
          const secondElement = array[1];

          return element.yAxisValue <= secondElement.yAxisValue;
        }

        const previousElement = array[index - 1]

        return element.yAxisValue >= previousElement.yAxisValue;
      })
    );

  return (
    <NumericLineChart 
      graphId={props.graphId}
      data={lineData}
      scatterPointData={props.data}
      primaryGroupingFunction={(dataPoint) => dataPoint.primaryKey}
      scatterPointPrimaryGroupingFunction={props.primaryGroupingFunction}
      primaryGroupingSortFunction={props.primaryGroupingSortFunction}
      getLineColour={props.getLineColour}
      xAxisTickSettings={props.xAxisTickSettings}
      scatterPointsVisible={props.scatterPointsVisible}
      yAxisTickSettings={props.yAxisTickSettings}
      legendConfiguration={props.legendConfiguration}
    />
  )
}