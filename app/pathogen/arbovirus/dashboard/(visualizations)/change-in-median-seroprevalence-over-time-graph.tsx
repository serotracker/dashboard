"use client";

import React, { useContext } from "react";
import { parseISO } from "date-fns";
import {
  typedGroupBy,
  typedObjectEntries,
  typedObjectFromEntries,
  typedObjectKeys,
} from "@/lib/utils";
import { TimeInterval, doTimeIntervalsOverlap } from "@/lib/date-utils";
import clsx from "clsx";
import { convertArboSFtoArbo, median } from "./recharts";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { pathogenColors } from "../(map)/ArbovirusMap";
import { useIsLargeScreen } from "@/hooks/useIsLargeScreen";
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { CustomXAxisTick } from "@/components/customs/visualizations/custom-x-axis-tick";
import { groupDataPointsIntoTimeBuckets } from "@/lib/time-bucket-grouping";

export const ChangeInMedianSeroprevalenceOverTimeGraph = (): React.ReactNode => {
  const state = useContext(ArboContext);

  const dataGroupedByArbovirus = typedGroupBy(
    state.filteredData,
    (dataPoint) => dataPoint.pathogen
  );

  const dataGroupedByArbovirusThenByTimeBucket = typedObjectFromEntries(
    typedObjectEntries(dataGroupedByArbovirus).map(
      ([arbovirus, dataPointsForAParticularArbovirus]) => [
        arbovirus,
        groupDataPointsIntoTimeBuckets({
          dataPoints: dataPointsForAParticularArbovirus
            .filter((dataPoint):
              dataPoint is Omit<typeof dataPoint, 'sampleStartDate'|'sampleEndDate'> & {
                sampleStartDate: NonNullable<(typeof dataPoint)['sampleStartDate']>
                sampleEndDate: NonNullable<(typeof dataPoint)['sampleEndDate']>
              } => !!dataPoint.sampleStartDate && !!dataPoint.sampleEndDate)
            .map((dataPoint) => ({
              ...dataPoint,
              groupingTimeInterval: {
                intervalStartDate: parseISO(dataPoint.sampleStartDate),
                intervalEndDate: parseISO(dataPoint.sampleEndDate),
              },
            })),
            desiredBucketCount: 10,
            validBucketSizes: [
              { years: 5 },
              { years: 4 },
              { years: 3 },
              { years: 2 },
              { years: 1 }
            ]
        }).groupedDataPoints,
      ]
    )
  );

 const isLargeScreen = useIsLargeScreen();

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-row flex-wrap">
        {typedObjectKeys(dataGroupedByArbovirusThenByTimeBucket).map((arbovirus, index) => {
          const dataForArbovirus = dataGroupedByArbovirusThenByTimeBucket[arbovirus].map(({interval, dataPoints}) => ({
            intervalAsString: interval.intervalStartDate.getFullYear() !== interval.intervalEndDate.getFullYear() ?
              `${interval.intervalStartDate.getFullYear()}-${interval.intervalEndDate.getFullYear()}` :
              `${interval.intervalStartDate.getFullYear()}`,
            dataPoints,
            median: median(dataPoints.map((dataPoint) => dataPoint.seroprevalence * 100))
          }));

          const numberOfSubgraphsDisplayed = Object.keys(dataGroupedByArbovirus).length;

          const width = numberOfSubgraphsDisplayed < 3 ? "w-full" : "w-1/2 lg:w-1/3";
          const height =
            numberOfSubgraphsDisplayed === 1
              ? "h-full"
              : "h-1/3 lg:h-1/2"
            

          return (
            <div
              className={clsx(width, height)}
              key={`change-in-med-sero-prev-${arbovirus}`}
            >
              <p className="w-full text-center ">
                {convertArboSFtoArbo(arbovirus)}
              </p>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  margin={{
                    top: 10,
                    right: 10,
                    left: index % 2 === 0 ? 0 : 40,
                    bottom: 40,
                  }}
                  data={dataForArbovirus}
                  width={500}
                  height={450}
                  barCategoryGap={1}
                  barGap={0}
                >
                  <CartesianGrid />
                  <XAxis
                    dataKey="intervalAsString"
                    interval={0}
                    tick={(props) => CustomXAxisTick({...props, tickSlant: 35 })}
                    hide={!isLargeScreen}
                  />
                  <YAxis
                    domain={[0, 100]}
                    hide={index % 2 != 0}
                    tickFormatter={(tick) => `${tick}%`}
                  />
                  <Bar dataKey="median" fill={pathogenColors[arbovirus]}/>
                  <Tooltip itemStyle={{"color": "black"}} formatter={(value) => `${(value as number).toFixed(2)}%`}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
};
