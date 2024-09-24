import { median } from "@/app/pathogen/arbovirus/dashboard/(visualizations)/recharts";
import { SplitTimeBucketedBarChart } from "@/components/customs/visualizations/split-time-bucketed-bar-chart";
import { HumanMersViralEstimate, MersEstimate, isHumanMersViralEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { parseISO } from "date-fns";
import uniqBy from "lodash/uniqBy";
import { useMemo, useEffect } from "react";

interface HumanViralPositivePrevalenceSummaryByRegionProps<TRegion extends string> {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  selectedMacroSampleFrame: string | undefined;
  regionGroupingFunction: (dataPoint: MersEstimate) => TRegion | undefined;
  regionToBarColour: (region: TRegion, regionIndex: number) => string;
  regionToChartTitle: (region: TRegion) => string;
  setNumberOfPagesAvailable: (newNumberOfPagesAvailable: number) => void;
  currentPageIndex: number;
}

export const HumanViralPositivePrevalenceSummaryByRegion = <TRegion extends string>(props: HumanViralPositivePrevalenceSummaryByRegionProps<TRegion>) => {
  const { data, regionGroupingFunction, regionToBarColour, regionToChartTitle, setNumberOfPagesAvailable, currentPageIndex } = props;

  const estimates = useMemo(() => data
    .filter((dataPoint): dataPoint is HumanMersViralEstimate => 'primaryEstimateInfo' in dataPoint && isHumanMersViralEstimate(dataPoint))
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
  , [ data, regionGroupingFunction ]);

  const numberOfPagesAvailable = useMemo(() => {
    const numberOfGraphs = uniqBy(estimates, (estimate) => estimate.region).length;

    return Math.ceil(numberOfGraphs / 6)
  }, [ estimates ]);

  useEffect(() => {
    setNumberOfPagesAvailable(numberOfPagesAvailable);
  }, [ numberOfPagesAvailable, setNumberOfPagesAvailable ])

  return (
    <SplitTimeBucketedBarChart
      graphId='human-viral-positive-prevalence-summary-by-region'
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
      getBarName={() => 'Human Median Positive Prevalence By Region'}
      transformOutputValue={(data) => median(data.map((dataPoint) => dataPoint.primaryEstimateInfo.positivePrevalence * 100))}
    />
  );
}