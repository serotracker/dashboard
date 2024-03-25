import { useContext, useMemo } from "react";
import { ArboContext } from "@/contexts/arbo-context/arbo-context";
import { arbovirusesSF } from "./recharts";
import {
  CartesianGrid,
  ErrorBar,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Label,
} from "recharts";
import { groupDataForRecharts } from "./group-data-for-recharts";
import uniq from "lodash/uniq";
import { typedObjectKeys } from "@/lib/utils";
import { ContentType } from "recharts/types/component/Tooltip";

const CountrySeroprevalenceComparisonScatterPlotTooltip: ContentType<string, string> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const seroprevalencePayload = payload.find((element) => element.name === 'seroprevalence')?.payload;

    if(!seroprevalencePayload) {
      return null;
    }

    const seroprevalence = seroprevalencePayload.seroprevalence;
    const seroprevalenceCalculated95CILower = seroprevalencePayload.seroprevalenceCalculated95CILower;
    const seroprevalenceCalculated95CIUpper = seroprevalencePayload.seroprevalenceCalculated95CIUpper;

    return (
      <div className="bg-white p-4">
        <p> Seroprevalence: {seroprevalence}% </p>
        <p> 95% CI: [{seroprevalenceCalculated95CILower}%, {seroprevalenceCalculated95CIUpper}%] </p>
      </div>
    );
  }

  return null;
};

export const CountrySeroprevalenceComparisonScatterPlot = () => {
  const state = useContext(ArboContext);

  const stateFilteredDataWithEstimateNumbers = useMemo(
    () =>
      state.filteredData
        .filter(
          (dataPoint) =>
            dataPoint.seroprevalenceCalculated95CILower &&
            dataPoint.seroprevalenceCalculated95CIUpper
        )
        .sort(
          (dataPointA, dataPointB) =>
            dataPointA.seroprevalence - dataPointB.seroprevalence
        )
        .map((dataPoint, index) => ({
          ...dataPoint,
          estimateNumber: index + 1,
        }))
        .map((dataPoint) => ({
          ...dataPoint,
          seroprevalence: parseFloat(
            (dataPoint.seroprevalence * 100).toFixed(1)
          ),
          seroprevalenceCalculated95CILower: parseFloat(
            (dataPoint.seroprevalenceCalculated95CILower * 100).toFixed(1)
          ),
          seroprevalenceCalculated95CIUpper: parseFloat(
            (dataPoint.seroprevalenceCalculated95CIUpper * 100).toFixed(1)
          ),
          seroprevalenceError: [
            parseFloat(
              (
                dataPoint.seroprevalence * 100 -
                dataPoint.seroprevalenceCalculated95CILower * 100
              ).toFixed(1)
            ),
            parseFloat(
              (
                dataPoint.seroprevalenceCalculated95CIUpper * 100 -
                dataPoint.seroprevalence * 100
              ).toFixed(1)
            ),
          ],
        })),
    [state.filteredData]
  );

  const { rechartsData } = useMemo(
    () =>
      groupDataForRecharts({
        data: stateFilteredDataWithEstimateNumbers,
        primaryGroupingFunction: (dataPoint) =>
          dataPoint.pathogen as arbovirusesSF,
        primaryGroupingSortFunction: (pathogenA, pathogenB) =>
          pathogenA !== pathogenB ? (pathogenA < pathogenB ? -1 : 1) : 0,
        secondaryGroupingFunction: (dataPoint) => dataPoint.country as string,
        secondaryGroupingSortFunction: (countryA, countryB) =>
          countryA !== countryA ? (countryA < countryB ? -1 : 1) : 0,
        transformOutputValue: (data) => data,
      }),
    [stateFilteredDataWithEstimateNumbers]
  );

  const pathogensAvailable = useMemo(
    () => uniq(rechartsData.map((dataPoint) => dataPoint.primaryKey)),
    [rechartsData]
  );
  const countriesAvailable = useMemo(
    () =>
      uniq(
        rechartsData.flatMap((dataPoint) =>
          typedObjectKeys(dataPoint).filter((value) => value !== "primaryKey")
        )
      ),
    [rechartsData]
  );

  if (pathogensAvailable.length > 1) {
    return (
      <div>
        <p>
          This graph cannot be shown when the data contains more than one
          arbovirus. If you&apos;re interested in generating this graph, please use
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
          countries. If you&apos;re interested in generating this graph, please use
          the filter to the left to filter out data.
        </p>
      </div>
    );
  }

  const dataGroupedByCountry =
    rechartsData[0] ?? countriesAvailable.map((country) => ({ [country]: [] }));

  return (
    <div className="w-full h-full flex">
      {countriesAvailable.map((country, index) => (
        <ResponsiveContainer
          width={countriesAvailable.length === 1 ? "100%" : "50%"}
          key={`country-seroprevalence-comparison-scatter-plot-${country}`}
          height={"100%"}
          className={index > 0 ? "pl-4" : ""}
        >
          <ScatterChart
            width={730}
            height={250}
            margin={{ bottom: 40, left: 8, top: 50, right: 10 }}
          >
            <text
              x='50%'
              y={20}
              fill="black"
              textAnchor="middle"
              dominantBaseline="central"
            >
              <tspan fontSize="20">{country}</tspan>
            </text>
            <CartesianGrid />
            <XAxis
              dataKey="seroprevalence"
              type="number"
              domain={[0, 100]}
              unit="%"
            >
              <Label
                value="Seroprevalence"
                offset={-8}
                position="insideBottom"
              />
            </XAxis>
            <YAxis
              dataKey="estimateNumber"
              type="number"
              domain={[0, stateFilteredDataWithEstimateNumbers.length + 1]}
              allowDataOverflow={true}
              label={{
                value: "Study estimates",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={CountrySeroprevalenceComparisonScatterPlotTooltip}/>
            <Scatter data={dataGroupedByCountry[country]} fill="#000000">
              <ErrorBar dataKey="seroprevalenceError" width={0} direction="x" />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      ))}
    </div>
  );
};
