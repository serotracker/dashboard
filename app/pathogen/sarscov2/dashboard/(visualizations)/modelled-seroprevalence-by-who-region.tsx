import { useContext } from "react";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
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
  scatterPointsVisible: boolean;
  legendConfiguration: LegendConfiguration;
}

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
      scatterPointsVisible={props.scatterPointsVisible}
      xAxisValueToLabel={(xAxisValue) => monthCountToMonthYearString(xAxisValue)}
      primaryGroupingFunction={(dataPoint) => dataPoint.whoRegion}
      primaryGroupingSortFunction={(whoRegionA, whoRegionB) => whoRegionA > whoRegionB ? 1 : -1}
      getLineColour={(whoRegion) => barColoursForWhoRegions[whoRegion] ?? generateRandomColour()}
      percentageFormattingEnabled={true}
      legendConfiguration={LegendConfiguration.RIGHT_ALIGNED}
    />
  );
}
