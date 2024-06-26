import { useContext } from "react";
import { SplitBarChart } from "../../../../../components/customs/visualizations/split-bar-chart";
import { convertArboSFtoArbo, median } from "./recharts";
import { barColoursForArboviruses, sortArboviruses } from "./rechart-utils";
import { getLabelForUNRegion } from "@/lib/un-regions";
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";

export const MedianSeroprevalenceByUnRegionAndArbovirusGraph = () => {
  const state = useContext(ArboContext);

  return (
    <SplitBarChart
      graphId="median-seroprevalence-by-un-region"
      data={state.filteredData.filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'unRegion'> & {unRegion: NonNullable<typeof dataPoint['unRegion']>} => !!dataPoint.unRegion)}
      primaryGroupingFunction={(dataPoint) =>
        convertArboSFtoArbo(dataPoint.pathogen)
      }
      primaryGroupingSortFunction={sortArboviruses}
      secondaryGroupingFunction={(dataPoint) =>
        getLabelForUNRegion(dataPoint.unRegion)
      }
      secondaryGroupingSortFunction={(unRegionA, unRegionB) =>
        unRegionA.length > unRegionB.length ? 1 : -1
      }
      transformOutputValue={({ data }) => parseFloat(median(data.map((dataPoint) => dataPoint.seroprevalence * 100)).toFixed(1))}
      getBarColour={(primaryKey) => barColoursForArboviruses[primaryKey]}
      xAxisTickSettings={{ slantValue: 20 }}
      subgraphSettings={{
        tooltipLabel: 'median',
        marginBottom: 70,
      }}
    />
  );
};
