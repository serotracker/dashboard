import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Props as XAxisProps } from "recharts/types/cartesian/XAxis";
import clsx from "clsx";
import { typedObjectKeys } from "@/lib/utils";
import { useIsLargeScreen } from "@/hooks/useIsLargeScreen";
import { CustomXAxisTick, CustomXAxisTickProps } from "./custom-x-axis-tick";
import { DoubleGroupingTransformOutputValueInput, groupDataForRechartsTwice } from "./group-data-for-recharts/group-data-for-recharts-twice";

interface SplitBarChartProps<
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
  transformOutputValue: (input: DoubleGroupingTransformOutputValueInput<
    TData,
    TSecondaryGroupingKey
  >) => number;
  getBarColour: (primaryKey: TPrimaryGroupingKey) => string;
  xAxisTickSettings?: {
    slantValue?: number;
    idealMaximumCharactersPerLine?: number;
  };
  subgraphSettings: {
    marginBottom: number
    tooltipLabel: string
  }
}

export const SplitBarChart = <
  TData,
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">
>(
  props: SplitBarChartProps<TData, TPrimaryGroupingKey, TSecondaryGroupingKey>
) => {
  const { rechartsData } = groupDataForRechartsTwice({
    data: props.data,
    primaryGroupingFunction: props.primaryGroupingFunction,
    primaryGroupingSortFunction: props.primaryGroupingSortFunction,
    secondaryGroupingFunction: props.secondaryGroupingFunction,
    secondaryGroupingSortFunction: props.secondaryGroupingSortFunction,
    transformOutputValue: props.transformOutputValue,
  });

  const { xAxisTickSettings } = props;

  const xAxisProps = {
    dataKey: "secondaryKey",
    interval: 0,
    ...(xAxisTickSettings ? {
      tick: (tickProps: CustomXAxisTickProps) =>
        CustomXAxisTick({
          ...tickProps,
          tickSlant: xAxisTickSettings.slantValue,
          idealMaximumCharactersPerLine: xAxisTickSettings.idealMaximumCharactersPerLine
        }),
    } : {})
  };

  const isLargeScreen = useIsLargeScreen();

  return (
    <div className="h-full flex flex-row flex-wrap">
      {rechartsData.map((dataGroupedBySecondaryKey, index) => {
        const width = rechartsData.length < 3 ? "w-full" : "w-1/2";
        const height =
          rechartsData.length === 1
            ? "h-full"
            : rechartsData.length < 5
            ? "h-1/2"
            : "h-1/3";



        const { primaryKey: _, ...innerChartDataWithoutPrimaryKey } =
          dataGroupedBySecondaryKey;
        const allSecondaryKeysForPrimaryKey = typedObjectKeys(
          innerChartDataWithoutPrimaryKey
        );

        const sortedSecondaryKeysForPrimaryKey =
          props.secondaryGroupingSortFunction
            ? allSecondaryKeysForPrimaryKey.sort(
                props.secondaryGroupingSortFunction
              )
            : allSecondaryKeysForPrimaryKey;

        const dataForInnerGraph = sortedSecondaryKeysForPrimaryKey.map(
          (secondaryKey) => ({
            secondaryKey,
            [props.subgraphSettings.tooltipLabel]: innerChartDataWithoutPrimaryKey[secondaryKey],
          })
        );

        return (
          <div
            className={clsx(width, height)}
            key={`${props.graphId}-${dataGroupedBySecondaryKey.primaryKey}`}
          >
            <p className="w-full text-center ">
              {dataGroupedBySecondaryKey.primaryKey}
            </p>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                margin={{
                  top: 10,
                  right: 10,
                  left: index % 2 != 0 ? 40 : 0,
                  bottom: props.subgraphSettings.marginBottom,
                }}
                width={500}
                height={450}
                data={dataForInnerGraph}
              >
                <CartesianGrid />
                <XAxis {...xAxisProps} hide={isLargeScreen === false || isLargeScreen === undefined}/>
                <YAxis
                  domain={[0, 100]}
                  hide={index % 2 != 0}
                  tickFormatter={(tick) => `${tick}%`}
                />
                <Tooltip
                  itemStyle={{ color: "black" }}
                  formatter={(value) => `${value}%`}
                />
                <Bar
                  dataKey={props.subgraphSettings.tooltipLabel}
                  fill={props.getBarColour(
                    dataGroupedBySecondaryKey.primaryKey
                  )}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
};
