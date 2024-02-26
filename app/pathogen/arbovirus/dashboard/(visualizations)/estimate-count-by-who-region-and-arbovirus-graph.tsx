import { useContext } from "react";
import {
  arbovirusesSF,
  convertArboSFtoArbo,
} from "./recharts";
import { ArboContext } from "@/contexts/arbo-context";
import { LegendConfiguration, StackedBarChart } from "./stacked-bar-chart";
import { barColoursForArboviruses, sortArboviruses } from "./rechart-utils";

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
      data={state.filteredData.filter((dataPoint) => !!dataPoint.unRegion)}
      primaryGroupingFunction={(dataPoint) => dataPoint.whoRegion}
      secondaryGroupingFunction={(dataPoint) =>
        convertArboSFtoArbo(dataPoint.pathogen as arbovirusesSF)
      }
      secondaryGroupingSortFunction={sortArboviruses}
      getBarValue={(data) => data.length}
      legendConfiguration={props.legendConfiguration}
      getBarColour={(secondaryKey) => barColoursForArboviruses[secondaryKey]}
    />
  );
}
