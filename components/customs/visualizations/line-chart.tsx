import { useMemo } from 'react';
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
  LineChart as RechartsLineChart,
  Area,
  Label,
  Line,
} from "recharts";
import { TransformOutputValueInput, groupDataForRecharts } from "./group-data-for-recharts";
import { LegendConfiguration } from "./stacked-bar-chart";
import { typedObjectEntries, typedObjectFromEntries } from '@/lib/utils';

interface LineChartProps<
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
  secondaryGroupingFunction: (data: TData) => TSecondaryGroupingKey | TSecondaryGroupingKey[];
  secondaryGroupingSortFunction?: (
    a: TSecondaryGroupingKey,
    b: TSecondaryGroupingKey
  ) => number;
  secondaryGroupingKeyToLabel?: (input: TSecondaryGroupingKey) => string;
  transformOutputValue: (input: TransformOutputValueInput<
    TData,
    TSecondaryGroupingKey
  >) => number;
  getLineColour: (secondaryKey: TSecondaryGroupingKey) => string;
  xAxisTickSettings?: {
    interval?: number;
  };
  percentageFormattingEnabled?: boolean;
  legendConfiguration: LegendConfiguration;
}

export const LineChart = <
  TData,
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">
>(
  props: LineChartProps<TData, TPrimaryGroupingKey, TSecondaryGroupingKey>
) => {
  const { secondaryGroupingKeyToLabel } = props;
  const { rechartsData, allSecondaryKeys } = groupDataForRecharts({
    data: props.data,
    primaryGroupingFunction: props.primaryGroupingFunction,
    primaryGroupingSortFunction: props.primaryGroupingSortFunction,
    secondaryGroupingFunction: props.secondaryGroupingFunction,
    secondaryGroupingSortFunction: props.secondaryGroupingSortFunction,
    transformOutputValue: props.transformOutputValue,
  });

  const rechartsDataUsingLabels = useMemo(() => rechartsData.map((element) => ({
    ...element,
    ...(secondaryGroupingKeyToLabel ? 
      allSecondaryKeys
        .map((secondaryKey) => ({
          [secondaryGroupingKeyToLabel(secondaryKey)]: element[secondaryKey]
        }))
        .reduce((accumulator, value) => ({
          ...accumulator,
          ...value
        }))
     : {})
  })), [rechartsData])

  let xAxisProps: XAxisProps = {
    dataKey: "primaryKey",
    interval: props.xAxisTickSettings?.interval !== undefined ? props.xAxisTickSettings.interval : undefined,
  };

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

  return (
    <ResponsiveContainer width={"100%"}>
      <RechartsLineChart
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
        <YAxis
          {...(props.percentageFormattingEnabled ? {tickFormatter: (tick) => `${tick}%`} : {})}
        />
        <Tooltip
          itemStyle={{"color": "black"}}
          {...(props.percentageFormattingEnabled ? {formatter: (value) => `${value}%`} : {})}
        />
        <Legend {...legendProps} />
        {allSecondaryKeys.map((secondaryKey) => (
          <Line
            key={secondaryKey}
            type="monotone"
            dataKey={props.secondaryGroupingKeyToLabel ? props.secondaryGroupingKeyToLabel(secondaryKey) : secondaryKey}
            stroke={props.getLineColour(secondaryKey)}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}