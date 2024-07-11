import { useMemo } from "react";
import { SplitTimeBucketedBarChart } from "@/components/customs/visualizations/split-time-bucketed-bar-chart";
import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";

interface CamelPopulationOverTimeProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
}

const typenameToLabel = {
  ['YearlyFaoCamelPopulationDataEntry']: 'Estimated Camel Population',
}

const typenameToLineColour = {
  ['YearlyFaoCamelPopulationDataEntry']: '#d37295'
}

export const CamelPopulationOverTime = (props: CamelPopulationOverTimeProps) => {
  const { data } = props;

  const consideredData = useMemo(() => data
    .filter((dataPoint: MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry): dataPoint is FaoYearlyCamelPopulationDataEntry => {
      return dataPoint.__typename === 'YearlyFaoCamelPopulationDataEntry';
    })
  , [ data ]);

  return (
    <SplitTimeBucketedBarChart
      graphId='camel-population-over-time'
      data={consideredData}
      primaryGroupingFunction={(dataPoint) => dataPoint.__typename}
      currentPageIndex={0}
      bucketingConfiguration={{
        desiredBucketCount: 10,
        validBucketSizes: [
          { years: 1 }
        ]
      }}
      getIntervalStartDate={(dataPoint) => new Date(dataPoint.year, 3)}
      getIntervalEndDate={(dataPoint) => new Date(dataPoint.year, 8)}
      getBarColour={(__typename) => typenameToLineColour[__typename]}
      percentageFormattingEnabled={false}
      getBarName={(__typename) => typenameToLabel[__typename]}
      getChartTitle={(__typename) => typenameToLabel[__typename]}
      transformOutputValue={(data) => data.reduce((accumulator, dataPoint) => {
        return accumulator + dataPoint.camelCount;
      }, 0)}
    />
  )
};