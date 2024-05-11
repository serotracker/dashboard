import { LegendConfiguration } from "./stacked-bar-chart";

interface LineChartProps<
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
  transformOutputValue: (data: TData[]) => number;
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
  props: LineChartProps<TData, TPrimaryGroupingKey, TSecondaryGroupingKey>
) => {
    return <p> TODO </p>
}