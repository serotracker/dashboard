import uniq from "lodash/uniq";
import { useMemo } from 'react';
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
import { typedObjectFromEntries, typedObjectKeys } from "@/lib/utils";
import { DoubleGroupingTransformOutputValueInput, groupDataForRechartsTwice } from "./group-data-for-recharts/group-data-for-recharts-twice";
import { LegendConfiguration } from "./stacked-bar-chart";
import { monthYearStringToMonthCount } from "@/lib/time-utils";

type SecondaryGroupingKeyForLine<TSecondaryGroupingKey extends Exclude<string, "primaryKey">>
  = `line-data-${TSecondaryGroupingKey}`;

type SecondaryGroupingKeyForScatterPoints<TSecondaryGroupingKey extends Exclude<string, "primaryKey">>
  = `scatter-point-data-${TSecondaryGroupingKey}`;

const toSecondaryKeyForLine = <TSecondaryGroupingKey extends Exclude<string, "primaryKey">>(
  secondaryKey: TSecondaryGroupingKey
): SecondaryGroupingKeyForLine<TSecondaryGroupingKey> => `line-data-${secondaryKey}`;

const toSecondaryKeyForScatterPoints = <TSecondaryGroupingKey extends Exclude<string, "primaryKey">>(
  secondaryKey: TSecondaryGroupingKey
): SecondaryGroupingKeyForScatterPoints<TSecondaryGroupingKey> => `scatter-point-data-${secondaryKey}`;

interface LineWithScatterPointsChartProps<
  TLineData extends Record<string, unknown>,
  TScatterPointData extends Record<string, unknown>,
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">
> {
  graphId: string;
  lineData: TLineData[];
  scatterPointsData: TScatterPointData[];
  primaryGroupingFunctionForLineData: (data: TLineData) => TPrimaryGroupingKey | TPrimaryGroupingKey[];
  primaryGroupingFunctionForScatterPointsData: (data: TScatterPointData) => TPrimaryGroupingKey | TPrimaryGroupingKey[];
  primaryGroupingSortFunction?: (
    a: TPrimaryGroupingKey,
    b: TPrimaryGroupingKey
  ) => number;
  primaryGroupingKeyToLabel?: (input: TPrimaryGroupingKey) => string;
  allPrimaryGroups?: TPrimaryGroupingKey[];
  secondaryGroupingFunctionForLineData: (data: TLineData) => TSecondaryGroupingKey | TSecondaryGroupingKey[];
  secondaryGroupingFunctionForScatterPointsData: (data: TScatterPointData) => TSecondaryGroupingKey | TSecondaryGroupingKey[];
  secondaryGroupingSortFunction?: (
    a: TSecondaryGroupingKey,
    b: TSecondaryGroupingKey
  ) => number;
  secondaryGroupingKeyToLabel?: (input: TSecondaryGroupingKey) => string;
  transformOutputValueForLineData: (input: DoubleGroupingTransformOutputValueInput<
    TLineData,
    TSecondaryGroupingKey
  >) => number;
  transformOutputValueForScatterPointData: (input: {
    dataPoint: TScatterPointData;
    secondaryGroupingKey: TSecondaryGroupingKey;
  }) => number;
  getLineColour: (secondaryKey: TSecondaryGroupingKey, index: number) => string;
  getScatterPointsColour: (secondaryKey: TSecondaryGroupingKey, index: number) => string;
  xAxisTickSettings?: {
    interval?: number;
  };
  percentageFormattingEnabled?: boolean;
  legendConfiguration: LegendConfiguration;
}

export const LineWithScatterPointsChart = <
  TLineData extends Record<string, unknown>,
  TScatterPointData extends Record<string, unknown>,
  TPrimaryGroupingKey extends string,
  TSecondaryGroupingKey extends Exclude<string, "primaryKey">
