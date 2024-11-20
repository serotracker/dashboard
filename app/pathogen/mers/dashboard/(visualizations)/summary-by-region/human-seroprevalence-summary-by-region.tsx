import { median } from "@/app/pathogen/arbovirus/dashboard/(visualizations)/recharts";
import { SplitTimeBucketedBarChart } from "@/components/customs/visualizations/split-time-bucketed-bar-chart";
import { HumanMersSeroprevalenceEstimate, MersEstimate, MersSeroprevalenceEstimate, MersSeroprevalenceSubEstimateInformation, isHumanMersSeroprevalenceEstimate, isMersSeroprevalenceSubEstimateInformation } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { UnRegion, WhoRegion } from "@/gql/graphql";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { parseISO } from "date-fns";
import uniqBy from "lodash/uniqBy";
import { useMemo, useEffect } from "react";

interface HumanSeroprevalenceSummaryByRegionProps<TRegion extends string> {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
  selectedSampleFrames: string[];
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

export const HumanSeroprevalenceSummaryByRegion = <TRegion extends string>(props: HumanSeroprevalenceSummaryByRegionProps<TRegion>) => {
  const { data, selectedSampleFrames, regionGroupingFunction, regionToBarColour, regionToChartTitle, setNumberOfPagesAvailable, currentPageIndex } = props;

  const estimates = useMemo(() => data
    .filter((dataPoint): dataPoint is HumanMersSeroprevalenceEstimate => 'primaryEstimateInfo' in dataPoint && isHumanMersSeroprevalenceEstimate(dataPoint))
    .flatMap((dataPoint) => ([
      {
        whoRegion: dataPoint.primaryEstimateInfo.whoRegion,
        unRegion: dataPoint.primaryEstimateInfo.unRegion,
        countryAlphaTwoCode: dataPoint.primaryEstimateInfo.countryAlphaTwoCode,
        samplingStartDate: dataPoint.primaryEstimateInfo.samplingStartDate,
        samplingEndDate: dataPoint.primaryEstimateInfo.samplingEndDate,
        sampleFrames: dataPoint.primaryEstimateInfo.sampleFrames,
        seroprevalence: dataPoint.primaryEstimateInfo.seroprevalence
      },
      ...dataPoint.camelExposureLevelSubestimates
        .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersSeroprevalenceSubEstimateInformation } => isMersSeroprevalenceSubEstimateInformation(subestimate.estimateInfo))
        .map((subestimate) => ({
          whoRegion: dataPoint.primaryEstimateInfo.whoRegion,
          unRegion: dataPoint.primaryEstimateInfo.unRegion,
          countryAlphaTwoCode: dataPoint.primaryEstimateInfo.countryAlphaTwoCode,
          samplingStartDate: dataPoint.primaryEstimateInfo.samplingStartDate,
          samplingEndDate: dataPoint.primaryEstimateInfo.samplingEndDate,
          sampleFrames: subestimate.sampleFrames,
          seroprevalence: subestimate.estimateInfo.seroprevalence
        })),
      ...dataPoint.occupationSubestimates
        .filter((subestimate): subestimate is Omit<typeof subestimate, 'estimateInfo'> & { estimateInfo: MersSeroprevalenceSubEstimateInformation } => isMersSeroprevalenceSubEstimateInformation(subestimate.estimateInfo))
        .map((subestimate) => ({
          whoRegion: dataPoint.primaryEstimateInfo.whoRegion,
          unRegion: dataPoint.primaryEstimateInfo.unRegion,
          countryAlphaTwoCode: dataPoint.primaryEstimateInfo.countryAlphaTwoCode,
          samplingStartDate: dataPoint.primaryEstimateInfo.samplingStartDate,
          samplingEndDate: dataPoint.primaryEstimateInfo.samplingEndDate,
          sampleFrames: subestimate.sampleFrames,
          seroprevalence: subestimate.estimateInfo.seroprevalence
        }))
    ]))
    .filter((dataPoint) => dataPoint.sampleFrames.every((sampleFrame) => selectedSampleFrames.includes(sampleFrame)))
    .map((estimate) => ({
      ...estimate,
      region: regionGroupingFunction({
        whoRegion: estimate.whoRegion,
        unRegion: estimate.unRegion,
        countryAlphaTwoCode: estimate.countryAlphaTwoCode,
      }),
      samplingStartDate: estimate.samplingStartDate,
      samplingEndDate: estimate.samplingEndDate
    }))
    .filter((estimate): estimate is Omit<typeof estimate, 'region'|'samplingStartDate'|'samplingEndDate'> & {
      region: NonNullable<typeof estimate['region']>;
      samplingStartDate: NonNullable<typeof estimate['samplingStartDate']>;
      samplingEndDate: NonNullable<typeof estimate['samplingEndDate']>;
    } => !!estimate.region && !!estimate.samplingStartDate && !!estimate.samplingEndDate)
  , [ data, regionGroupingFunction, selectedSampleFrames ]);

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
      transformOutputValue={(data) => median(data.map((dataPoint) => dataPoint.seroprevalence * 100))}
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
      minimumNumberOfEstimatesForBarToBeIncluded={2}
    />
  );
}