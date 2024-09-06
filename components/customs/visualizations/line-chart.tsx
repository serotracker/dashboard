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
  Line,
} from "recharts";
import { LegendConfiguration } from "./stacked-bar-chart";
import { DoubleGroupingTransformOutputValueInput, groupDataForRechartsTwice } from './group-data-for-recharts/group-data-for-recharts-twice';
import { applyLabelsToGroupedRechartsData } from './group-data-for-recharts/apply-labels-to-grouped-recharts-data';
import { Formatter } from 'recharts/types/component/DefaultTooltipContent';
import { useBarColourAndLegendProps } from './use-bar-colour-and-legend-props';

const percentageTooltipFormatter: Formatter<number, string> = (value) => `${value.toFixed(2)}%`

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
  >) => number | undefined;
  getLineColour: (secondaryKey: TSecondaryGroupingKey, index: number) => string;
  tooltipFormatter?: Formatter<number, string>;
  tooltipLabelFormatter?: (label: string) => React.ReactNode;
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
  const {
    secondaryGroupingKeyToLabel,
    primaryGroupingKeyToLabel,
    primaryGroupingSortFunction,
    percentageFormattingEnabled,
    tooltipFormatter: tooltipFormatterOverride,
    tooltipLabelFormatter
  } = props;
  const { rechartsData, allSecondaryKeys } = groupDataForRechartsTwice({
    data: props.data,
    primaryGroupingFunction: props.primaryGroupingFunction,
    primaryGroupingSortFunction: props.primaryGroupingSortFunction,
    secondaryGroupingFunction: props.secondaryGroupingFunction,
    secondaryGroupingSortFunction: props.secondaryGroupingSortFunction,
    transformOutputValue: props.transformOutputValue,
  });

  const { getColourForSecondaryKey, legendProps } = useBarColourAndLegendProps({
    getColourForSecondaryKeyDefault: (secondaryKey, index) => props.getLineColour(secondaryKey, index),
    secondaryGroupingKeyToLabel,
    legendConfiguration: props.legendConfiguration
  });

  const { rechartsDataUsingLabels } = useMemo(() => applyLabelsToGroupedRechartsData({
    rechartsData,
    primaryGroupingKeyToLabel,
    secondaryGroupingKeyToLabel
  }), [rechartsData, primaryGroupingKeyToLabel, secondaryGroupingKeyToLabel]);

  let xAxisProps: XAxisProps = {
    dataKey: "primaryKey",
    interval: props.xAxisTickSettings?.interval !== undefined ? props.xAxisTickSettings.interval : undefined,
    ...(props.allPrimaryGroups ? {
      ticks: primaryGroupingSortFunction
        ? props.allPrimaryGroups.sort((primaryGroupA, primaryGroupB) => primaryGroupingSortFunction(primaryGroupA, primaryGroupB))
        : props.allPrimaryGroups
    } : {})
  };

  const tooltipFormatter = useMemo(() => {
    if(tooltipFormatterOverride) {
      return tooltipFormatterOverride;
    }

    if(percentageFormattingEnabled) {
      return percentageTooltipFormatter;
    }

    return undefined
  }, [ tooltipFormatterOverride, percentageFormattingEnabled ])

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
          {...(tooltipFormatter ? {formatter: tooltipFormatter} : {})}
          {...(tooltipLabelFormatter ? {labelFormatter: tooltipLabelFormatter} : {})}
        />
        <Legend {...legendProps} />
        {allSecondaryKeys.map((secondaryKey, index) => (
          <Line
            key={secondaryKey}
            type="monotone"
            dataKey={props.secondaryGroupingKeyToLabel ? props.secondaryGroupingKeyToLabel(secondaryKey) : secondaryKey}
            stroke={getColourForSecondaryKey(secondaryKey, index)}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}