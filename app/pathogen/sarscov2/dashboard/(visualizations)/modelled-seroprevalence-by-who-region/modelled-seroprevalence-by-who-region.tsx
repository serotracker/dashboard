import { useContext, useMemo } from "react";
import { pipe } from "fp-ts/lib/function";
import parseISO from 'date-fns/parseISO';
import uniq from 'lodash/uniq'

import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { SarsCov2Context, SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sarscov2/sc2-context";
import { dateToDayCount, dateToMonthCount, dayCountToDate, monthCountToDate, monthCountToMonthYearString, monthYearStringToMonthCount } from "@/lib/time-utils";
import { WhoRegion } from "@/gql/graphql";
import { NumericBestFitCurveLineChart } from "@/components/customs/visualizations/best-fit-curve-line-chart-two";

const barColoursForWhoRegions: Record<WhoRegion, string> = {
  [WhoRegion.Afr]: "#e15759",
  [WhoRegion.Amr]: "#59a14f",
  [WhoRegion.Emr]: "#f1ce63",
  [WhoRegion.Eur]: "#f28e2b",
  [WhoRegion.Sear]: "#d37295",
  [WhoRegion.Wpr]: "#4e79a7",
};

interface ModelledSeroprevalenceByWhoRegionGraphProps {
  legendConfiguration: LegendConfiguration;
  scatterPointsVisible: boolean;
}

type AcceptableSarsCov2EstimateWithSeroprevalence = Omit<SarsCov2Estimate, "samplingMidDate"|"whoRegion"|"denominatorValue"|"numeratorValue"|"seroprevalence"> & {
  samplingMidDate: NonNullable<SarsCov2Estimate["samplingStartDate"]>;
  whoRegion: NonNullable<SarsCov2Estimate["whoRegion"]>;
  denominatorValue: NonNullable<SarsCov2Estimate["denominatorValue"]>;
} & {
  numeratorValue: SarsCov2Estimate["numeratorValue"];
  seroprevalence: NonNullable<SarsCov2Estimate["seroprevalence"]>;
}

const isAcceptableSarsCov2EstimateWithSeroprevalence = (
  estimate: AcceptableSarsCov2Estimate
): estimate is AcceptableSarsCov2EstimateWithSeroprevalence =>
  estimate.seroprevalence !== null && estimate.seroprevalence !== undefined;

type AcceptableSarsCov2EstimateWithNumerator = Omit<SarsCov2Estimate, "samplingMidDate"|"whoRegion"|"denominatorValue"|"numeratorValue"|"seroprevalence"> & {
  samplingMidDate: NonNullable<SarsCov2Estimate["samplingStartDate"]>;
  whoRegion: NonNullable<SarsCov2Estimate["whoRegion"]>;
  denominatorValue: NonNullable<SarsCov2Estimate["denominatorValue"]>;
} & {
  numeratorValue: NonNullable<SarsCov2Estimate["numeratorValue"]>;
  seroprevalence: SarsCov2Estimate["seroprevalence"]
}

const isAcceptableSarsCov2EstimateWithNumerator = (
  estimate: AcceptableSarsCov2Estimate
): estimate is AcceptableSarsCov2EstimateWithNumerator =>
  estimate.numeratorValue !== null && estimate.numeratorValue !== undefined;

type AcceptableSarsCov2Estimate = AcceptableSarsCov2EstimateWithSeroprevalence | AcceptableSarsCov2EstimateWithNumerator;

export const ModelledSeroprevalenceByWhoRegionGraph = (props: ModelledSeroprevalenceByWhoRegionGraphProps) => {
  const state = useContext(SarsCov2Context);

  const consideredData = useMemo(() => state.filteredData
    .filter((dataPoint: SarsCov2Estimate): dataPoint is AcceptableSarsCov2Estimate => 
      !!dataPoint.samplingMidDate
      && !!dataPoint.whoRegion
      && dataPoint.denominatorValue !== null && dataPoint.denominatorValue !== undefined
      && (
        (dataPoint.numeratorValue !== null && dataPoint.numeratorValue !== undefined)
        || (dataPoint.seroprevalence !== null && dataPoint.seroprevalence !== undefined)
      )
    ).map((dataPoint) => ({
      ...dataPoint,
      samplingMidDate: parseISO(dataPoint.samplingMidDate),
      xAxisValue: dateToDayCount(parseISO(dataPoint.samplingMidDate)),
      monthCount: dateToMonthCount(parseISO(dataPoint.samplingMidDate)),
      yAxisValue: isAcceptableSarsCov2EstimateWithSeroprevalence(dataPoint)
        ? dataPoint.seroprevalence * 100
        : (dataPoint.numeratorValue / dataPoint.denominatorValue) * 100
    })),
    [state.filteredData]
  );

  const xAxisTicks = uniq(consideredData.map(({ monthCount }) => monthCount))
    .map((monthCount) => monthCountToDate(monthCount))
    .map((date) => dateToDayCount(date));

  const maximumXAxisTick = Math.max(...xAxisTicks);
  const minimumXAxisTick = Math.min(...xAxisTicks);

  return (
    <NumericBestFitCurveLineChart 
      graphId="modelled-sc2-seroprevalence-by-who-region"
      data={consideredData}
      scatterPointsVisible={props.scatterPointsVisible}
      primaryGroupingFunction={(dataPoint) => dataPoint.whoRegion}
      primaryGroupingSortFunction={(whoRegionA, whoRegionB) => whoRegionA > whoRegionB ? 1 : -1}
      getLineColour={(whoRegion) => barColoursForWhoRegions[whoRegion]}
      xAxisTickSettings={{
        domain: [minimumXAxisTick, maximumXAxisTick],
        tickFormatter: (dayCount) => pipe(
          dayCount,
          dayCountToDate,
          dateToMonthCount,
          monthCountToMonthYearString
        ),
        interval: 0,
      }}
      yAxisTickSettings={{
        percentageFormattingEnabled: true
      }}
      bestFitLineSettings={{
        maximumPolynomialOrder: 2,
        yAxisDomain: {
          maximumValue: 100,
          minimumValue: 0
        },
        xAxisTicks: xAxisTicks,
        allowStrictlyIncreasingLinesOnly: true
      }}
      legendConfiguration={LegendConfiguration.RIGHT_ALIGNED}
    />
  )
}