>(props: LineWithScatterPointsChartProps<
  TLineData,
  TScatterPointData,
  TPrimaryGroupingKey,
  TSecondaryGroupingKey
>) => {
  const { primaryGroupingSortFunction } = props;
  const {
    rechartsData: groupedLineData,
    allSecondaryKeys: allSecondaryKeysForLineData
  } = groupDataForRechartsTwice({
    data: props.lineData,
    primaryGroupingFunction: props.primaryGroupingFunctionForLineData,
    primaryGroupingSortFunction: props.primaryGroupingSortFunction,
    secondaryGroupingFunction: props.secondaryGroupingFunctionForLineData,
    secondaryGroupingSortFunction: props.secondaryGroupingSortFunction,
    transformOutputValue: props.transformOutputValueForLineData,
  });

  const {
    rechartsData: groupedScatterPointsData,
    allSecondaryKeys: allSecondaryKeysForScatterPointsData
} = groupDataForRechartsTwice({
    data: props.scatterPointsData,
    primaryGroupingFunction: props.primaryGroupingFunctionForScatterPointsData,
    primaryGroupingSortFunction: props.primaryGroupingSortFunction,
    secondaryGroupingFunction: props.secondaryGroupingFunctionForScatterPointsData,
    secondaryGroupingSortFunction: props.secondaryGroupingSortFunction,
    transformOutputValue: ({ data, secondaryGroupingKey }) =>
      data.map((dataPoint) => props.transformOutputValueForScatterPointData({ dataPoint, secondaryGroupingKey }))
  });
  
  const rechartsScatterPlotData = groupedScatterPointsData.flatMap((scatterDataPoint) => {
    const primaryKey = scatterDataPoint.primaryKey
    const allSecondaryKeys = typedObjectKeys(scatterDataPoint)
      .filter(<T extends unknown>(element: T | 'primaryKey'): element is T => element !== 'primaryKey');

    return allSecondaryKeys.flatMap((secondaryKey) => {
      const valuesForSecondaryKey: number[] = scatterDataPoint[secondaryKey];

      return valuesForSecondaryKey.map((value): {
        primaryKey: TPrimaryGroupingKey,
      } & Record<SecondaryGroupingKeyForScatterPoints<TSecondaryGroupingKey>, number> => {
        const primaryKeyPortion: { primaryKey: TPrimaryGroupingKey } = { primaryKey: primaryKey };
        const secondaryKeyPortion: Record<
          SecondaryGroupingKeyForScatterPoints<TSecondaryGroupingKey>,
          number
        > = typedObjectFromEntries([[toSecondaryKeyForScatterPoints(secondaryKey), value]]);

        return {
          ...primaryKeyPortion,
          ...secondaryKeyPortion
        }
      })
    })
  });

  const rechartsLineData = groupedLineData.map((lineDataPoint) => {
    const primaryKey = lineDataPoint.primaryKey
    const allSecondaryKeys = typedObjectKeys(lineDataPoint)
      .filter(<T extends unknown>(element: T | 'primaryKey'): element is T => element !== 'primaryKey');

    const primaryKeyPortion: { primaryKey: TPrimaryGroupingKey } = { primaryKey: primaryKey };
    const secondaryKeyPortion: Record<
      SecondaryGroupingKeyForLine<TSecondaryGroupingKey>,
      number
    > = typedObjectFromEntries(allSecondaryKeys.map((secondaryKey) => [
      toSecondaryKeyForLine(secondaryKey),
      lineDataPoint[secondaryKey]
    ]));

    return {
      ...primaryKeyPortion,
      ...secondaryKeyPortion
    }
  })

  const allPrimaryKeys = useMemo(() => 
    uniq([ ...rechartsLineData, ...rechartsScatterPlotData ].map((element) => element.primaryKey))
      .sort((primaryKeyA, primaryKeyB) => (
        primaryGroupingSortFunction ? primaryGroupingSortFunction(primaryKeyA, primaryKeyB) : 0
      ))
  , [rechartsLineData, rechartsScatterPlotData, primaryGroupingSortFunction])

  const fullRechartsData = useMemo(() => allPrimaryKeys.flatMap((primaryKey) => [
    ...rechartsLineData.filter((dataPoint) => dataPoint.primaryKey === primaryKey),
    ...rechartsScatterPlotData.filter((dataPoint) => dataPoint.primaryKey === primaryKey),
    ...rechartsLineData.filter((dataPoint) => dataPoint.primaryKey === primaryKey),
  ]), [allPrimaryKeys, rechartsScatterPlotData, rechartsLineData])

  let xAxisProps: XAxisProps = {
    dataKey: "primaryKey",
    type: 'category',
    interval: props.xAxisTickSettings?.interval !== undefined ? props.xAxisTickSettings.interval : undefined,
    ...(props.allPrimaryGroups ? {
      ticks: primaryGroupingSortFunction
        ? props.allPrimaryGroups.sort((primaryGroupA, primaryGroupB) => primaryGroupingSortFunction(primaryGroupA, primaryGroupB))
        : props.allPrimaryGroups
    } : {})
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
      <ComposedChart
        margin={{
          top: 0,
          right: 30,
          left: 0,
          bottom: 0,
        }}
        width={730}
        height={500}
        data={fullRechartsData}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis {...xAxisProps} allowDuplicatedCategory={false} />
        <YAxis
          {...(props.percentageFormattingEnabled ? {tickFormatter: (tick) => `${tick}%`} : {})}
        />
        <Tooltip
          itemStyle={{"color": "black"}}
          {...(props.percentageFormattingEnabled ? {formatter: (value) => `${value}%`} : {})}
        />
        <Legend {...legendProps} />
        {allSecondaryKeysForScatterPointsData.map((secondaryKey, index) => (
          <Scatter
            key={toSecondaryKeyForScatterPoints(secondaryKey)}
            type="monotone"
            dataKey={toSecondaryKeyForScatterPoints(secondaryKey)}
            fill={props.getScatterPointsColour(secondaryKey, index)}
            legendType="none"
          />
        ))}
        {allSecondaryKeysForLineData.map((secondaryKey, index) => (
          <Line
            key={toSecondaryKeyForLine(secondaryKey)}
            type="monotone"
            dataKey={toSecondaryKeyForLine(secondaryKey)}
            stroke={props.getLineColour(secondaryKey, index)}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}