import { useContext } from "react";
import {
  arbovirusesSF,
  convertArboSFtoArbo,
} from "./recharts";
import { UNRegion, getLabelForUNRegion } from "@/lib/un-regions";
import { LegendConfiguration, StackedBarChart } from "../../../../../components/customs/visualizations/stacked-bar-chart";
import { barColoursForArboviruses, sortArboviruses } from "./rechart-utils";
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";

interface EstimateCountByUnRegionAndArbovirusGraphProps {
  legendConfiguration: LegendConfiguration;
}

export const EstimateCountByUnRegionAndArbovirusGraph = (
  props: EstimateCountByUnRegionAndArbovirusGraphProps
) => {
  const state = useContext(ArboContext);

  return (
    <StackedBarChart
      graphId='estimate-count-by-un-region-and-arbovirus-graph'
      data={state.filteredData.filter((dataPoint) => !!dataPoint.unRegion)}
      primaryGroupingFunction={(dataPoint) =>
        getLabelForUNRegion(dataPoint.unRegion as UNRegion)
      }
      primaryGroupingSortFunction={(unRegionA, unRegionB) =>
        unRegionA.length > unRegionB.length ? 1 : -1
      }
      secondaryGroupingFunction={(dataPoint) =>
        convertArboSFtoArbo(dataPoint.pathogen as arbovirusesSF)
      }
      secondaryGroupingSortFunction={sortArboviruses}
      transformOutputValue={(data) => data.length}
      legendConfiguration={props.legendConfiguration}
      xAxisTickSettings={{ slantValue: 20 }}
      getBarColour={(secondaryKey) => barColoursForArboviruses[secondaryKey]}
    />
  );
}
