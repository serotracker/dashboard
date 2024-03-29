import { useContext } from "react";
import { SplitBarChart } from "./split-bar-chart";
import { ArboContext } from "@/contexts/arbo-context/arbo-context";
import { arbovirusesSF, convertArboSFtoArbo, median } from "./recharts";
import { barColoursForArboviruses, sortArboviruses } from "./rechart-utils";
import { UNRegion, getLabelForUNRegion } from "@/lib/un-regions";

export const MedianSeroprevalenceByUnRegionAndArbovirusGraph = () => {
  const state = useContext(ArboContext);

  return (
    <SplitBarChart
      graphId="median-seroprevalence-by-un-region"
      data={state.filteredData.filter((dataPoint) => !!dataPoint.unRegion)}
      primaryGroupingFunction={(dataPoint) =>
        convertArboSFtoArbo(dataPoint.pathogen as arbovirusesSF)
      }
      primaryGroupingSortFunction={sortArboviruses}
      secondaryGroupingFunction={(dataPoint) =>
        getLabelForUNRegion(dataPoint.unRegion as UNRegion)
      }
      secondaryGroupingSortFunction={(unRegionA, unRegionB) =>
        unRegionA.length > unRegionB.length ? 1 : -1
      }
      getBarValue={(data) => parseFloat(median(data.map((dataPoint) => dataPoint.seroprevalence * 100)).toFixed(1))}
      getBarColour={(primaryKey) => barColoursForArboviruses[primaryKey]}
      tickSlantOptions={{ slantValue: 20 }}
      subgraphSettings={{
        tooltipLabel: 'median',
        marginBottom: 70,
      }}
    />
  );
};
