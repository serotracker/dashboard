"use client";
import React, { useContext, useMemo } from "react";
import { parseISO } from "date-fns";
import { convertArboSFtoArbo, median } from "./recharts";
import { pathogenColors } from "../(map)/ArbovirusMap";
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { SplitTimeBucketedBarChart } from "@/components/customs/visualizations/split-time-bucketed-bar-chart";

export const ChangeInMedianSeroprevalenceOverTimeGraph = (): React.ReactNode => {
  const { filteredData }= useContext(ArboContext);

  const consideredData = useMemo(() => filteredData.filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'sampleStartDate'|'sampleEndDate'> & {
    sampleStartDate: NonNullable<(typeof dataPoint)['sampleStartDate']>
    sampleEndDate: NonNullable<(typeof dataPoint)['sampleEndDate']>
  } => !!dataPoint.sampleStartDate && !!dataPoint.sampleEndDate), [ filteredData ])

  return (
    <SplitTimeBucketedBarChart
      graphId='change-in-med-sero-prev'
      data={consideredData}
      primaryGroupingFunction={(dataPoint) => dataPoint.pathogen}
      currentPageIndex={0}
      bucketingConfiguration={{
        desiredBucketCount: 10,
        validBucketSizes: [
          { years: 5 },
          { years: 4 },
          { years: 3 },
          { years: 2 },
          { years: 1 }
        ]
      }}
      getIntervalStartDate={(dataPoint) => parseISO(dataPoint.sampleStartDate)}
      getIntervalEndDate={(dataPoint) => parseISO(dataPoint.sampleEndDate)}
      getBarColour={(arbovirus) => pathogenColors[arbovirus]}
      percentageFormattingEnabled={true}
      getBarName={(arbovirus) => 'Median Seroprevalence'}
      getChartTitle={(arbovirus) => convertArboSFtoArbo(arbovirus)}
      transformOutputValue={(data) => median(data.map((dataPoint) => dataPoint.seroprevalence * 100))}
    />
  )
};
