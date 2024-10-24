import { useMemo, useCallback, useState } from 'react';
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
import { CustomXAxisTick, CustomXAxisTickProps } from './custom-x-axis-tick';
import { DoubleGroupingTransformOutputValueInput, groupDataForRechartsTwice } from './group-data-for-recharts/group-data-for-recharts-twice';
import { applyLabelsToGroupedRechartsData } from './group-data-for-recharts/apply-labels-to-grouped-recharts-data';
import { useBarColourAndLegendProps } from './use-bar-colour-and-legend-props';

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
    fontSize?: string;
    lineHeight?: number;
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
  const { xAxisTickSettings, primaryGroupingKeyToLabel, secondaryGroupingKeyToLabel } = props;

  const { getColourForSecondaryKey, legendProps } = useBarColourAndLegendProps({
    getColourForSecondaryKeyDefault: (secondaryKey, index) => props.getBarColour(secondaryKey),
    secondaryGroupingKeyToLabel,
    legendConfiguration: props.legendConfiguration
  });

  const { rechartsData, allSecondaryKeys } = groupDataForRechartsTwice({
    data: props.data,
    primaryGroupingFunction: props.primaryGroupingFunction,
    primaryGroupingSortFunction: props.primaryGroupingSortFunction,
    secondaryGroupingFunction: props.secondaryGroupingFunction,
    secondaryGroupingSortFunction: props.secondaryGroupingSortFunction,
    transformOutputValue: props.transformOutputValue,
  });

  let xAxisProps = {
    dataKey: "primaryKey",
    interval: 0,
    ...(xAxisTickSettings ? {
      tick: (tickProps: CustomXAxisTickProps) =>
        CustomXAxisTick({
          ...tickProps,
          tickSlant: xAxisTickSettings.slantValue,
          idealMaximumCharactersPerLine: xAxisTickSettings.idealMaximumCharactersPerLine,
          fontSize: xAxisTickSettings.fontSize,
          lineHeight: xAxisTickSettings.lineHeight,
        }),
    } : {})
  };

  const { rechartsDataUsingLabels } = useMemo(() => applyLabelsToGroupedRechartsData({
    rechartsData,
    primaryGroupingKeyToLabel,
    secondaryGroupingKeyToLabel
  }), [rechartsData, primaryGroupingKeyToLabel, secondaryGroupingKeyToLabel]);

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
        {allSecondaryKeys.map((secondaryKey, index) => (
          <Bar
            key={`${props.graphId}-${secondaryKey}-bar`}
            dataKey={props.secondaryGroupingKeyToLabel ? props.secondaryGroupingKeyToLabel(secondaryKey) : secondaryKey}
            stackId="a"
            fill={getColourForSecondaryKey(secondaryKey, index)}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
