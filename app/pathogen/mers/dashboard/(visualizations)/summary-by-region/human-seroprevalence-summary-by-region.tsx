import { median } from "@/app/pathogen/arbovirus/dashboard/(visualizations)/recharts";
import { SplitTimeBucketedBarChart } from "@/components/customs/visualizations/split-time-bucketed-bar-chart";
import { HumanMersSeroprevalenceEstimate, MersEstimate, MersSeroprevalenceEstimate, isHumanMersSeroprevalenceEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { parseISO } from "date-fns";
import uniqBy from "lodash/uniqBy";
import { useMemo, useEffect } from "react";

interface HumanSeroprevalenceSummaryByRegionProps<TRegion extends string> {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  selectedSampleFrame: string | undefined;
  regionGroupingFunction: (dataPoint: MersEstimate) => TRegion | undefined;
  regionToBarColour: (region: TRegion, regionIndex: number) => string;
  regionToChartTitle: (region: TRegion) => string;
  setNumberOfPagesAvailable: (newNumberOfPagesAvailable: number) => void;
  currentPageIndex: number;
}

export const HumanSeroprevalenceSummaryByRegion = <TRegion extends string>(props: HumanSeroprevalenceSummaryByRegionProps<TRegion>) => {
  const { data, selectedSampleFrame, regionGroupingFunction, regionToBarColour, regionToChartTitle, setNumberOfPagesAvailable, currentPageIndex } = props;

  const estimates = useMemo(() => data
    .filter((dataPoint): dataPoint is HumanMersSeroprevalenceEstimate => 'primaryEstimateInfo' in dataPoint && isHumanMersSeroprevalenceEstimate(dataPoint))
    .filter((dataPoint) => !selectedSampleFrame || dataPoint.primaryEstimateInfo.sampleFrame === selectedSampleFrame)
    .map((estimate) => ({
      ...estimate,
      region: regionGroupingFunction(estimate),
      samplingStartDate: estimate.primaryEstimateInfo.samplingStartDate,
      samplingEndDate: estimate.primaryEstimateInfo.samplingEndDate
    }))
    .filter((estimate): estimate is Omit<typeof estimate, 'region'|'samplingStartDate'|'samplingEndDate'> & {
      region: NonNullable<typeof estimate['region']>;
      samplingStartDate: NonNullable<typeof estimate['samplingStartDate']>;
      samplingEndDate: NonNullable<typeof estimate['samplingEndDate']>;
    } => !!estimate.region && !!estimate.samplingStartDate && !!estimate.samplingEndDate)
  , [ data, regionGroupingFunction, selectedSampleFrame ]);

  const numberOfPagesAvailable = useMemo(() => {
    const numberOfGraphs = uniqBy(estimates, (estimate) => estimate.region).length;

    return Math.ceil(numberOfGraphs / 6)
  }, [ estimates ]);

  useEffect(() => {
    setNumberOfPagesAvailable(numberOfPagesAvailable);
  }, [ numberOfPagesAvailable, setNumberOfPagesAvailable ])

  return (
    <SplitTimeBucketedBarChart
      graphId='seroprevalence-summary-by-region'
      data={estimates}
      primaryGroupingFunction={(estimate) => estimate.region}
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
      getIntervalStartDate={(dataPoint) => parseISO(dataPoint.samplingStartDate)}
      getIntervalEndDate={(dataPoint) => parseISO(dataPoint.samplingEndDate)}
      getBarColour={(region, regionIndex) => regionToBarColour(region, regionIndex)}
      getChartTitle={(region) => regionToChartTitle(region)}
      percentageFormattingEnabled={true}
      getBarName={() => 'Human Median Seroprevalence'}
      transformOutputValue={(data) => median(data.map((dataPoint) => dataPoint.primaryEstimateInfo.seroprevalence * 100))}
    />
  );
}