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
import { LegendConfiguration } from "./stacked-bar-chart";
import { applyLabelsToSinglyGroupedRechartsData } from './group-data-for-recharts/apply-labels-to-grouped-recharts-data';
import { groupDataForRechartsOnce } from './group-data-for-recharts/group-data-for-recharts-once';
import { typedObjectEntries, typedObjectFromEntries } from '@/lib/utils';

interface LineChartTwoProps<
  TData extends Record<'xAxisValue', number> & Record<'yAxisValue', number>,
  TScatterPointData extends Record<'xAxisValue', number> & Record<'yAxisValue', number>,
  TPrimaryGroupingKey extends string,
> {
  graphId: string;
  data: TData[];
  scatterPointData: TScatterPointData[];
  primaryGroupingFunction: (data: TData) => TPrimaryGroupingKey | TPrimaryGroupingKey[];
  scatterPointPrimaryGroupingFunction: (data: TScatterPointData) => TPrimaryGroupingKey | TPrimaryGroupingKey[];
  primaryGroupingSortFunction?: (
    a: TPrimaryGroupingKey,
    b: TPrimaryGroupingKey
  ) => number;
  primaryGroupingKeyToLabel?: (input: TPrimaryGroupingKey) => string;
  getLineColour: (secondaryKey: TPrimaryGroupingKey, index: number) => string;
  xAxisTickSettings?: {
    interval?: number;
  };
  yAxisTickSettings: {
    percentageFormattingEnabled?: boolean;
  }
  legendConfiguration: LegendConfiguration;
}

interface getGroupedAndLabelledDataInput<
  TData extends Record<'xAxisValue', number> & Record<'yAxisValue', number>,
  TPrimaryGroupingKey extends string,
  TPrimaryGroupingKeyLabel extends string,
  TPrimaryGroupingKeyLabelSuffix extends string
> {
  data: TData[];
  primaryGroupingFunction: (data: TData) => TPrimaryGroupingKey | TPrimaryGroupingKey[];
  primaryGroupingKeyToLabel?: (input: TPrimaryGroupingKey) => TPrimaryGroupingKeyLabel;
  primaryGroupingSortFunction?: (
    a: TPrimaryGroupingKey,
    b: TPrimaryGroupingKey
  ) => number;
  primaryGroupingKeyLabelSuffix: TPrimaryGroupingKeyLabelSuffix;
}

interface getGroupedAndLabelledDataOutput<
  TPrimaryGroupingKey extends string,
  TPrimaryGroupingKeyLabel extends string,
  TPrimaryGroupingKeyLabelSuffix extends string
> {
  rechartsDataUsingLabels: Record<`${TPrimaryGroupingKeyLabelSuffix}${TPrimaryGroupingKeyLabel}`, number>[];
  allPrimaryKeys: TPrimaryGroupingKey[];
}

const getGroupedAndLabelledData = <
  TData extends Record<'xAxisValue', number> & Record<'yAxisValue', number>,
  TPrimaryGroupingKey extends string,
  TPrimaryGroupingKeyLabel extends string,
  TPrimaryGroupingKeyLabelSuffix extends string
>(input: getGroupedAndLabelledDataInput<
  TData,
  TPrimaryGroupingKey,
  TPrimaryGroupingKeyLabel,
  TPrimaryGroupingKeyLabelSuffix
>): getGroupedAndLabelledDataOutput<
  TPrimaryGroupingKey,
  TPrimaryGroupingKeyLabel,
  TPrimaryGroupingKeyLabelSuffix
> => {
  const { rechartsData, allPrimaryKeys } = groupDataForRechartsOnce({
    data: input.data,
    primaryGroupingFunction: input.primaryGroupingFunction,
    primaryGroupingSortFunction: input.primaryGroupingSortFunction,
    transformOutputValue: ({ data }) => data
  });

  const { rechartsDataUsingLabels: unformattedRechartsDataUsingLabels } = applyLabelsToSinglyGroupedRechartsData({
    rechartsData,
    primaryGroupingKeyToLabel: input.primaryGroupingKeyToLabel
  });

  const rechartsDataUsingLabels: Record<`${TPrimaryGroupingKeyLabelSuffix}${TPrimaryGroupingKeyLabel}`, number>[] = typedObjectEntries(unformattedRechartsDataUsingLabels)
    .flatMap(([primaryKey, data]) => data
      .map((dataPoint): Record<`${TPrimaryGroupingKeyLabelSuffix}${TPrimaryGroupingKeyLabel}`, number> => {
        const key:`${TPrimaryGroupingKeyLabelSuffix}${TPrimaryGroupingKeyLabel}` = `${input.primaryGroupingKeyLabelSuffix}${primaryKey}`;
        const value = dataPoint.yAxisValue;
        return typedObjectFromEntries([
          [key, value],
          ['xAxisValue', dataPoint.xAxisValue]
        ]);
      }
    ))
  
  return {
    rechartsDataUsingLabels,
    allPrimaryKeys
  }
}

