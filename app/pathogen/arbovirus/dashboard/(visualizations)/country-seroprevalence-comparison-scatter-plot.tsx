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
import { useChartArbovirusDropdown } from "./chart-arbovirus-dropdown";

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

  const dataWithCIs = useMemo(() => state.filteredData.filter((dataPoint) => dataPoint.seroprevalenceCalculated95CILower && dataPoint.seroprevalenceCalculated95CIUpper), [state.filteredData])
  const allArbovirusesInData = useMemo(() => uniq(dataWithCIs.map((dataPoint) => dataPoint.pathogen)), [dataWithCIs]);

  const { chartArbovirusDropdown, selectedArbovirus } = useChartArbovirusDropdown({
    possibleArboviruses: allArbovirusesInData
  });

  const dataForArbovirusWithCIs = useMemo(() => dataWithCIs
    .filter((dataPoint) => dataPoint.pathogen === selectedArbovirus)
    .sort((dataPointA, dataPointB) => dataPointA.seroprevalence - dataPointB.seroprevalence)
    .map((dataPoint, index) => ({ ...dataPoint, estimateNumber: index + 1 }))
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
      ]
    })), [dataWithCIs, selectedArbovirus])

  const { rechartsData } = useMemo(
    () =>
      groupDataForRecharts({
        data: dataForArbovirusWithCIs,
        primaryGroupingFunction: (dataPoint) =>
          dataPoint.pathogen as arbovirusesSF,
        primaryGroupingSortFunction: (pathogenA, pathogenB) =>
          pathogenA !== pathogenB ? (pathogenA < pathogenB ? -1 : 1) : 0,
        secondaryGroupingFunction: (dataPoint) => dataPoint.country as string,
        secondaryGroupingSortFunction: (countryA, countryB) =>
          countryA !== countryA ? (countryA < countryB ? -1 : 1) : 0,
        transformOutputValue: (data) => data,
      }),
    [dataForArbovirusWithCIs]
  );

  const dataForArbovirus = useMemo(() => 
    rechartsData.find((element) => element.primaryKey === selectedArbovirus),
    [rechartsData, selectedArbovirus]
  )

  const countriesAvailable = useMemo(
    () => dataForArbovirus ? uniq(typedObjectKeys(dataForArbovirus).filter((value) => value !== "primaryKey")) : [],
    [dataForArbovirus]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-initial">
        {chartArbovirusDropdown}
      </div>
      <div className="w-full flex-auto flex">
        {countriesAvailable.length > 2 ? 
          <div className="h-full w-full p-4">
            <p>
              This graph cannot be shown when the data contains more than two
              countries. If you&apos;re interested in generating this graph, please either
              try a different arbovirus or use the filter to the left to filter out data.
            </p>
          </div>
        :
          countriesAvailable.map((country, index) => (
            <ResponsiveContainer
              width={countriesAvailable.length === 1 ? "100%" : "50%"}
              key={`country-seroprevalence-comparison-scatter-plot-${country}`}
              height={"100%"}
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
                  domain={[0, (dataForArbovirus ? countriesAvailable.flatMap((country) => dataForArbovirus[country]) : []).length + 1]}
                  allowDataOverflow={true}
                  tick={false}
                  label={{
                    value: "Study estimates",
                    angle: -90,
                    offset: 40,
                    position: "insideLeft",
                  }}
                />
                <Tooltip content={CountrySeroprevalenceComparisonScatterPlotTooltip}/>
                <Scatter data={dataForArbovirus ? dataForArbovirus[country] : []} fill="#000000">
                  <ErrorBar dataKey="seroprevalenceError" width={0} direction="x" />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          ))
        }
      </div>
    </div>
  );
};
