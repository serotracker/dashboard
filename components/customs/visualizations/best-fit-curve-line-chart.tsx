import uniq from 'lodash/uniq';

import { groupDataForRechartsOnce } from "./group-data-for-recharts/group-data-for-recharts-once";
import { LineChart } from "./line-chart";
import { useBestFitCurve } from "./line-fitting/use-best-fit-curve";
import { LegendConfiguration } from "./stacked-bar-chart";
import { generateRange } from '@/lib/utils';

interface BestFitCurveLineChartProps<
  TData extends Record<string, unknown>,
  TPrimaryGroupingKey extends string,
> {
  graphId: string;
  data: TData[];
  primaryGroupingFunction: (data: TData) => TPrimaryGroupingKey | TPrimaryGroupingKey[];
  primaryGroupingSortFunction?: (
    a: TPrimaryGroupingKey,
    b: TPrimaryGroupingKey
  ) => number;
  dataPointToXAxisValue: (input: { dataPoint: TData, primaryGroupingKey: TPrimaryGroupingKey }) => number;
  xAxisValueToLabel: (input: { xAxisValue: number }) => string;
  xAxisLabelSortingFunction?: (
    a: string,
    b: string
  ) => number;
  dataPointToYAxisValue: (input: { dataPoint: TData, primaryGroupingKey: TPrimaryGroupingKey }) => number;
  getLineColour: (input: { primaryGroupingKey: TPrimaryGroupingKey }) => string;
}

export const BestFitCurveLineChart = <
  TData extends Record<string, unknown>,
  TPrimaryGroupingKey extends string,
>(
  props: BestFitCurveLineChartProps<
    TData,
    TPrimaryGroupingKey
  >
) => {
  const { generateBestFitCurve } = useBestFitCurve();
  const {
    allPrimaryKeys,
    rechartsData,
  } = groupDataForRechartsOnce({
    data: props.data,
    primaryGroupingFunction: props.primaryGroupingFunction,
    primaryGroupingSortFunction: props.primaryGroupingSortFunction,
    transformOutputValue: (({ data }) => data)
  })

  const dataForBestFitLine = allPrimaryKeys.flatMap((primaryKey) => {
    const allXAxisAndYAxisValues = rechartsData[primaryKey].map((dataPoint) => ({
      xAxisValue: props.dataPointToXAxisValue({ dataPoint, primaryGroupingKey: primaryKey }),
      yAxisValue: props.dataPointToYAxisValue({ dataPoint, primaryGroupingKey: primaryKey })
    }));

    const { xAxisValueToYAxisValue } = generateBestFitCurve({
      data: allXAxisAndYAxisValues,
      maximumPolynomialOrder: 2
    });

    const allXAxisValuesForPrimaryKey = uniq(allXAxisAndYAxisValues.map(({xAxisValue}) => xAxisValue));
    const smallestXAxisValueForPrimaryKey = Math.min(...allXAxisValuesForPrimaryKey);
    const largestXAxisValueForPrimaryKey = Math.max(...allXAxisValuesForPrimaryKey);

    return generateRange({ startInclusive: smallestXAxisValueForPrimaryKey, endInclusive: largestXAxisValueForPrimaryKey, stepSize: 1})
      .map((xAxisValue) => {
        let yAxisValue = xAxisValueToYAxisValue({ xAxisValue });

        if(yAxisValue > 100) {
          return undefined;
        }
        if(yAxisValue < 0) {
          return undefined;
        }

        return {
          secondaryKeyForLineChart: primaryKey,
          xAxisValue: xAxisValue,
          yAxisValue: yAxisValue
        }
      })
      .filter(<T extends unknown>(element: T | undefined): element is T => !!element)
      .filter((element, index, array) => {
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
      .map((element) => ({
        ...element,
        xAxisLabel: props.xAxisValueToLabel({ xAxisValue: element.xAxisValue }),
        yAxisValue: parseFloat((element.yAxisValue).toFixed(1))
      }))
  })

  return (
    <LineChart
      graphId={props.graphId}
      data={dataForBestFitLine}
      primaryGroupingFunction={(dataPoint) => dataPoint.xAxisLabel}
      primaryGroupingSortFunction={props.xAxisLabelSortingFunction}
      secondaryGroupingFunction={(dataPoint) => dataPoint.secondaryKeyForLineChart}
      secondaryGroupingSortFunction={props.primaryGroupingSortFunction}
      transformOutputValue={({ data }) => data.at(0)?.yAxisValue ?? 0}
      getLineColour={(primaryGroupingKey) => props.getLineColour({ primaryGroupingKey })}
      legendConfiguration={LegendConfiguration.RIGHT_ALIGNED}
      percentageFormattingEnabled={true}
    />
  );
}