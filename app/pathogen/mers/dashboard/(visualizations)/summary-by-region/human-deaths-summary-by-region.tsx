import { useMemo } from "react";
import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { WhoRegion } from "@/gql/graphql";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import parseISO from "date-fns/parseISO";
import { SplitTimeBucketedBarChart } from "@/components/customs/visualizations/split-time-bucketed-bar-chart";

interface HumanDeathsSummaryByRegionProps<TRegion extends string> {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  regionGroupingFunction: (dataPoint: FaoMersEvent) => TRegion | undefined;
  regionToBarColour: (region: TRegion) => string;
  regionToChartTitle: (region: TRegion) => string;
}

export const HumanDeathsSummaryByRegion = <TRegion extends string>(props: HumanDeathsSummaryByRegionProps<TRegion>) => {
  const { data, regionGroupingFunction, regionToBarColour, regionToChartTitle } = props;

  const events = useMemo(() => data
    .filter((dataPoint): dataPoint is FaoMersEvent => dataPoint.__typename === 'AnimalMersEvent' || dataPoint.__typename === 'HumanMersEvent')
    .filter((dataPoint) => dataPoint.__typename === 'HumanMersEvent' && dataPoint.humanDeaths > 0)
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
      graphId='human-deaths-summary-by-region'
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
      getBarName={() => 'Reported Deaths'}
      transformOutputValue={(data) => data.reduce((accumulator, dataPoint) => {
        if(dataPoint.__typename === 'HumanMersEvent') {
          return accumulator + dataPoint.humanDeaths;
        }

        return accumulator;
      }, 0)}
    />
  );
}