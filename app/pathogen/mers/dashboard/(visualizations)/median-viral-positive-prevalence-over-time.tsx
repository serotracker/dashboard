import { median } from "@/app/pathogen/arbovirus/dashboard/(visualizations)/recharts";
import { SplitTimeBucketedBarChart } from "@/components/customs/visualizations/split-time-bucketed-bar-chart";
import { AnimalMersViralEstimate, HumanMersViralEstimate, MersEstimate, MersSeroprevalenceEstimate, MersViralEstimate, isMersViralEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { parseISO } from 'date-fns';
import { useMemo } from "react";

interface MedianViralPositivePrevalenceOverTimeProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
}

const typenameToLabel = {
  ['PrimaryHumanMersViralEstimateInformation']: 'Human MERS Viral Prevalence',
  ['PrimaryAnimalMersViralEstimateInformation']: 'Animal MERS Viral Prevalence',
}

const typenameToLineColour = {
  ['PrimaryHumanMersViralEstimateInformation']: '#3b82f6',
  ['PrimaryAnimalMersViralEstimateInformation']: '#22c55e',
}

export const MedianViralPositivePrevalenceOverTime = (props: MedianViralPositivePrevalenceOverTimeProps) => {
  const { data } = props;

  const consideredData = useMemo(() => data
    .filter((dataPoint: MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry): dataPoint is MersViralEstimate => {
      return 'primaryEstimateInfo' in dataPoint && isMersViralEstimate(dataPoint);
    })
    .map((dataPoint) => ({
      ...dataPoint,
      samplingStartDate: dataPoint.primaryEstimateInfo.samplingStartDate,
      samplingEndDate: dataPoint.primaryEstimateInfo.samplingEndDate,
    }))
    .filter((dataPoint): dataPoint is (
      Omit<HumanMersViralEstimate, 'samplingStartDate'|'samplingEndDate'> |
      Omit<AnimalMersViralEstimate, 'samplingStartDate'|'samplingEndDate'>
    ) & {
      samplingStartDate: NonNullable<typeof dataPoint['samplingStartDate']>
      samplingEndDate: NonNullable<typeof dataPoint['samplingEndDate']>
    } => !!dataPoint.samplingStartDate && !!dataPoint.samplingEndDate)
  , [ data ]);

  return (
    <SplitTimeBucketedBarChart
      graphId='median-viral-positive-prevalence-over-time'
      data={consideredData}
      primaryGroupingFunction={(dataPoint) => dataPoint.primaryEstimateInfo.__typename}
      currentPageIndex={0}
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
      getBarColour={(__typename) => typenameToLineColour[__typename]}
      percentageFormattingEnabled={true}
      getBarName={(__typename) => typenameToLabel[__typename]}
      getChartTitle={(__typename) => typenameToLabel[__typename]}
      transformOutputValue={(data) => median(data.map((dataPoint) => dataPoint.primaryEstimateInfo.positivePrevalence * 100))}
    />
  );
};