import { median } from "@/app/pathogen/arbovirus/dashboard/(visualizations)/recharts";
import { CustomXAxisTick } from "@/components/customs/visualizations/custom-x-axis-tick";
import { SplitTimeBucketedBarChart } from "@/components/customs/visualizations/split-time-bucketed-bar-chart";
import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { useIsLargeScreen } from "@/hooks/useIsLargeScreen";
import { groupDataPointsIntoTimeBuckets } from "@/lib/time-bucket-grouping";
import { typedGroupBy, typedObjectEntries, typedObjectFromEntries, typedObjectKeys } from "@/lib/utils";
import assertNever from "assert-never";
import clsx from "clsx";
import parseISO from "date-fns/parseISO";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface MedianSeroprevalenceOverTimeProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
}

const typenameToLabel = {
  ['MersEstimate']: 'MERS Seroprevalence',
}

const typenameToLineColour = {
  ['MersEstimate']: '#e7ed8a',
}

export const MedianSeroprevalenceOverTime = (props: MedianSeroprevalenceOverTimeProps) => {
  const { data } = props;

  const consideredData = useMemo(() => data
    .filter((dataPoint: MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry): dataPoint is MersEstimate => {
      return dataPoint.__typename === 'MersEstimate'
    })
    .map((dataPoint) => ({
      ...dataPoint,
      //TODO remove these when we have real data
      samplingStartDate: '2024-07-09T00:28:53Z',
      samplingEndDate: '2024-07-09T00:28:53Z',
      seroprevalence: 0.1
    }))
  , [ data ]);

  return (
    <SplitTimeBucketedBarChart
      graphId='median-seroprevalence-over-time'
      data={consideredData}
      primaryGroupingFunction={(dataPoint) => dataPoint.__typename}
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
      getIntervalStartDate={(dataPoint) => parseISO(dataPoint.samplingStartDate)}
      getIntervalEndDate={(dataPoint) => parseISO(dataPoint.samplingEndDate)}
      getBarColour={(__typename) => typenameToLineColour[__typename]}
      percentageFormattingEnabled={true}
      getBarName={(__typename) => typenameToLabel[__typename]}
      getChartTitle={(__typename) => typenameToLabel[__typename]}
      transformOutputValue={(data) => median(data.map((dataPoint) => dataPoint.seroprevalence * 100))}
    />
  );
};