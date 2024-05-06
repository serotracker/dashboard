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
import { groupDataForRecharts } from "./group-data-for-recharts";
import { Props as XAxisProps } from "recharts/types/cartesian/XAxis";
import { SlantedTick } from "../../../app/pathogen/arbovirus/dashboard/(visualizations)/recharts";

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
  primaryGroupingSortFunction?: (
    a: TPrimaryGroupingKey,
    b: TPrimaryGroupingKey
  ) => number;
  secondaryGroupingFunction: (data: TData) => TSecondaryGroupingKey;
  secondaryGroupingSortFunction?: (
    a: TSecondaryGroupingKey,
    b: TSecondaryGroupingKey
  ) => number;
  transformOutputValue: (data: TData[]) => number;
  getBarColour: (secondaryKey: TSecondaryGroupingKey) => string;
  tickSlantOptions?: {
    slantValue: number;
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

  const { rechartsData, allSecondaryKeys } = groupDataForRecharts({
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
  const { tickSlantOptions } = props;

  if (tickSlantOptions) {
    xAxisProps = {
      ...xAxisProps,
      tick: (tickProps) =>
        SlantedTick({ ...tickProps, tickSlant: tickSlantOptions.slantValue }),
    };
  }

  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <BarChart
        width={730}
        height={250}
        data={rechartsData}
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
            dataKey={secondaryKey}
            stackId="a"
            fill={props.getBarColour(secondaryKey)}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
