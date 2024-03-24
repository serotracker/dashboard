import { useContext, useMemo } from "react";
import { ArboContext } from "@/contexts/arbo-context/arbo-context";
import {
  arbovirusesSF,
} from "./recharts";
import { ScatterChart } from "recharts";
import { groupDataForRecharts } from "./group-data-for-recharts";
import uniq from "lodash/uniq";
import { typedObjectKeys } from "@/lib/utils";

export const CountrySeroprevalenceComparisonScatterPlot = () => {
  const state = useContext(ArboContext);

  const { rechartsData } = useMemo(() => groupDataForRecharts({
    data: state.filteredData,
    primaryGroupingFunction: (dataPoint) => dataPoint.pathogen as arbovirusesSF,
    primaryGroupingSortFunction: (pathogenA, pathogenB) =>
      pathogenA !== pathogenB ? (pathogenA < pathogenB ? -1 : 1) : 0,
    secondaryGroupingFunction: (dataPoint) => dataPoint.country as string,
    secondaryGroupingSortFunction: (countryA, countryB) =>
      countryA !== countryA ? (countryA < countryB ? -1 : 1) : 0,
    transformOutputValue: (data) => data
      .filter((dataPoint) => dataPoint.seroprevalenceCalculated95CILower && dataPoint.seroprevalenceCalculated95CIUpper)
      .map((dataPoint) => ({
        ...dataPoint,
        seroprevalenceError: [
          dataPoint.seroprevalenceCalculated95CILower,
          dataPoint.seroprevalenceCalculated95CIUpper
        ]
      })),
  }), [state.filteredData]);

  const pathogensAvailable = useMemo(() => uniq(
    rechartsData.map((dataPoint) => dataPoint.primaryKey)
  ), [rechartsData]);
  const countriesAvailable = useMemo(() => uniq(
    rechartsData.flatMap((dataPoint) =>
      typedObjectKeys(dataPoint).filter((value) => value !== "primaryKey")
    )
  ), [rechartsData]);

  if (pathogensAvailable.length > 1) {
    return (
      <div>
        <p>
          This graph cannot be shown when the data contains more than one
          arbovirus. If you're interested in generating this graph, please use
          the filter to the left to filter out data.
        </p>
      </div>
    );
  }

  if (countriesAvailable.length > 2) {
    return (
      <div>
        <p>
          This graph cannot be shown when the data contains more than two
          countries. If you're interested in generating this graph, please use
          the filter to the left to filter out data.
        </p>
      </div>
    );
  }

  const pathogen = pathogensAvailable[0];

  return <ScatterChart />;
};
