import { useContext, useMemo } from "react";
import parseISO from 'date-fns/parseISO';
import defaultColours from 'tailwindcss/colors'

import { SarsCov2Context, SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { dateFromYearAndMonth, dateToMonthCount, monthCountToMonthYearString, monthYearStringToMonthCount } from "@/lib/time-utils";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { generateRandomColour } from "@/lib/utils";
import { SecondaryKeyValueType, secondaryKeyStringToSecondaryKeyFields, useComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeSecondaryKeyFunctions } from "./comparing-seroprevalance-positive-cases-and-vaccinations-over-time/secondary-key-lib";
import assertNever from "assert-never";
import { useRegionSelector } from "./comparing-seroprevalance-positive-cases-and-vaccinations-over-time/region-selector";
import { MonthlySarsCov2CountryInformationContext } from "@/contexts/pathogen-context/pathogen-contexts/monthly-sarscov2-country-information-context";
import { BestFitCurveLineChart } from "@/components/customs/visualizations/best-fit-curve-line-chart";

const indexToColourMap: Record<number, string | undefined> = {
  0: defaultColours.red[200],
  1: defaultColours.red[500],
  2: defaultColours.red[800],
  3: defaultColours.emerald[200],
  4: defaultColours.emerald[500],
  5: defaultColours.emerald[800],
  6: defaultColours.purple[200],
  7: defaultColours.purple[500],
  8: defaultColours.purple[800],
  9: defaultColours.yellow[200],
  10: defaultColours.yellow[500],
  11: defaultColours.yellow[800],
  12: defaultColours.blue[200],
  13: defaultColours.blue[500],
  14: defaultColours.blue[800],
  15: defaultColours.rose[200],
  16: defaultColours.rose[500],
  17: defaultColours.rose[800],
  18: defaultColours.orange[200],
  19: defaultColours.orange[500],
  20: defaultColours.orange[800],
  21: defaultColours.lime[200],
  22: defaultColours.lime[500],
  23: defaultColours.lime[800],
  24: defaultColours.cyan[200],
  25: defaultColours.cyan[500],
  26: defaultColours.cyan[800],
  27: defaultColours.amber[200],
  28: defaultColours.amber[500],
  29: defaultColours.amber[800],
  30: defaultColours.teal[200],
  31: defaultColours.teal[500],
  32: defaultColours.teal[800]
}

interface ComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeProps {
  legendConfiguration: LegendConfiguration;
}

export const ComparingSeroprevalencePositiveCasesAndVaccinationsOverTime = (
  props: ComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeProps
) => {
  const { filteredData }= useContext(SarsCov2Context);
  const { monthlySarsCov2CountryInformation } = useContext(MonthlySarsCov2CountryInformationContext);
  const {
    getAllSecondaryKeys,
    secondaryKeyStringToLabel,
  } = useComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeSecondaryKeyFunctions()
  const {
    regionSelector,
    secondaryKeyRegionPortions
  } = useRegionSelector({ maximumRegionSelectorCount: 5 });

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

  const consideredCountryData = useMemo(() => monthlySarsCov2CountryInformation?.monthlySarsCov2CountryInformation
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
    })) ?? []
  , [monthlySarsCov2CountryInformation])

  console.log('consideredCountryData', consideredCountryData)

  const consolidatedData = useMemo(() => [
    ...consideredEstimateData,
    ...consideredCountryData,
  ], [consideredEstimateData, consideredCountryData])

  return (
    <div className="flex h-full">
      <div className="grow-0 h-full max-w-xs overflow-y-scroll ignore-for-visualization-download">
        {regionSelector}
      </div>
      <div className="grow h-full">
        <BestFitCurveLineChart
          graphId="comparing-seroprevalence-positive-cases-and-vaccinations"
          data={consolidatedData}
          primaryGroupingFunction={(dataPoint) => getAllSecondaryKeys({
            dataPoint: dataPoint,
            secondaryKeyRegionPortions
          }).secondaryKeyStrings}
          primaryGroupingKeyToLabel={(primaryGroupingKey) => secondaryKeyStringToLabel(primaryGroupingKey)}
          primaryGroupingSortFunction={(primaryGroupingKeyA, primaryGroupingKeyB) => primaryGroupingKeyA > primaryGroupingKeyB ? 1 : -1}
          dataPointToXAxisValue={({ dataPoint }) => dateToMonthCount(dataPoint.date)}
          xAxisValueToLabel={({ xAxisValue }) => monthCountToMonthYearString(xAxisValue)}
          xAxisLabelSortingFunction={(xAxisLabelA, xAxisLabelB) => monthYearStringToMonthCount(xAxisLabelA) - monthYearStringToMonthCount(xAxisLabelB)}
          dataPointToYAxisValue={({dataPoint, primaryGroupingKey}) => {
            const secondaryKeyFields = secondaryKeyStringToSecondaryKeyFields(primaryGroupingKey);

            if(secondaryKeyFields.valueType === SecondaryKeyValueType.POSITIVE_CASES) {
              return dataPoint.positiveCasesPerMillionPeople !== undefined
                ? (dataPoint.positiveCasesPerMillionPeople / 1_000_000) * 100
                : undefined
            }

            if(secondaryKeyFields.valueType === SecondaryKeyValueType.VACCINATIONS) {
              return dataPoint.peopleVaccinatedPerHundred;
            }

            if(secondaryKeyFields.valueType === SecondaryKeyValueType.SEROPREVALENCE) {
              return dataPoint.seroprevalence !== undefined
                ? dataPoint.seroprevalence * 100
                : undefined;
            }

            assertNever(secondaryKeyFields.valueType)
          }}
          formatYAxisValue={({ yAxisValue }) => parseFloat((yAxisValue).toFixed(1))}
          getLineColour={({ index }) => indexToColourMap[index] ?? generateRandomColour() }
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
    </div>
  );

}