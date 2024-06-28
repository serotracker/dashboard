import { useContext } from "react";
import { convertArboSFtoArbo } from "./recharts";
import { LegendConfiguration, StackedBarChart } from "../../../../../components/customs/visualizations/stacked-bar-chart";
import { barColoursForArboviruses, sortArboviruses } from "./rechart-utils";
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";

interface EstimateCountByWHORegionAndArbovirusGraphProps {
  legendConfiguration: LegendConfiguration;
}

export const EstimateCountByWHORegionAndArbovirusGraph = (
  props: EstimateCountByWHORegionAndArbovirusGraphProps
) => {
  const state = useContext(ArboContext);

  return (
    <StackedBarChart
      graphId='estimate-count-by-who-region-and-arbovirus-graph'
      data={state.filteredData.filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'whoRegion'> & {whoRegion: NonNullable<typeof dataPoint['whoRegion']>} => !!dataPoint.whoRegion)}
      primaryGroupingFunction={(dataPoint) => dataPoint.whoRegion}
      secondaryGroupingFunction={(dataPoint) => convertArboSFtoArbo(dataPoint.pathogen)}
      secondaryGroupingSortFunction={sortArboviruses}
      transformOutputValue={({ data }) => data.length}
      legendConfiguration={props.legendConfiguration}
      getBarColour={(secondaryKey) => barColoursForArboviruses[secondaryKey]}
    />
  );
}
