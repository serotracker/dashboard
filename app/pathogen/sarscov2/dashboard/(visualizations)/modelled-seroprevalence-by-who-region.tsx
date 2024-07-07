import { useContext } from "react";

import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sarscov2/sc2-context";
import { monthCountToMonthYearString } from "@/lib/time-utils";
import { WhoRegion } from "@/gql/graphql";
import { ModelledSarsCov2SeroprevalenceContext } from "@/contexts/pathogen-context/pathogen-contexts/sarscov2/modelled-sarscov2-seroprevalence-context";
import { generateRandomColour } from "@/lib/utils";
import { LineChartWithBestFitCurveAndScatterPoints } from "@/components/customs/visualizations/line-chart-with-best-fit-curve-and-scatter-points";

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

type AcceptableSarsCov2EstimateWithSeroprevalence = Omit<SarsCov2Estimate, "samplingMidDate"|"whoRegion"|"denominatorValue"|"numeratorValue"|"seroprevalence"> & {
  samplingMidDate: NonNullable<SarsCov2Estimate["samplingStartDate"]>;
  whoRegion: NonNullable<SarsCov2Estimate["whoRegion"]>;
  denominatorValue: NonNullable<SarsCov2Estimate["denominatorValue"]>;
} & {
  numeratorValue: SarsCov2Estimate["numeratorValue"];
  seroprevalence: NonNullable<SarsCov2Estimate["seroprevalence"]>;
}

const isAcceptableSarsCov2EstimateWithSeroprevalence = (
  estimate: Omit<AcceptableSarsCov2Estimate, 'samplingMidDate'> & { samplingMidDate: Date }
): estimate is (Omit<AcceptableSarsCov2EstimateWithSeroprevalence, 'samplingMidDate'> & { samplingMidDate: Date }) =>
  estimate.seroprevalence !== null && estimate.seroprevalence !== undefined;

type AcceptableSarsCov2EstimateWithNumerator = Omit<SarsCov2Estimate, "samplingMidDate"|"whoRegion"|"denominatorValue"|"numeratorValue"|"seroprevalence"> & {
  samplingMidDate: NonNullable<SarsCov2Estimate["samplingStartDate"]>;
  whoRegion: NonNullable<SarsCov2Estimate["whoRegion"]>;
  denominatorValue: NonNullable<SarsCov2Estimate["denominatorValue"]>;
} & {
  numeratorValue: NonNullable<SarsCov2Estimate["numeratorValue"]>;
  seroprevalence: SarsCov2Estimate["seroprevalence"]
}

const isAcceptableSarsCov2EstimateWithNumerator = (
  estimate: Omit<AcceptableSarsCov2Estimate, 'samplingMidDate'> & { samplingMidDate: Date }
): estimate is (Omit<AcceptableSarsCov2EstimateWithNumerator, 'samplingMidDate'> & { samplingMidDate: Date }) =>
  estimate.numeratorValue !== null && estimate.numeratorValue !== undefined;

type AcceptableSarsCov2Estimate = AcceptableSarsCov2EstimateWithSeroprevalence | AcceptableSarsCov2EstimateWithNumerator;

export const ModelledSeroprevalenceByWhoRegionGraph = (props: ModelledSeroprevalenceByWhoRegionGraphProps) => {
  const { dataPointsForWhoRegions } = useContext(ModelledSarsCov2SeroprevalenceContext);
  const ungroupedDataPoints = dataPointsForWhoRegions.flatMap(({ whoRegion, data }) => data.map((dataPoint) => ({
    whoRegion,
    xAxisValue: dataPoint.xAxisValue,
    rawYAxisValue: dataPoint.rawYAxisValue,
    modelledYAxisValue: dataPoint.modelledYAxisValue,
  })));

  return (
    <LineChartWithBestFitCurveAndScatterPoints
      graphId="modelled-sc2-seroprevalence-by-who-region"
      data={ungroupedDataPoints}
      xAxisValueToLabel={(xAxisValue) => monthCountToMonthYearString(xAxisValue)}
      primaryGroupingFunction={(dataPoint) => dataPoint.whoRegion}
      primaryGroupingSortFunction={(whoRegionA, whoRegionB) => whoRegionA > whoRegionB ? 1 : -1}
      getLineColour={(whoRegion) => barColoursForWhoRegions[whoRegion] ?? generateRandomColour()}
      percentageFormattingEnabled={true}
      legendConfiguration={LegendConfiguration.RIGHT_ALIGNED}
    />
  );
}
