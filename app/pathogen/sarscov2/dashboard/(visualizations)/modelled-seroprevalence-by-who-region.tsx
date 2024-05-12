import { useContext, useMemo } from "react";
import parseISO from 'date-fns/parseISO';

import { LineChart } from "@/components/customs/visualizations/line-chart";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { SarsCov2Context, SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { dateToMonthCount, monthCountToMonthYearString, monthYearStringToMonthCount } from "@/lib/time-utils";
import { generateRange } from "@/lib/utils";
import { WhoRegion } from "@/gql/graphql";

interface GenerateTimeBucketForEstimateInput {
  estimate: Omit<SarsCov2Estimate, 'samplingStartDate'|'samplingEndDate'> & {samplingStartDate: Date, samplingEndDate: Date};
}

const generateTimeBucketsForEstimate = (input: GenerateTimeBucketForEstimateInput): string[] => {
  const samplingStartDateMonthCount = dateToMonthCount(input.estimate.samplingStartDate);
  const samplingEndDateMonthCount = dateToMonthCount(input.estimate.samplingEndDate);

  if(samplingStartDateMonthCount >= samplingEndDateMonthCount) {
    return [ monthCountToMonthYearString(samplingStartDateMonthCount) ];
  }

  return generateRange({
    startInclusive: samplingStartDateMonthCount,
    endInclusive: samplingEndDateMonthCount,
    stepSize: 1
  }).map((monthCount) => monthCountToMonthYearString(monthCount));
}

const barColoursForWhoRegions: Record<WhoRegion, string> = {
  [WhoRegion.Afr]: "#bae3b1",
  [WhoRegion.Amr]: "#c6e0f1",
  [WhoRegion.Emr]: "#b6d7d3",
  [WhoRegion.Eur]: "#e5aabf",
  [WhoRegion.Sear]: "#e7d3ca",
  [WhoRegion.Wpr]: "#d6d0cd",
};

interface ModelledSeroprevalenceByWhoRegionGraphProps {
  legendConfiguration: LegendConfiguration;
}

export const ModelledSeroprevalenceByWhoRegionGraph = (props: ModelledSeroprevalenceByWhoRegionGraphProps) => {
  const state = useContext(SarsCov2Context);

  const consideredData = useMemo(() => state.filteredData
    .filter((dataPoint: SarsCov2Estimate): dataPoint is Omit<SarsCov2Estimate, "samplingStartDate" | "samplingEndDate">
      & {
        samplingStartDate: NonNullable<SarsCov2Estimate["samplingStartDate"]>;
        samplingEndDate: NonNullable<SarsCov2Estimate["samplingEndDate"]>;
        whoRegion: NonNullable<SarsCov2Estimate["whoRegion"]>;
      } => !!dataPoint.samplingStartDate && !!dataPoint.samplingEndDate && !!dataPoint.whoRegion
    ).map((dataPoint) => ({
      ...dataPoint,
      samplingEndDate: parseISO(dataPoint.samplingEndDate),
      samplingStartDate: parseISO(dataPoint.samplingStartDate)
    })),
    [state.filteredData]
  );

  return (
    <LineChart
      graphId="modelled-sc2-seroprevalence-by-who-region"
      data={consideredData}
      primaryGroupingFunction={(dataPoint) => generateTimeBucketsForEstimate({ estimate: dataPoint })}
      primaryGroupingSortFunction={(timeBucketA, timeBucketB) => monthYearStringToMonthCount(timeBucketA) - monthYearStringToMonthCount(timeBucketB)}
      secondaryGroupingFunction={(dataPoint) => dataPoint.whoRegion}
      secondaryGroupingSortFunction={(whoRegionA, whoRegionB) => whoRegionA > whoRegionB ? 1 : -1}
      transformOutputValue={(data) => {
        const { denominatorValue, numeratorValue } = data.reduce((accumulator, currentValue) => ({
          denominatorValue: accumulator.denominatorValue + currentValue.denominatorValue,
          numeratorValue: accumulator.numeratorValue + currentValue.numeratorValue,
        }), {denominatorValue: 0, numeratorValue: 0})

        return denominatorValue > 0 ? numeratorValue / denominatorValue : 0
      }}
      getLineColour={(whoRegion) => barColoursForWhoRegions[whoRegion]}
      legendConfiguration={LegendConfiguration.RIGHT_ALIGNED}
    />
  );
}