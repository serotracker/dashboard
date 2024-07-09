import { useMemo } from "react";
import { SplitTimeBucketedBarChart } from "@/components/customs/visualizations/split-time-bucketed-bar-chart";
import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { WhoRegion } from "@/gql/graphql";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import parseISO from "date-fns/parseISO";

interface HumanCasesSummaryByWhoRegionProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
}

const barColoursForWhoRegions: Record<WhoRegion, string> = {
  [WhoRegion.Afr]: "#e15759",
  [WhoRegion.Amr]: "#59a14f",
  [WhoRegion.Emr]: "#f1ce63",
  [WhoRegion.Eur]: "#f28e2b",
  [WhoRegion.Sear]: "#d37295",
  [WhoRegion.Wpr]: "#4e79a7",
};

export const HumanCasesSummaryByWhoRegion = (props: HumanCasesSummaryByWhoRegionProps) => {
  const { data } = props;

  const events = useMemo(() => data
    .filter((dataPoint): dataPoint is FaoMersEvent => dataPoint.__typename === 'AnimalMersEvent' || dataPoint.__typename === 'HumanMersEvent')
    .filter((dataPoint) => dataPoint.__typename === 'HumanMersEvent' && dataPoint.humansAffected > 0)
    .map((event) => {
      const whoRegion = event.whoRegion;

      if(!whoRegion) {
        return undefined;
      }

      return {
        ...event,
        whoRegion
      }
    })
    .filter((event): event is NonNullable<typeof event> => !!event)
  , [ data ]);

  return (
    <SplitTimeBucketedBarChart
      graphId='human-cases-summary-by-who-region'
      data={events}
      primaryGroupingFunction={(event) => event.whoRegion}
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
      getBarColour={(whoRegion) => barColoursForWhoRegions[whoRegion]}
      getBarName={() => 'Reported Confirmed Positive Cases'}
      transformOutputValue={(data) => data.reduce((accumulator, dataPoint) => {
        if(dataPoint.__typename === 'HumanMersEvent') {
          return accumulator + dataPoint.humansAffected;
        }

        return accumulator;
      }, 0)}
    />
  )
}