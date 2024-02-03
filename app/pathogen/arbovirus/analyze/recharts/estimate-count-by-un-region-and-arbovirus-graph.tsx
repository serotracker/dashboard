import { useContext } from "react";
import {
  LegendConfiguration,
  SlantedTick,
  arbovirusesSF,
  convertArboSFtoArbo,
} from "../recharts";
import { ArboContext } from "@/contexts/arbo-context";
import {
  typedGroupBy,
  typedObjectEntries,
  typedObjectFromEntries,
} from "@/lib/utils";
import { UNRegion, getLabelForUNRegion } from "@/lib/un-regions";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { pathogenColors } from "../../dashboard/(map)/ArbovirusMap";

interface WhoRegionAndArbovirusBarInput {
  legendConfiguration: LegendConfiguration;
}

export function EstimateCountByUnRegionAndArbovirusGraph(input: WhoRegionAndArbovirusBarInput) {
  const state = useContext(ArboContext);
  const legendProps =
    input.legendConfiguration === LegendConfiguration.RIGHT_ALIGNED
      ? {
          layout: "vertical" as const,
          verticalAlign: "middle" as const,
          align: "right" as const,
          wrapperStyle: { right: -10 },
        }
      : {
          layout: "horizontal" as const,
          verticalAlign: "bottom" as const,
          align: "center" as const,
          wrapperStyle: {
            paddingTop: 40,
            bottom: 0
          }
        };
  
  const dataToUse = state.filteredData.filter((dataPoint) => !!dataPoint.unRegion);
  
  const rechartsData = typedObjectEntries(
    typedGroupBy(
      dataToUse,
      (dataPoint) => dataPoint.unRegion as UNRegion
    )
  ).map(([key, value]) => {
    const unRegion = getLabelForUNRegion(key);
    const dataGroupedByArbovirus = typedObjectFromEntries(
      typedObjectEntries(
        typedGroupBy(value, (dataPoint) => dataPoint.pathogen as arbovirusesSF)
      ).map(([key, value]) => [convertArboSFtoArbo(key), value.length])
    );

    return {
      unRegion,
      ...dataGroupedByArbovirus,
    };
  }).sort((a, b) => a.unRegion < b.unRegion ? 1 : -1);

  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <BarChart
        width={730}
        height={250}
        data={rechartsData}
        margin={{
          top: 0,
          right: 0,
          left: 20,
          bottom: 60
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="unRegion"
          interval={0}
          tick={(props) => SlantedTick({...props, tickSlant: 20 })}
        />
        <YAxis />
        <Tooltip itemStyle={{ color: "black" }} />
        <Legend {...legendProps} />
        <Bar dataKey="Zika" stackId="a" fill={pathogenColors.ZIKV} />
        <Bar dataKey="Dengue" stackId="a" fill={pathogenColors.DENV} />
        <Bar dataKey="Chikungunya" stackId="a" fill={pathogenColors.CHIKV} />
        <Bar dataKey="Yellow Fever" stackId="a" fill={pathogenColors.YF} />
        <Bar dataKey="West Nile" stackId="a" fill={pathogenColors.WNV} />
        <Bar dataKey="Mayaro" stackId="a" fill={pathogenColors.MAYV} />
      </BarChart>
    </ResponsiveContainer>
  );
}
