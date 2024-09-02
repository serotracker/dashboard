import { median } from "@/app/pathogen/arbovirus/dashboard/(visualizations)/recharts";
import { SplitTimeBucketedBarChart } from "@/components/customs/visualizations/split-time-bucketed-bar-chart";
import { AnimalMersSeroprevalenceEstimate, HumanMersSeroprevalenceEstimate, MersEstimate, MersSeroprevalenceEstimate, isMersSeroprevalenceEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { parseISO } from 'date-fns';
import { useMemo } from "react";

interface MedianSeroprevalenceOverTimeProps {
  data: Array<MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry>;
}

const typenameToLabel = {
  ['PrimaryHumanMersSeroprevalenceEstimateInformation']: 'Human MERS Seroprevalence',
  ['PrimaryAnimalMersSeroprevalenceEstimateInformation']: 'Animal MERS Seroprevalence',
}

const typenameToLineColour = {
  ['PrimaryHumanMersSeroprevalenceEstimateInformation']: '#e7ed8a',
  ['PrimaryAnimalMersSeroprevalenceEstimateInformation']: '#13f244',
}

export const MedianSeroprevalenceOverTime = (props: MedianSeroprevalenceOverTimeProps) => {
  const { data } = props;

  const consideredData = useMemo(() => data
    .filter((dataPoint: MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry): dataPoint is MersSeroprevalenceEstimate => {
      return 'primaryEstimateInfo' in dataPoint && isMersSeroprevalenceEstimate(dataPoint)
    })
    .map((dataPoint) => ({
      ...dataPoint,
      samplingStartDate: dataPoint.primaryEstimateInfo.samplingStartDate,
      samplingEndDate: dataPoint.primaryEstimateInfo.samplingEndDate,
    }))
    .filter((dataPoint): dataPoint is (
      Omit<HumanMersSeroprevalenceEstimate, 'samplingStartDate'|'samplingEndDate'> |
      Omit<AnimalMersSeroprevalenceEstimate, 'samplingStartDate'|'samplingEndDate'>
    ) & {
      samplingStartDate: NonNullable<typeof dataPoint['samplingStartDate']>
      samplingEndDate: NonNullable<typeof dataPoint['samplingEndDate']>
    } => !!dataPoint.samplingStartDate && !!dataPoint.samplingEndDate)
  , [ data ]);

  return (
    <SplitTimeBucketedBarChart
      graphId='median-seroprevalence-over-time'
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
      transformOutputValue={(data) => median(data.map((dataPoint) => dataPoint.primaryEstimateInfo.seroprevalence * 100))}
    />
  );
};