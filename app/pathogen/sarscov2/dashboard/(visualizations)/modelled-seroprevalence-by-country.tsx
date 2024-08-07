import { useContext } from "react";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { monthCountToMonthYearString } from "@/lib/time-utils";
import { WhoRegion } from "@/gql/graphql";
import { LineChartWithBestFitCurveAndScatterPoints } from "@/components/customs/visualizations/line-chart-with-best-fit-curve-and-scatter-points";
import { CountryInformationContext } from "@/contexts/pathogen-context/country-information-context";
import { defaultColoursForWhoRegions } from "@/lib/who-regions";

interface ModelledSeroprevalenceByCountryGraphProps {
  data: Array<{
    whoRegion: WhoRegion | undefined;
    countryAlphaThreeCode: string;
    xAxisValue: number;
    rawYAxisValue: number | undefined;
    modelledYAxisValue: number;
  }>
  scatterPointsVisible: boolean;
  legendConfiguration: LegendConfiguration;
}

export const ModelledSeroprevalenceByCountryGraph = (props: ModelledSeroprevalenceByCountryGraphProps) => {
  const { countryAlphaThreeCodeToCountryNameMap } = useContext(CountryInformationContext)

  const firstWhoRegionPresentInData = props.data.at(0)?.whoRegion;
  const colourForAllLines = firstWhoRegionPresentInData
    ? defaultColoursForWhoRegions[firstWhoRegionPresentInData] ?? "#FFFFFF"
    : "#FFFFFF"

  return (
    <LineChartWithBestFitCurveAndScatterPoints
      graphId="modelled-sc2-seroprevalence-by-who-region"
      data={props.data}
      scatterPointsVisible={props.scatterPointsVisible}
      xAxisValueToLabel={(xAxisValue) => monthCountToMonthYearString(xAxisValue)}
      primaryGroupingFunction={(dataPoint) => dataPoint.countryAlphaThreeCode}
      primaryGroupingSortFunction={(countryAlphaThreeCodeA, countryAlphaThreeCodeB) => countryAlphaThreeCodeA > countryAlphaThreeCodeB ? 1 : -1}
      primaryGroupingKeyToLabel={(countryAlphaThreeCode) => countryAlphaThreeCodeToCountryNameMap[countryAlphaThreeCode] ?? countryAlphaThreeCode}
      getLineColour={() => colourForAllLines}
      percentageFormattingEnabled={true}
      legendConfiguration={LegendConfiguration.RIGHT_ALIGNED}
    />
  );
}
