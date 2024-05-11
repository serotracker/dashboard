import { useContext } from "react";
import { SplitBarChart } from "../../../../../components/customs/visualizations/split-bar-chart";
import { arbovirusesSF, convertArboSFtoArbo, median } from "./recharts";
import { barColoursForArboviruses, sortArboviruses } from "./rechart-utils";
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";

export const MedianSeroprevalenceByWHORegionAndArbovirusGraph = () => {
  const state = useContext(ArboContext);

  return (
    <SplitBarChart
      graphId="median-seroprevalence-by-who-region"
      data={state.filteredData.filter((dataPoint) => !!dataPoint.whoRegion)}
      primaryGroupingFunction={(dataPoint) =>
        convertArboSFtoArbo(dataPoint.pathogen as arbovirusesSF)
      }
      primaryGroupingSortFunction={sortArboviruses}
      secondaryGroupingFunction={(dataPoint) => dataPoint.whoRegion}
      secondaryGroupingSortFunction={(whoRegionA, whoRegionB) =>
        whoRegionA > whoRegionB ? 1 : -1
      }
      transformOutputValue={(data) => parseFloat(median(data.map((dataPoint) => dataPoint.seroprevalence * 100)).toFixed(1))}
      getBarColour={(primaryKey) => barColoursForArboviruses[primaryKey]}
      xAxisTickSettings={{ slantValue: 35 }}
      subgraphSettings={{
        tooltipLabel: 'median',
        marginBottom: 40
      }}
    />
  );
};
