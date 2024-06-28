import {
  BarChart,
  Bar,
  XAxis,
  XAxisProps,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  Label,
} from "recharts";
import { DoubleGroupingTransformOutputValueInput, groupDataForRechartsTwice } from "./group-data-for-recharts/group-data-for-recharts-twice";
import { useMemo } from "react";
import { applyLabelsToGroupedRechartsData } from "./group-data-for-recharts/apply-labels-to-grouped-recharts-data";

interface AreaChartProps<
  TData,
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">
> {
  graphId: string;
  data: TData[];
  primaryGroupingFunction: (data: TData) => TPrimaryGroupingKey | TPrimaryGroupingKey[];
  primaryGroupingSortFunction?: (
    a: TPrimaryGroupingKey,
    b: TPrimaryGroupingKey
  ) => number;
  primaryGroupingKeyToLabel?: (input: TPrimaryGroupingKey) => string;
  allPrimaryGroups?: TPrimaryGroupingKey[];
  secondaryGroupingFunction: (data: TData) => TSecondaryGroupingKey | TSecondaryGroupingKey[];
  secondaryGroupingSortFunction?: (
    a: TSecondaryGroupingKey,
    b: TSecondaryGroupingKey
  ) => number;
  secondaryGroupingKeyToLabel?: (input: TSecondaryGroupingKey) => string;
  transformOutputValue: (input: DoubleGroupingTransformOutputValueInput<
    TData,
    TSecondaryGroupingKey
  >) => number;
  getBarColour: (secondaryKey: TSecondaryGroupingKey) => string;
  xAxisTickSettings?: {
    interval?: number;
  };
}

export const AreaChart = <
  TData,
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">
>(
  props: AreaChartProps<TData, TPrimaryGroupingKey, TSecondaryGroupingKey>
) => {
  const { primaryGroupingKeyToLabel, secondaryGroupingKeyToLabel, primaryGroupingSortFunction } = props;
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
    interval: props.xAxisTickSettings?.interval !== undefined ? props.xAxisTickSettings.interval : undefined,
    ...(props.allPrimaryGroups ? {
      ticks: primaryGroupingSortFunction
        ? props.allPrimaryGroups.sort((primaryGroupA, primaryGroupB) => primaryGroupingSortFunction(primaryGroupA, primaryGroupB))
        : props.allPrimaryGroups
    } : {})
  };

  const { rechartsDataUsingLabels } = useMemo(() => applyLabelsToGroupedRechartsData({
    rechartsData,
    primaryGroupingKeyToLabel,
    secondaryGroupingKeyToLabel
  }), [rechartsData, primaryGroupingKeyToLabel, secondaryGroupingKeyToLabel]);

  return (
    <ResponsiveContainer width={"100%"}>
      <RechartsAreaChart
        margin={{
          top: 0,
          right: 30,
          left: 0,
          bottom: 0,
        }}
        width={730}
        height={500}
        data={rechartsDataUsingLabels}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis {...xAxisProps} />
        <YAxis />
        <Tooltip itemStyle={{"color": "black"}} />
        <Legend />
        {allSecondaryKeys.map((secondaryKey) => (
          <Area
            key={secondaryKey}
            type="monotone"
            dataKey={props.secondaryGroupingKeyToLabel ? props.secondaryGroupingKeyToLabel(secondaryKey) : secondaryKey}
            stackId="1"
            stroke={props.getBarColour(secondaryKey)}
            fill={props.getBarColour(secondaryKey)}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}