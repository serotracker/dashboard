import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Props as XAxisProps } from "recharts/types/cartesian/XAxis";
import { typedObjectKeys } from '@/lib/utils';
import { CustomXAxisTick } from './custom-x-axis-tick';
import { DoubleGroupingTransformOutputValueInput, groupDataForRechartsTwice } from './group-data-for-recharts/group-data-for-recharts-twice';

export enum LegendConfiguration {
  RIGHT_ALIGNED = 'RIGHT_ALIGNED',
  BOTTOM_ALIGNED = 'BOTTOM_ALIGNED'
}

interface StackedBarChartProps<
  TData,
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">
> {
  graphId: string;
  data: TData[];
  primaryGroupingFunction: (data: TData) => TPrimaryGroupingKey;
  primaryGroupingKeyToLabel?: (input: TPrimaryGroupingKey) => string;
  primaryGroupingSortFunction?: (
    a: TPrimaryGroupingKey,
    b: TPrimaryGroupingKey
  ) => number;
  secondaryGroupingFunction: (data: TData) => TSecondaryGroupingKey;
  secondaryGroupingKeyToLabel?: (input: TSecondaryGroupingKey) => string;
  secondaryGroupingSortFunction?: (
    a: TSecondaryGroupingKey,
    b: TSecondaryGroupingKey
  ) => number;
  transformOutputValue: (input: DoubleGroupingTransformOutputValueInput<
    TData,
    TSecondaryGroupingKey
  >) => number;
  getBarColour: (secondaryKey: TSecondaryGroupingKey) => string;
  xAxisTickSettings?: {
    slantValue?: number;
    idealMaximumCharactersPerLine?: number;
  };
  legendConfiguration: LegendConfiguration;
}

export const StackedBarChart = <
  TData,
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">
>(
  props: StackedBarChartProps<TData, TPrimaryGroupingKey, TSecondaryGroupingKey>
) => {
  const legendProps =
    props.legendConfiguration === LegendConfiguration.RIGHT_ALIGNED
      ? {
          layout: "vertical" as const,
          verticalAlign: "middle" as const,
          align: "right" as const,
          wrapperStyle: { right: -10 },
        }
      : {
          layout: "horizontal" as const,
          verticalAlign: "bottom" as const,
          align: "center" as const,
          wrapperStyle: {
            paddingTop: 10,
            bottom: 0,
          },
        };

  const { rechartsData, allSecondaryKeys } = groupDataForRechartsTwice({
    data: props.data,
    primaryGroupingFunction: props.primaryGroupingFunction,
    primaryGroupingSortFunction: props.primaryGroupingSortFunction,
    secondaryGroupingFunction: props.secondaryGroupingFunction,
    secondaryGroupingSortFunction: props.secondaryGroupingSortFunction,
    transformOutputValue: props.transformOutputValue,
  });

  let xAxisProps: XAxisProps = {
    dataKey: "primaryKey",
    interval: 0,
  };
  const { xAxisTickSettings, primaryGroupingKeyToLabel, secondaryGroupingKeyToLabel } = props;

  if (xAxisTickSettings) {
    xAxisProps = {
      ...xAxisProps,
      tick: (tickProps) =>
        CustomXAxisTick({
          ...tickProps,
          tickSlant: xAxisTickSettings.slantValue,
          idealMaximumCharactersPerLine: xAxisTickSettings.idealMaximumCharactersPerLine
        }),
    };
  }

  const rechartsDataUsingLabels: Array<
    Record<'primaryKey', string> & Record<string, number | undefined>
  > = useMemo(() => rechartsData.map((dataPoint) => (
    Object.fromEntries(typedObjectKeys(dataPoint).map((dataPointKey) => {
      if(dataPointKey === 'primaryKey') {
        return ['primaryKey', primaryGroupingKeyToLabel ? primaryGroupingKeyToLabel(dataPoint['primaryKey']) : dataPoint['primaryKey']]
      }

      return [secondaryGroupingKeyToLabel ? secondaryGroupingKeyToLabel(dataPointKey) : dataPointKey, dataPoint[dataPointKey]]
    }))
  )), [rechartsData, primaryGroupingKeyToLabel, secondaryGroupingKeyToLabel])

  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <BarChart
        width={730}
        height={250}
        data={rechartsDataUsingLabels}
        margin={{
          top: 0,
          right: 20,
          left: 40,
          bottom: 65,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis {...xAxisProps} />
        <YAxis />
        <Tooltip itemStyle={{ color: "black" }} />
        <Legend {...legendProps} />
        {allSecondaryKeys.map((secondaryKey) => (
          <Bar
            key={`${props.graphId}-${secondaryKey}-bar`}
            dataKey={props.secondaryGroupingKeyToLabel ? props.secondaryGroupingKeyToLabel(secondaryKey) : secondaryKey}
            stackId="a"
            fill={props.getBarColour(secondaryKey)}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
