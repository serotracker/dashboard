import { useMemo, useEffect } from "react";
import { SplitTimeBucketedBarChart } from "@/components/customs/visualizations/split-time-bucketed-bar-chart";
import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import uniqBy from "lodash/uniqBy";
import { parseISO } from "date-fns";

interface HumanCasesSummaryByRegionProps<TRegion extends string> {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  regionGroupingFunction: (dataPoint: FaoMersEvent) => TRegion | undefined;
  regionToBarColour: (region: TRegion) => string;
  regionToChartTitle: (region: TRegion) => string;
  setNumberOfPagesAvailable: (newNumberOfPagesAvailable: number) => void;
  currentPageIndex: number;
}

export const HumanCasesSummaryByRegion = <TRegion extends string>(props: HumanCasesSummaryByRegionProps<TRegion>) => {
  const { data, regionGroupingFunction, regionToBarColour, regionToChartTitle, setNumberOfPagesAvailable, currentPageIndex } = props;

  const events = useMemo(() => data
    .filter((dataPoint): dataPoint is FaoMersEvent => dataPoint.__typename === 'AnimalMersEvent' || dataPoint.__typename === 'HumanMersEvent')
    .filter((dataPoint) => dataPoint.__typename === 'HumanMersEvent' && dataPoint.humansAffected > 0)
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

  const numberOfPagesAvailable = useMemo(() => {
    const numberOfGraphs = uniqBy(events, (event) => event.region).length;

    return Math.ceil(numberOfGraphs / 6)
  }, [ events ]);

  useEffect(() => {
    setNumberOfPagesAvailable(numberOfPagesAvailable);
  }, [ numberOfPagesAvailable, setNumberOfPagesAvailable ])

  return (
    <SplitTimeBucketedBarChart
      graphId='human-cases-summary-by-region'
      data={events}
      primaryGroupingFunction={(event) => event.region}
      primaryGroupingSortFunction={(regionA, regionB) => regionA > regionB ? 1 : -1}
      currentPageIndex={currentPageIndex}
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
        if(dataPoint.__typename === 'HumanMersEvent') {
          return accumulator + dataPoint.humansAffected;
        }

        return accumulator;
      }, 0)}
    />
  )
}