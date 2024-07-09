import { median } from "@/app/pathogen/arbovirus/dashboard/(visualizations)/recharts";
import { SplitTimeBucketedBarChart } from "@/components/customs/visualizations/split-time-bucketed-bar-chart";
import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { WhoRegion } from "@/gql/graphql";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import parseISO from "date-fns/parseISO";
import { useMemo } from "react";

interface SeroprevalenceSummaryByWhoRegionProps {
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

export const SeroprevalenceSummaryByWhoRegion = (props: SeroprevalenceSummaryByWhoRegionProps) => {
  const { data } = props;

  const estimates = useMemo(() => data
    .filter((dataPoint): dataPoint is MersEstimate => dataPoint.__typename === 'MersEstimate')
    .filter((estimate): estimate is Omit<typeof estimate, 'whoRegion'> & {whoRegion: NonNullable<typeof estimate['whoRegion']>} => !!estimate.whoRegion)
    .map((estimate) => ({
      ...estimate,
      //TODO remove these when we have real data
      samplingStartDate: '2024-07-09T00:28:53Z',
      samplingEndDate: '2024-07-09T00:28:53Z',
      seroprevalence: 0.1
    }))
  , [ data ]);

  return (
    <SplitTimeBucketedBarChart
      graphId='seroprevalence-summary-by-who-region'
      data={estimates}
      primaryGroupingFunction={(estimate) => estimate.whoRegion}
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
      getBarColour={(whoRegion) => barColoursForWhoRegions[whoRegion]}
      getChartTitle={(whoRegion) => whoRegion}
      percentageFormattingEnabled={true}
      getBarName={() => 'Median Seroprevalence'}
      transformOutputValue={(data) => median(data.map((dataPoint) => dataPoint.seroprevalence * 100))}
    />
  );
}