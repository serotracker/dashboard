import { useContext, useMemo } from "react";
import { parseISO } from 'date-fns';
import defaultColours from 'tailwindcss/colors'

import { SarsCov2Context, SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sarscov2/sc2-context";
import { dateFromYearAndMonth, dateToMonthCount, monthCountToMonthYearString, monthYearStringToMonthCount } from "@/lib/time-utils";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { distinctColoursMap, generateRandomColour } from "@/lib/utils";
import assertNever from "assert-never";
import { MonthlySarsCov2CountryInformationContext } from "@/contexts/pathogen-context/pathogen-contexts/sarscov2/monthly-sarscov2-country-information-context";
import { BestFitCurveLineChart } from "@/components/customs/visualizations/best-fit-curve-line-chart";
import { SeriesFieldsRegionPortion, SeriesValueType, seriesStringToSeriesFields, useComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeSeries } from "./comparing-seroprevalance-positive-cases-and-vaccinations-over-time/series-generator";

interface ComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeProps {
  legendConfiguration: LegendConfiguration;
  seriesRegionPortions: SeriesFieldsRegionPortion[];
}

export const ComparingSeroprevalencePositiveCasesAndVaccinationsOverTime = (
  props: ComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeProps
) => {
  const { filteredData } = useContext(SarsCov2Context);
  const { monthlySarsCov2CountryInformation } = useContext(MonthlySarsCov2CountryInformationContext);
  const {
    getAllSeries,
    seriesStringToLabel,
  } = useComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeSeries()

  const consideredEstimateData = useMemo(() => filteredData
    .filter((dataPoint: SarsCov2Estimate): dataPoint is Omit<SarsCov2Estimate, "samplingMidDate"> & {
      samplingMidDate: NonNullable<SarsCov2Estimate["samplingMidDate"]>;
    } => !!dataPoint.samplingMidDate)
    .map((dataPoint) => ({
      date: parseISO(dataPoint.samplingMidDate),
      alphaTwoCode: dataPoint.countryAlphaTwoCode,
      seroprevalence: dataPoint.seroprevalence ?? undefined,
      positiveCasesPerMillionPeople: undefined,
      peopleVaccinatedPerHundred: undefined,
      whoRegion: dataPoint.whoRegion ?? undefined,
      unRegion: dataPoint.unRegion ?? undefined,
      gbdSubRegion: dataPoint.gbdSubRegion ?? undefined,
      gbdSuperRegion: dataPoint.gbdSuperRegion ?? undefined
    }))
  , [filteredData])

  const consideredCountryData = useMemo(() => monthlySarsCov2CountryInformation
    .map((countryInformation) => ({
      date: dateFromYearAndMonth({ year: countryInformation.year, month: countryInformation.month }),
      alphaTwoCode: countryInformation.alphaTwoCode,
      seroprevalence: undefined,
      positiveCasesPerMillionPeople: countryInformation.positiveCasesPerMillionPeople ?? undefined,
      peopleVaccinatedPerHundred: countryInformation.peopleVaccinatedPerHundred ?? undefined,
      whoRegion: countryInformation.whoRegion ?? undefined,
      unRegion: countryInformation.unRegion ?? undefined,
      gbdSubRegion: countryInformation.gbdSubRegion ?? undefined,
      gbdSuperRegion: countryInformation.gbdSuperRegion ?? undefined
    }))
  , [monthlySarsCov2CountryInformation])

  const consolidatedData = useMemo(() => [
    ...consideredEstimateData,
    ...consideredCountryData,
  ], [consideredEstimateData, consideredCountryData])

  return (
    <div className="h-full">
      <BestFitCurveLineChart
        graphId="comparing-seroprevalence-positive-cases-and-vaccinations"
        data={consolidatedData}
        primaryGroupingFunction={(dataPoint) => getAllSeries({
          dataPoint: dataPoint,
          seriesRegionPortions: props.seriesRegionPortions
        }).seriesStrings}
        primaryGroupingKeyToLabel={(primaryGroupingKey) => seriesStringToLabel(primaryGroupingKey)}
        primaryGroupingSortFunction={(primaryGroupingKeyA, primaryGroupingKeyB) => primaryGroupingKeyA > primaryGroupingKeyB ? 1 : -1}
        dataPointToXAxisValue={({ dataPoint }) => dateToMonthCount(dataPoint.date)}
        xAxisValueToLabel={({ xAxisValue }) => monthCountToMonthYearString(xAxisValue)}
        xAxisLabelSortingFunction={(xAxisLabelA, xAxisLabelB) => monthYearStringToMonthCount(xAxisLabelA) - monthYearStringToMonthCount(xAxisLabelB)}
        dataPointToYAxisValue={({dataPoint, primaryGroupingKey}) => {
          const seriesFields = seriesStringToSeriesFields(primaryGroupingKey);

          if(seriesFields.valueType === SeriesValueType.POSITIVE_CASES) {
            return dataPoint.positiveCasesPerMillionPeople !== undefined
              ? (dataPoint.positiveCasesPerMillionPeople / 1_000_000) * 100
              : undefined
          }

          if(seriesFields.valueType === SeriesValueType.VACCINATIONS) {
            return dataPoint.peopleVaccinatedPerHundred;
          }

          if(seriesFields.valueType === SeriesValueType.SEROPREVALENCE) {
            return dataPoint.seroprevalence !== undefined
              ? dataPoint.seroprevalence * 100
              : undefined;
          }

          assertNever(seriesFields.valueType)
        }}
        formatYAxisValue={({ yAxisValue }) => parseFloat((yAxisValue).toFixed(1))}
        getLineColour={({ index }) => distinctColoursMap[index] ?? generateRandomColour() }
        bestFitLineSettings={{
          maximumPolynomialOrder: 2,
          yAxisDomain: {
            maximumValue: 100,
            minimumValue: 0
          },
          allowStrictlyIncreasingLinesOnly: true
        }}
        percentageFormattingEnabled={true}
        legendConfiguration={props.legendConfiguration}
      />
    </div>
  );

}