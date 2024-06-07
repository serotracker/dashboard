import { useContext, useMemo } from "react";
import parseISO from 'date-fns/parseISO';

import { LineChart } from "@/components/customs/visualizations/line-chart";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { SarsCov2Context, SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { dateToMonthCount, monthCountToMonthYearString, monthYearStringToMonthCount } from "@/lib/time-utils";
import { WhoRegion } from "@/gql/graphql";

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
    <LineChart
      graphId="modelled-sc2-seroprevalence-by-who-region"
      data={consideredData}
      primaryGroupingFunction={(dataPoint) => generateTimeBucketsForEstimate({ estimate: dataPoint })}
      primaryGroupingSortFunction={(timeBucketA, timeBucketB) => monthYearStringToMonthCount(timeBucketA) - monthYearStringToMonthCount(timeBucketB)}
      secondaryGroupingFunction={(dataPoint) => dataPoint.whoRegion}
      secondaryGroupingSortFunction={(whoRegionA, whoRegionB) => whoRegionA > whoRegionB ? 1 : -1}
      transformOutputValue={({ data }) => {
        const { denominatorValue, numeratorValue } = data.reduce((accumulator, currentValue) => ({
          denominatorValue: accumulator.denominatorValue + currentValue.denominatorValue,
          numeratorValue: accumulator.numeratorValue + currentValue.numeratorValue,
        }), {denominatorValue: 0, numeratorValue: 0})

        return denominatorValue > 0 ? parseFloat(((numeratorValue * 100) / denominatorValue).toFixed(1)) : 0
      }}
      getLineColour={(whoRegion) => barColoursForWhoRegions[whoRegion]}
      legendConfiguration={LegendConfiguration.RIGHT_ALIGNED}
      percentageFormattingEnabled={true}
    />
  );
}