export const LineChartTwo = <
  TData extends Record<'xAxisValue', number> & Record<'yAxisValue', number>,
  TScatterPointData extends Record<'xAxisValue', number> & Record<'yAxisValue', number>,
  TPrimaryGroupingKey extends string,
>(
  props: LineChartTwoProps<
    TData,
    TScatterPointData,
    TPrimaryGroupingKey
  >
) => {
  // const { rechartsData, allPrimaryKeys } = groupDataForRechartsOnce({
  //   data: props.data,
  //   primaryGroupingFunction: props.primaryGroupingFunction,
  //   primaryGroupingSortFunction: props.primaryGroupingSortFunction,
  //   transformOutputValue: ({ data }) => data
  // });

  // const { rechartsDataUsingLabels: unformattedRechartsDataUsingLabels } = useMemo(() => applyLabelsToSinglyGroupedRechartsData({
  //   rechartsData,
  //   primaryGroupingKeyToLabel
  // }), [rechartsData, primaryGroupingKeyToLabel]);

  // const rechartsDataUsingLabels = useMemo(() => 
  //   typedObjectEntries(unformattedRechartsDataUsingLabels)
  //     .flatMap(([primaryKey, data]) => data.map((dataPoint) => ({
  //       [primaryKey]: dataPoint.yAxisValue,
  //     })))
  // , [ unformattedRechartsDataUsingLabels ])

  const lineDataPrefix = '';
  const scatterPointDataPrefix = 'scatter-point-data';

  const {
    rechartsDataUsingLabels: lineRechartsData,
    allPrimaryKeys: linePrimaryKeys
  } = getGroupedAndLabelledData({
    data: props.data,
    primaryGroupingFunction: props.primaryGroupingFunction,
    primaryGroupingKeyToLabel: props.primaryGroupingKeyToLabel,
    primaryGroupingSortFunction: props.primaryGroupingSortFunction,
    primaryGroupingKeyLabelSuffix: lineDataPrefix
  })

  const {
    rechartsDataUsingLabels: scatterPointRechartsData,
    allPrimaryKeys: scatterPointPrimaryKeys
  } = getGroupedAndLabelledData({
    data: props.scatterPointData,
    primaryGroupingFunction: props.scatterPointPrimaryGroupingFunction,
    primaryGroupingKeyToLabel: props.primaryGroupingKeyToLabel,
    primaryGroupingSortFunction: props.primaryGroupingSortFunction,
    primaryGroupingKeyLabelSuffix: scatterPointDataPrefix 
  })

  const rechartsData = [
    ...lineRechartsData,
    ...scatterPointRechartsData
  ]

  let xAxisProps: XAxisProps = {
    dataKey: "xAxisValue",
    interval: props.xAxisTickSettings?.interval !== undefined ? props.xAxisTickSettings.interval : undefined,
    type: 'number'
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

  console.log('rechartsData', rechartsData);

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
        data={rechartsData}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis {...xAxisProps} />
        <YAxis
          type='number'
          {...(props.yAxisTickSettings.percentageFormattingEnabled ? {tickFormatter: (tick) => `${tick}%`} : {})}
        />
        <Tooltip
          itemStyle={{"color": "black"}}
          {...(props.yAxisTickSettings.percentageFormattingEnabled ? {formatter: (value) => `${value}%`} : {})}
        />
        <Legend {...legendProps} />
        {linePrimaryKeys.map((primaryKey, index) => (
          <Line
            key={props.primaryGroupingKeyToLabel
              ? `${lineDataPrefix}${props.primaryGroupingKeyToLabel(primaryKey)}`
              : `${lineDataPrefix}${primaryKey}`
            }
            type="monotone"
            dataKey={props.primaryGroupingKeyToLabel
              ? `${lineDataPrefix}${props.primaryGroupingKeyToLabel(primaryKey)}`
              : `${lineDataPrefix}${primaryKey}`
            }
            stroke={props.getLineColour(primaryKey, index)}
          />
        ))}
        {scatterPointPrimaryKeys.map((primaryKey, index) => (
          <Scatter
            legendType='none'
            key={props.primaryGroupingKeyToLabel
              ? `${scatterPointDataPrefix}${props.primaryGroupingKeyToLabel(primaryKey)}`
              : `${scatterPointDataPrefix}${primaryKey}`
            }
            type="monotone"
            dataKey={props.primaryGroupingKeyToLabel
              ? `${scatterPointDataPrefix}${props.primaryGroupingKeyToLabel(primaryKey)}`
              : `${scatterPointDataPrefix}${primaryKey}`
            }
            fill={props.getLineColour(primaryKey, index)}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}