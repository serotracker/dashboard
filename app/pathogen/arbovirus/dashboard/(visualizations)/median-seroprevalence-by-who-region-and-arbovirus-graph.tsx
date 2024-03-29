import { useContext } from "react";
import { SplitBarChart } from "./split-bar-chart";
import { ArboContext } from "@/contexts/arbo-context/arbo-context";
import { arbovirusesSF, convertArboSFtoArbo, median } from "./recharts";
import { barColoursForArboviruses, sortArboviruses } from "./rechart-utils";

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
      getBarValue={(data) => parseFloat(median(data.map((dataPoint) => dataPoint.seroprevalence * 100)).toFixed(1))}
      getBarColour={(primaryKey) => barColoursForArboviruses[primaryKey]}
      tickSlantOptions={{ slantValue: 35 }}
      subgraphSettings={{
        tooltipLabel: 'median',
        marginBottom: 40
      }}
    />
  );
};
