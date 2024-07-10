import { useMemo } from "react";
import { SplitTimeBucketedBarChart } from "@/components/customs/visualizations/split-time-bucketed-bar-chart";
import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import parseISO from "date-fns/parseISO";

interface AnimalCasesSummaryByRegionProps<TRegion extends string> {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  regionGroupingFunction: (dataPoint: FaoMersEvent) => TRegion | undefined;
  regionToBarColour: (region: TRegion) => string;
  regionToChartTitle: (region: TRegion) => string;
}

export const AnimalCasesSummaryByRegion = <TRegion extends string>(props: AnimalCasesSummaryByRegionProps<TRegion>) => {
  const { data, regionGroupingFunction, regionToBarColour, regionToChartTitle } = props;

  const events = useMemo(() => data
    .filter((dataPoint): dataPoint is FaoMersEvent => dataPoint.__typename === 'AnimalMersEvent' || dataPoint.__typename === 'HumanMersEvent')
    .filter((dataPoint) => dataPoint.__typename === 'AnimalMersEvent')
    .map((event) => {
      const region = regionGroupingFunction(event);

      if(!region) {
        return undefined;
      }

      return {
        ...event,
        region
      }
    })
    .filter((event): event is NonNullable<typeof event> => !!event)
  , [ data, regionGroupingFunction ]);
  
  return (
    <SplitTimeBucketedBarChart
      graphId='animal-cases-summary-by-region'
      data={events}
      primaryGroupingFunction={(event) => event.region}
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
      getBarColour={(region) => regionToBarColour(region)}
      getChartTitle={(region) => regionToChartTitle(region)}
      percentageFormattingEnabled={false}
      getBarName={() => 'Reported Confirmed Positive Cases'}
      transformOutputValue={(data) => data.reduce((accumulator, dataPoint) => {
        return accumulator + 1;
      }, 0)}
    />
  )
}