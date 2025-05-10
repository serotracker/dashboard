import { convertArboSFtoArbo } from "./recharts";
import { getLabelForUNRegion } from "@/lib/un-regions";
import { LegendConfiguration, StackedBarChart } from "../../../../../components/customs/visualizations/stacked-bar-chart";
import { barColoursForArboviruses, sortArboviruses } from "./rechart-utils";
import { useGroupedArbovirusEstimateData } from "../../use-arbo-primary-estimate-data";

interface EstimateCountByUnRegionAndArbovirusGraphProps {
  legendConfiguration: LegendConfiguration;
}

export const EstimateCountByUnRegionAndArbovirusGraph = (
  props: EstimateCountByUnRegionAndArbovirusGraphProps
) => {
  const { primaryEstimateData: state } = useGroupedArbovirusEstimateData();

  return (
    <StackedBarChart
      graphId='estimate-count-by-un-region-and-arbovirus-graph'
      data={state.filteredData
        .filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'unRegion'> & {unRegion: NonNullable<typeof dataPoint['unRegion']>} => !!dataPoint.unRegion)
      }
      primaryGroupingFunction={(dataPoint) =>
        getLabelForUNRegion(dataPoint.unRegion)
      }
      primaryGroupingSortFunction={(unRegionA, unRegionB) =>
        unRegionA.length > unRegionB.length ? 1 : -1
      }
      secondaryGroupingFunction={(dataPoint) =>
        convertArboSFtoArbo(dataPoint.pathogen)
      }
      secondaryGroupingSortFunction={sortArboviruses}
      transformOutputValue={({ data }) => data.length}
      legendConfiguration={props.legendConfiguration}
      xAxisTickSettings={{ slantValue: 20 }}
      getBarColour={(secondaryKey) => barColoursForArboviruses[secondaryKey]}
    />
  );
}
