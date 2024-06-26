import { useContext, useMemo } from "react";
import parseISO from 'date-fns/parseISO';

import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { SarsCov2Context, SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sarscov2/sc2-context";
import { dateToMonthCount, monthCountToMonthYearString, monthYearStringToMonthCount } from "@/lib/time-utils";
import { WhoRegion } from "@/gql/graphql";
import { BestFitCurveLineChart } from "@/components/customs/visualizations/best-fit-curve-line-chart";
import { LineChartTwo } from "@/components/customs/visualizations/line-chart-two";
import { BestFitCurveLineChartTwo } from "@/components/customs/visualizations/best-fit-curve-line-chart-two";

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
  estimate: Omit<AcceptableSarsCov2Estimate, 'samplingMidDate'> & { samplingMidDate: Date }
): estimate is (Omit<AcceptableSarsCov2EstimateWithSeroprevalence, 'samplingMidDate'> & { samplingMidDate: Date }) =>
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
  estimate: Omit<AcceptableSarsCov2Estimate, 'samplingMidDate'> & { samplingMidDate: Date }
): estimate is (Omit<AcceptableSarsCov2EstimateWithNumerator, 'samplingMidDate'> & { samplingMidDate: Date }) =>
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
    })),
    [state.filteredData]
  );

  //return (
  //  <LineChartTwo 
  //    graphId="modelled-sc2-seroprevalence-by-who-region"
  //    data={[{
  //      whoRegion: WhoRegion.Afr,
  //      xAxisValue: 10,
  //      yAxisValue: 20
  //    }, {
  //      whoRegion: WhoRegion.Afr,
  //      xAxisValue: 15,
  //      yAxisValue: 30
  //    }, {
  //      whoRegion: WhoRegion.Afr,
  //      xAxisValue: 25,
  //      yAxisValue: 100
  //    }]}
  //    scatterPointData={[{
  //      whoRegion: WhoRegion.Afr,
  //      xAxisValue: 10,
  //      yAxisValue: 25
  //    }, {
  //      whoRegion: WhoRegion.Afr,
  //      xAxisValue: 15,
  //      yAxisValue: 35
  //    }]}
  //    primaryGroupingFunction={(dataPoint) => dataPoint.whoRegion}
  //    scatterPointPrimaryGroupingFunction={(dataPoint) => dataPoint.whoRegion}
  //    primaryGroupingSortFunction={(whoRegionA, whoRegionB) => whoRegionA > whoRegionB ? 1 : -1}
  //    getLineColour={(whoRegion) => barColoursForWhoRegions[whoRegion]}
  //    yAxisTickSettings={{
  //      percentageFormattingEnabled: true
  //    }}
  //    legendConfiguration={LegendConfiguration.RIGHT_ALIGNED}
  //  />
  //)

  const a = [{
    whoRegion: WhoRegion.Afr,
    xAxisValue: 10,
    yAxisValue: 20
  }, {
    whoRegion: WhoRegion.Afr,
    xAxisValue: 15,
    yAxisValue: 30
  }, {
    whoRegion: WhoRegion.Afr,
    xAxisValue: 20,
    yAxisValue: 90
  }, {
    whoRegion: WhoRegion.Afr,
    xAxisValue: 25,
    yAxisValue: 90
  }]

  const xAxisTicks = [0, 5, 10, 15, 20, 25, 30]

  return (
    <BestFitCurveLineChartTwo 
      graphId="modelled-sc2-seroprevalence-by-who-region"
      data={a}
      primaryGroupingFunction={(dataPoint) => dataPoint.whoRegion}
      primaryGroupingSortFunction={(whoRegionA, whoRegionB) => whoRegionA > whoRegionB ? 1 : -1}
      getLineColour={(whoRegion) => barColoursForWhoRegions[whoRegion]}
      xAxisTickSettings={{
        ticks: xAxisTicks
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

  //return (
  //  <BestFitCurveLineChart
  //    graphId="modelled-sc2-seroprevalence-by-who-region"
  //    data={consideredData}
  //    primaryGroupingFunction={(dataPoint) => dataPoint.whoRegion}
  //    primaryGroupingSortFunction={(whoRegionA, whoRegionB) => whoRegionA > whoRegionB ? 1 : -1}
  //    dataPointToXAxisValue={({ dataPoint }) => dateToMonthCount(dataPoint.samplingMidDate)}
  //    xAxisValueToLabel={({ xAxisValue }) => monthCountToMonthYearString(xAxisValue)}
  //    xAxisLabelSortingFunction={(xAxisLabelA, xAxisLabelB) => monthYearStringToMonthCount(xAxisLabelA) - monthYearStringToMonthCount(xAxisLabelB)}
  //    dataPointToYAxisValue={({ dataPoint }) => {
  //      const seroprevalenceDecimalValue = isAcceptableSarsCov2EstimateWithNumerator(dataPoint)
  //        ? dataPoint.numeratorValue / dataPoint.denominatorValue
  //        : (dataPoint.seroprevalence * dataPoint.denominatorValue) / dataPoint.denominatorValue

  //      return parseFloat((seroprevalenceDecimalValue * 100).toFixed(1))
  //    }}
  //    getLineColour={({ primaryGroupingKey }) => barColoursForWhoRegions[primaryGroupingKey]}
  //    bestFitLineSettings={{
  //      maximumPolynomialOrder: 2,
  //      yAxisDomain: {
  //        maximumValue: 100,
  //        minimumValue: 0
  //      },
  //      allowStrictlyIncreasingLinesOnly: true
  //    }}
  //    formatYAxisValue={({ yAxisValue }) => parseFloat((yAxisValue).toFixed(1))}
  //    legendConfiguration={LegendConfiguration.RIGHT_ALIGNED}
  //    percentageFormattingEnabled={true}
  //  />
  //);
}
