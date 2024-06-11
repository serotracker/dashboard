import uniq from 'lodash/uniq';

import { groupDataForRechartsOnce } from "./group-data-for-recharts/group-data-for-recharts-once";
import { LineChart } from "./line-chart";
import { useBestFitCurve } from "./line-fitting/use-best-fit-curve";
import { LegendConfiguration } from "./stacked-bar-chart";
import { generateRange } from '@/lib/utils';
import { LineWithScatterPointsChart } from './line-with-scatter-points-chart';

interface BestFitLineSettings {
  maximumPolynomialOrder: number;
  yAxisDomain: {
    maximumValue: number;
    minimumValue: number;
  }
  allowStrictlyIncreasingLinesOnly: boolean;
}

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
  primaryGroupingKeyToLabel?: (input: TPrimaryGroupingKey) => string;
  dataPointToXAxisValue: (input: { dataPoint: TData, primaryGroupingKey: TPrimaryGroupingKey }) => number;
  xAxisValueToLabel: (input: { xAxisValue: number }) => string;
  xAxisLabelSortingFunction?: (
    a: string,
    b: string
  ) => number;
  dataPointToYAxisValue: (input: { dataPoint: TData, primaryGroupingKey: TPrimaryGroupingKey }) => number | undefined;
  formatYAxisValue: (input: { yAxisValue: number}) => number;
  getLineColour: (input: { primaryGroupingKey: TPrimaryGroupingKey, index: number }) => string;
  bestFitLineSettings: BestFitLineSettings;
  percentageFormattingEnabled?: boolean;
  legendConfiguration: LegendConfiguration;
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
    const allXAxisAndYAxisValues = rechartsData[primaryKey]
      .map((dataPoint) => ({
        xAxisValue: props.dataPointToXAxisValue({ dataPoint, primaryGroupingKey: primaryKey }),
        yAxisValue: props.dataPointToYAxisValue({ dataPoint, primaryGroupingKey: primaryKey })
      }))
      .filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'yAxisValue'> & {
        yAxisValue: NonNullable<typeof dataPoint['yAxisValue']>
      } => dataPoint.yAxisValue !== undefined);

    const { xAxisValueToYAxisValue } = generateBestFitCurve({
      data: allXAxisAndYAxisValues,
      maximumPolynomialOrder: props.bestFitLineSettings.maximumPolynomialOrder
    });

    const allXAxisValuesForPrimaryKey = uniq(allXAxisAndYAxisValues.map(({ xAxisValue }) => xAxisValue));
    const smallestXAxisValueForPrimaryKey = Math.min(...allXAxisValuesForPrimaryKey);
    const largestXAxisValueForPrimaryKey = Math.max(...allXAxisValuesForPrimaryKey);

    return generateRange({
        startInclusive: smallestXAxisValueForPrimaryKey,
        endInclusive: largestXAxisValueForPrimaryKey,
        stepSize: 1
      })
      .map((xAxisValue) => {
        let yAxisValue = xAxisValueToYAxisValue({ xAxisValue });

        return {
          secondaryKeyForLineChart: primaryKey,
          xAxisValue: xAxisValue,
          yAxisValue: yAxisValue
        }
      })
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
      .map((element) => ({
        ...element,
        xAxisLabel: props.xAxisValueToLabel({ xAxisValue: element.xAxisValue }),
        yAxisValue: props.formatYAxisValue({ yAxisValue: element.yAxisValue })
      }))
  })

  /*
  return (
    <LineChart
      graphId={props.graphId}
      data={dataForBestFitLine}
      primaryGroupingFunction={(dataPoint) => dataPoint.xAxisLabel}
      primaryGroupingSortFunction={props.xAxisLabelSortingFunction}
      secondaryGroupingFunction={(dataPoint) => dataPoint.secondaryKeyForLineChart}
      secondaryGroupingSortFunction={props.primaryGroupingSortFunction}
      secondaryGroupingKeyToLabel={(primaryGroupingKey) => props.primaryGroupingKeyToLabel
        ? props.primaryGroupingKeyToLabel(primaryGroupingKey)
        : primaryGroupingKey
      }
      transformOutputValue={({ data }) => data.at(0)?.yAxisValue ?? 0}
      getLineColour={(primaryGroupingKey, index) => props.getLineColour({ primaryGroupingKey, index })}
      legendConfiguration={props.legendConfiguration}
      percentageFormattingEnabled={props.percentageFormattingEnabled}
    />
  );
  */

  return (
    <LineWithScatterPointsChart
      graphId={props.graphId}
      lineData={dataForBestFitLine}
      scatterPointsData={allPrimaryKeys.flatMap((primaryKey) => rechartsData[primaryKey]
        .map((dataPoint) => ({
          xAxisLabel: props.xAxisValueToLabel({
            xAxisValue: props.dataPointToXAxisValue({ dataPoint, primaryGroupingKey: primaryKey }),
          }),
          yAxisValue: props.dataPointToYAxisValue({ dataPoint, primaryGroupingKey: primaryKey }),
          secondaryKeyForLineChart: primaryKey
        }))
        .filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'yAxisValue'> & {
          yAxisValue: NonNullable<typeof dataPoint['yAxisValue']>
        } => dataPoint.yAxisValue !== undefined)
      )}
      primaryGroupingFunctionForLineData={(dataPoint) => dataPoint.xAxisLabel}
      primaryGroupingFunctionForScatterPointsData={(dataPoint) => dataPoint.xAxisLabel}
      primaryGroupingSortFunction={props.xAxisLabelSortingFunction}
      secondaryGroupingFunctionForLineData={(dataPoint) => dataPoint.secondaryKeyForLineChart}
      secondaryGroupingFunctionForScatterPointsData={(dataPoint) => dataPoint.secondaryKeyForLineChart}
      secondaryGroupingSortFunction={props.primaryGroupingSortFunction}
      secondaryGroupingKeyToLabel={(primaryGroupingKey) => props.primaryGroupingKeyToLabel
        ? props.primaryGroupingKeyToLabel(primaryGroupingKey)
        : primaryGroupingKey
      }
      transformOutputValueForLineData={({ data }) => data.at(0)?.yAxisValue ?? 0}
      transformOutputValueForScatterPointData={({ dataPoint }) => dataPoint.yAxisValue}
      getLineColour={(primaryGroupingKey, index) => props.getLineColour({ primaryGroupingKey, index })}
      getScatterPointsColour={(primaryGroupingKey, index) => props.getLineColour({ primaryGroupingKey, index })}
      legendConfiguration={props.legendConfiguration}
      percentageFormattingEnabled={props.percentageFormattingEnabled}
    />
  )
}