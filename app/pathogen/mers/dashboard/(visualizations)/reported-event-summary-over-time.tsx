import { useMemo } from "react";
import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import assertNever from "assert-never";
import { parseISO } from "date-fns";
import { SplitTimeBucketedBarChart } from "@/components/customs/visualizations/split-time-bucketed-bar-chart";

interface ReportedEventSummaryOverTimeProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
}

const typenameToLabel = {
  ['AnimalMersEvent']: 'Animal MERS Events',
  ['HumanMersEvent']: 'Human MERS Events'
}

const typenameToLineColour = {
  ['AnimalMersEvent']: '#ed8ac7',
  ['HumanMersEvent']: '#8abded'
}

export const ReportedEventSummaryOverTime = (props: ReportedEventSummaryOverTimeProps) => {
  const { data } = props;

  const consideredData = useMemo(() => data
    .filter((dataPoint: MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry): dataPoint is FaoMersEvent => {
      return dataPoint.__typename === 'AnimalMersEvent' || dataPoint.__typename === 'HumanMersEvent'
    })
  , [ data ]);

  return (
    <SplitTimeBucketedBarChart
      graphId='reported-event-summary-over-time'
      data={consideredData}
      primaryGroupingFunction={(dataPoint) => dataPoint.__typename}
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
      getIntervalStartDate={(dataPoint) => parseISO(dataPoint.reportDate)}
      getIntervalEndDate={(dataPoint) => parseISO(dataPoint.reportDate)}
      getBarColour={(__typename) => typenameToLineColour[__typename]}
      percentageFormattingEnabled={false}
      getBarName={(__typename) => typenameToLabel[__typename]}
      getChartTitle={(__typename) => typenameToLabel[__typename]}
      transformOutputValue={(data) => data.reduce((accumulator, dataPoint) => {
        if(dataPoint.__typename === 'HumanMersEvent') {
          return accumulator + dataPoint.humansAffected;
        }
        if(dataPoint.__typename === 'AnimalMersEvent') {
          return accumulator + 1;
        }
        assertNever(dataPoint);
      }, 0)}
    />
  )
};