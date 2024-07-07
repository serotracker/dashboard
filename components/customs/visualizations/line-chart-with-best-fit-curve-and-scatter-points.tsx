import {
  XAxis,
  XAxisProps,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Scatter,
} from "recharts";
import groupBy from "lodash/groupBy";
import { LegendConfiguration } from "./stacked-bar-chart";
import { groupDataForRechartsOnce } from "./group-data-for-recharts/group-data-for-recharts-once";
import { typedGroupBy, typedObjectEntries, typedObjectKeys } from "@/lib/utils";
import { pipe } from "fp-ts/lib/function";
import { Formatter as TooltipFormatter } from "recharts/types/component/DefaultTooltipContent";
import { Formatter as LegendFormatter} from "recharts/types/component/DefaultLegendContent";

interface LineChartWithBestFitCurveAndScatterPointsProps<
  TData extends {
    xAxisValue: number;
    rawYAxisValue: number | undefined;
    modelledYAxisValue: number;
  },
  TPrimaryGroupingKey extends string
> {
  graphId: string;
  data: TData[];
  primaryGroupingFunction: (data: TData) => TPrimaryGroupingKey | TPrimaryGroupingKey[];
  primaryGroupingSortFunction?: (
    a: TPrimaryGroupingKey,
    b: TPrimaryGroupingKey
  ) => number;
  primaryGroupingKeyToLabel?: (input: TPrimaryGroupingKey) => string;
  xAxisValueToLabel?: (input: number) => string;
  allPrimaryGroups?: TPrimaryGroupingKey[];
  getLineColour: (secondaryKey: TPrimaryGroupingKey, index: number) => string;
  scatterPointsVisible: boolean;
  percentageFormattingEnabled?: boolean;
  legendConfiguration: LegendConfiguration;
}

export const LineChartWithBestFitCurveAndScatterPoints = <
  TData extends {
    xAxisValue: number;
    rawYAxisValue: number | undefined;
    modelledYAxisValue: number;
  },
  TPrimaryGroupingKey extends string
>(props: LineChartWithBestFitCurveAndScatterPointsProps<TData, TPrimaryGroupingKey>) => {
  const { rechartsData, allPrimaryKeys } = groupDataForRechartsOnce({
    data: props.data,
    primaryGroupingFunction: props.primaryGroupingFunction,
    primaryGroupingSortFunction: props.primaryGroupingSortFunction,
    transformOutputValue: ({ data }) => data
  });

  const formattedRechartsData = pipe(
    rechartsData,
    typedObjectEntries,
    (intermediateInput) => intermediateInput.flatMap(([primaryKey, data]) => data.map((dataPoint) => ({
      primaryKey,
      xAxisValue: props.xAxisValueToLabel ? props.xAxisValueToLabel(dataPoint.xAxisValue) : dataPoint.xAxisValue.toString(),
      [`${primaryKey}-rawYAxisValue`]: dataPoint.rawYAxisValue,
      [`${primaryKey}-modelledYAxisValue`]: dataPoint.modelledYAxisValue,
    }))),
    (intermediateInput) => groupBy(intermediateInput, (dataPoint) => dataPoint.xAxisValue),
    (intermediateInput) => {
      const allXAxisValues = typedObjectKeys(intermediateInput);

      return allXAxisValues.flatMap((xAxisValue) => {
        const dataForXAxisValue = intermediateInput[xAxisValue]

        return dataForXAxisValue.reduce((accumulator, currentValue) => ({
          ...accumulator,
          ...currentValue
        }), {
          primaryKey: "UNKNOWN",
          xAxisValue: "UNKNOWN"
        });
      })
    }
  )

  const tooltipFormatter: TooltipFormatter<number, string> = (value, name) => [
    `${value.toFixed(2)}%`,
    name
  ];

  const legendFormatter: LegendFormatter = (name: string) => (
    name
      .replace(/ \(Modelled\)$/g, '')
      .replace(/ \(Raw\)$/g, '')
  )

  const legendProps = props.legendConfiguration === LegendConfiguration.RIGHT_ALIGNED
    ? {
        layout: "vertical" as const,
        verticalAlign: "middle" as const,
        align: "right" as const,
        wrapperStyle: { right: -10 },
        formatter: legendFormatter
      }
    : {
        layout: "horizontal" as const,
        verticalAlign: "bottom" as const,
        align: "center" as const,
        wrapperStyle: {
          paddingTop: 10,
          bottom: 0,
        },
        formatter: legendFormatter
      };

  const xAxisProps: XAxisProps = {
    dataKey: "xAxisValue",
    type: 'category'
  }

  return (
    <ResponsiveContainer width={"100%"}>
      <ComposedChart
        margin={{
          top: 0,
          right: 30,
          left: 0,
          bottom: 0,
        }}
        width={730}
        height={500}
        data={formattedRechartsData}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis {...xAxisProps} />
        <YAxis
          type='number'
          {...(props.percentageFormattingEnabled ? {tickFormatter: (tick) => `${tick}%`} : {})}
        />
        <Tooltip
          itemStyle={{"color": "black"}}
          formatter={tooltipFormatter}
        />
        <Legend {...legendProps} />
        {allPrimaryKeys.map((primaryKey, index) => (
          <Line
            name={`${primaryKey} (Modelled)`}
            key={`${primaryKey}-modelledYAxisValue`}
            type="monotone"
            dataKey={`${primaryKey}-modelledYAxisValue`}
            stroke={props.getLineColour(primaryKey, index)}
          />
        ))}
        {props.scatterPointsVisible && allPrimaryKeys.map((primaryKey, index) => (
          <Scatter
            legendType='none'
            name={`${primaryKey} (Raw)`}
            key={`${primaryKey}-rawYAxisValue`}
            dataKey={`${primaryKey}-rawYAxisValue`}
            type="monotone"
            fill={props.getLineColour(primaryKey, index)}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}