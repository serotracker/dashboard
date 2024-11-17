import { median } from "@/app/pathogen/arbovirus/dashboard/(visualizations)/recharts";
import { SplitTimeBucketedBarChart } from "@/components/customs/visualizations/split-time-bucketed-bar-chart";
import { AnimalMersViralEstimate, HumanMersViralEstimate, MersEstimate, isAnimalMersViralEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { UnRegion, WhoRegion } from "@/gql/graphql";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { parseISO } from "date-fns";
import uniqBy from "lodash/uniqBy";
import { useMemo, useEffect } from "react";

interface AnimalViralPositivePrevalenceSummaryByRegionProps<TRegion extends string> {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  selectedAnimalSampleFrame: string | undefined;
  regionGroupingFunction: (dataPoint: {
    whoRegion: WhoRegion | undefined | null;
    unRegion: UnRegion | undefined | null;
    countryAlphaTwoCode: string;
  }) => TRegion | undefined;
  regionToBarColour: (region: TRegion, regionIndex: number) => string;
  regionToChartTitle: (region: TRegion) => string;
  setNumberOfPagesAvailable: (newNumberOfPagesAvailable: number) => void;
  currentPageIndex: number;
}

export const AnimalViralPositivePrevalenceSummaryByRegion = <TRegion extends string>(props: AnimalViralPositivePrevalenceSummaryByRegionProps<TRegion>) => {
  const { data, selectedAnimalSampleFrame, regionGroupingFunction, regionToBarColour, regionToChartTitle, setNumberOfPagesAvailable, currentPageIndex } = props;

  const estimates = useMemo(() => data
    .filter((dataPoint): dataPoint is AnimalMersViralEstimate => 'primaryEstimateInfo' in dataPoint && isAnimalMersViralEstimate(dataPoint))
    .filter((dataPoint) => !selectedAnimalSampleFrame || dataPoint.primaryEstimateInfo.animalDetectionSettings.includes(selectedAnimalSampleFrame))
    .map((estimate) => ({
      ...estimate,
      region: regionGroupingFunction({
        whoRegion: estimate.primaryEstimateInfo.whoRegion,
        unRegion: estimate.primaryEstimateInfo.unRegion,
        countryAlphaTwoCode: estimate.primaryEstimateInfo.countryAlphaTwoCode,
      }),
      samplingStartDate: estimate.primaryEstimateInfo.samplingStartDate,
      samplingEndDate: estimate.primaryEstimateInfo.samplingEndDate
    }))
    .filter((estimate): estimate is Omit<typeof estimate, 'region'|'samplingStartDate'|'samplingEndDate'> & {
      region: NonNullable<typeof estimate['region']>;
      samplingStartDate: NonNullable<typeof estimate['samplingStartDate']>;
      samplingEndDate: NonNullable<typeof estimate['samplingEndDate']>;
    } => !!estimate.region && !!estimate.samplingStartDate && !!estimate.samplingEndDate)
  , [ data, regionGroupingFunction, selectedAnimalSampleFrame ]);

  const numberOfPagesAvailable = useMemo(() => {
    const numberOfGraphs = uniqBy(estimates, (estimate) => estimate.region).length;

    return Math.ceil(numberOfGraphs / 6)
  }, [ estimates ]);

  useEffect(() => {
    setNumberOfPagesAvailable(numberOfPagesAvailable);
  }, [ numberOfPagesAvailable, setNumberOfPagesAvailable ])

  return (
    <SplitTimeBucketedBarChart
      graphId='animal-viral-positive-prevalence-summary-by-region'
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
      getBarName={() => 'Animal Median Positive Prevalence'}
      transformOutputValue={(data) => median(data.map((dataPoint) => dataPoint.primaryEstimateInfo.positivePrevalence * 100))}
      numberOfDigitsAfterDecimalPointForOutputValue={3}
      tooltipContentOverride={({ active, payload, label }) => {
        if (active && payload && payload.length) {
          const values = payload[0].payload;
          return (
            <div className="bg-white p-2 border border-background rounded-lg">
              <p>{values.intervalAsString}</p>
              <p>{`${payload[0].name} : ${values.valueForBar.toFixed(3)} %`}</p>
              <p>{`Total Studies Included : ${values.numberOfDataPointsInBar.toFixed(0)}`}</p>
            </div>
          );
        }

        return null;
      }}
    />
  );
}