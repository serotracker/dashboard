import { useContext, useMemo } from "react";
import parseISO from 'date-fns/parseISO';

import { LineChart } from "@/components/customs/visualizations/line-chart";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { SarsCov2Context, SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { dateToMonthCount, monthCountToMonthYearString, monthYearStringToMonthCount } from "@/lib/time-utils";
import { WhoRegion } from "@/gql/graphql";
import { BestFitCurveLineChart } from "@/components/customs/visualizations/best-fit-curve-line-chart";

interface GenerateTimeBucketForEstimateInput {
  estimate: Omit<SarsCov2Estimate, 'samplingMidDate'> & {samplingMidDate: Date};
}

const generateTimeBucketsForEstimate = (input: GenerateTimeBucketForEstimateInput): string[] => {
  const samplingMidDateMonthCount = dateToMonthCount(input.estimate.samplingMidDate);

  return [
    monthCountToMonthYearString(samplingMidDateMonthCount - 1),
    monthCountToMonthYearString(samplingMidDateMonthCount),
    monthCountToMonthYearString(samplingMidDateMonthCount + 1)
  ]
}

const barColoursForWhoRegions: Record<WhoRegion, string> = {
  [WhoRegion.Afr]: "#e15759",
  [WhoRegion.Amr]: "#59a14f",
  [WhoRegion.Emr]: "#f1ce63",
  [WhoRegion.Eur]: "#f28e2b",
  [WhoRegion.Sear]: "#d37295",
  [WhoRegion.Wpr]: "#4e79a7",
};

interface ModelledSeroprevalenceByWhoRegionGraphProps {
  legendConfiguration: LegendConfiguration;
}

export const ModelledSeroprevalenceByWhoRegionGraph = (props: ModelledSeroprevalenceByWhoRegionGraphProps) => {
  const state = useContext(SarsCov2Context);

  const consideredData = useMemo(() => state.filteredData
    .filter((dataPoint: SarsCov2Estimate): dataPoint is Omit<SarsCov2Estimate, "samplingMidDate"|"whoRegion"|"denominatorValue"|"numeratorValue">
    & {
      samplingMidDate: NonNullable<SarsCov2Estimate["samplingStartDate"]>;
      whoRegion: NonNullable<SarsCov2Estimate["whoRegion"]>;
      denominatorValue: NonNullable<SarsCov2Estimate["denominatorValue"]>;
      numeratorValue: NonNullable<SarsCov2Estimate["numeratorValue"]>;
    } => 
        !!dataPoint.samplingMidDate
        && !!dataPoint.whoRegion
        && dataPoint.denominatorValue !== null && dataPoint.denominatorValue !== undefined
        && dataPoint.numeratorValue !== null && dataPoint.numeratorValue !== undefined
    ).map((dataPoint) => ({
      ...dataPoint,
      samplingMidDate: parseISO(dataPoint.samplingMidDate),
    })),
    [state.filteredData]
  );

  return (
    <BestFitCurveLineChart
      graphId="modelled-sc2-seroprevalence-by-who-region"
      data={consideredData}
      primaryGroupingFunction={(dataPoint) => dataPoint.whoRegion}
      primaryGroupingSortFunction={(whoRegionA, whoRegionB) => whoRegionA > whoRegionB ? 1 : -1}
      dataPointToXAxisValue={({ dataPoint }) => dateToMonthCount(dataPoint.samplingMidDate)}
      xAxisValueToLabel={({ xAxisValue }) => monthCountToMonthYearString(xAxisValue)}
      xAxisLabelSortingFunction={(xAxisLabelA, xAxisLabelB) => monthYearStringToMonthCount(xAxisLabelA) - monthYearStringToMonthCount(xAxisLabelB)}
      dataPointToYAxisValue={({ dataPoint }) => 
        parseFloat(((dataPoint.numeratorValue / dataPoint.denominatorValue) * 100).toFixed(1))
      }
      getLineColour={({ primaryGroupingKey }) => barColoursForWhoRegions[primaryGroupingKey]}
      bestFitLineSettings={{
        maximumPolynomialOrder: 2,
        yAxisDomain: {
          maximumValue: 100,
          minimumValue: 0
        },
        allowStrictlyIncreasingLinesOnly: true
      }}
      formatYAxisValue={({ yAxisValue }) => parseFloat((yAxisValue).toFixed(1))}
      legendConfiguration={LegendConfiguration.RIGHT_ALIGNED}
      percentageFormattingEnabled={true}
    />
  );
}
