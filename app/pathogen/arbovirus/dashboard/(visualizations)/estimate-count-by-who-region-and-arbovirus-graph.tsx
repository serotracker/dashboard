import { convertArboSFtoArbo } from "./recharts";
import { LegendConfiguration, StackedBarChart } from "../../../../../components/customs/visualizations/stacked-bar-chart";
import { barColoursForArboviruses, sortArboviruses } from "./rechart-utils";
import { useGroupedArbovirusEstimateData } from "../../use-arbo-primary-estimate-data";

interface EstimateCountByWHORegionAndArbovirusGraphProps {
  legendConfiguration: LegendConfiguration;
}

export const EstimateCountByWHORegionAndArbovirusGraph = (
  props: EstimateCountByWHORegionAndArbovirusGraphProps
) => {
  const { primaryEstimateData: state } = useGroupedArbovirusEstimateData();

  return (
    <StackedBarChart
      graphId='estimate-count-by-who-region-and-arbovirus-graph'
      data={state.filteredData
        .filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'whoRegion'> & {whoRegion: NonNullable<typeof dataPoint['whoRegion']>} => !!dataPoint.whoRegion)
        .filter((dataPoint) => dataPoint.isPrimaryEstimate)
      }
      primaryGroupingFunction={(dataPoint) => dataPoint.whoRegion}
      secondaryGroupingFunction={(dataPoint) => convertArboSFtoArbo(dataPoint.pathogen)}
      secondaryGroupingSortFunction={sortArboviruses}
      transformOutputValue={({ data }) => data.length}
      legendConfiguration={props.legendConfiguration}
      getBarColour={(secondaryKey) => barColoursForArboviruses[secondaryKey]}
    />
  );
}
