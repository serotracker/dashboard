import { useContext, useMemo } from "react";
import parseISO from 'date-fns/parseISO';
import defaultColours from 'tailwindcss/colors'

import { LineChart } from "@/components/customs/visualizations/line-chart";
import { SarsCov2Context, SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { dateToMonthCount, monthCountToMonthYearString, monthYearStringToMonthCount } from "@/lib/time-utils";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { generateRandomColour } from "@/lib/utils";
import { SecondaryKeyValueType, secondaryKeyStringToSecondaryKeyFields, useComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeSecondaryKeyFunctions } from "./comparing-seroprevalance-positive-cases-and-vaccinations-over-time/secondary-key-lib";
import { median } from "@/app/pathogen/arbovirus/dashboard/(visualizations)/recharts";
import assertNever from "assert-never";
import { useRegionSelector } from "./comparing-seroprevalance-positive-cases-and-vaccinations-over-time/region-selector";

interface ComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeProps {
  legendConfiguration: LegendConfiguration;
}

interface GenerateTimeBucketForEstimateInput {
  estimate: Omit<SarsCov2Estimate, 'samplingMidDate'> & {samplingMidDate: Date};
}

const generateTimeBucketsForEstimate = (input: GenerateTimeBucketForEstimateInput): string[] => {
  const samplingMidDateMonthCount = dateToMonthCount(input.estimate.samplingMidDate);

  return [
    monthCountToMonthYearString(samplingMidDateMonthCount - 1),
    monthCountToMonthYearString(samplingMidDateMonthCount),
    monthCountToMonthYearString(samplingMidDateMonthCount + 1)
  ]
}

type SarsCov2EstimateWithMidDateCleaned = Omit<SarsCov2Estimate, "samplingMidDate"> & {
  samplingMidDate: Date
}

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

export const ComparingSeroprevalencePositiveCasesAndVaccinationsOverTime = (
  props: ComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeProps
) => {
  const state = useContext(SarsCov2Context);
  const {
    getAllSecondaryKeys,
    secondaryKeyStringToLabel,
  } = useComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeSecondaryKeyFunctions()
  const {
    regionSelector,
    secondaryKeyRegionPortions
  } = useRegionSelector({ maximumRegionSelectorCount: 5 });

  const consideredData = useMemo(() => state.filteredData
    .filter((dataPoint: SarsCov2Estimate): dataPoint is Omit<SarsCov2Estimate, "samplingMidDate">
      & {
        samplingMidDate: NonNullable<SarsCov2Estimate["samplingMidDate"]>;
      } => 
        !!dataPoint.samplingMidDate
    ).map((dataPoint) => ({
      ...dataPoint,
      samplingMidDate: parseISO(dataPoint.samplingMidDate),
    })),
    [state.filteredData]
  );

  return (
    <div className="flex h-full">
      <div className="grow-0 h-full max-w-xs overflow-y-scroll ignore-for-visualization-download">
        {regionSelector}
      </div>
      <div className="grow h-full">
        <LineChart
          graphId="comparing-seroprevalence-positive-cases-and-vaccinations"
          data={consideredData}
          primaryGroupingFunction={(dataPoint) => generateTimeBucketsForEstimate({ estimate: dataPoint })}
          primaryGroupingSortFunction={(timeBucketA, timeBucketB) => monthYearStringToMonthCount(timeBucketA) - monthYearStringToMonthCount(timeBucketB)}
          secondaryGroupingFunction={(dataPoint) => getAllSecondaryKeys({
            estimate: dataPoint,
            secondaryKeyRegionPortions
          }).secondaryKeyStrings}
          secondaryGroupingKeyToLabel={(secondaryKey) => secondaryKeyStringToLabel(secondaryKey)}
          transformOutputValue={({ data, secondaryGroupingKey }) => {
            const secondaryKeyFields = secondaryKeyStringToSecondaryKeyFields(secondaryGroupingKey);

            if(secondaryKeyFields.valueType === SecondaryKeyValueType.POSITIVE_CASES) {
              return parseFloat(median(data
                .filter((dataPoint): dataPoint is Omit<SarsCov2EstimateWithMidDateCleaned, "countryPositiveCasesPerMillionPeople"> & {
                  countryPositiveCasesPerMillionPeople: NonNullable<SarsCov2EstimateWithMidDateCleaned["countryPositiveCasesPerMillionPeople"]>
                } =>
                  dataPoint.countryPositiveCasesPerMillionPeople !== null &&
                  dataPoint.countryPositiveCasesPerMillionPeople !== undefined
                )
                .map((dataPoint) => (dataPoint.countryPositiveCasesPerMillionPeople / 1_000_000) * 100)
              ).toFixed(1))
            }

            if(secondaryKeyFields.valueType === SecondaryKeyValueType.VACCINATIONS) {
              return parseFloat(median(data
                .filter((dataPoint): dataPoint is Omit<SarsCov2EstimateWithMidDateCleaned, "countryPeopleVaccinatedPerHundred"> & {
                  countryPeopleVaccinatedPerHundred: NonNullable<SarsCov2EstimateWithMidDateCleaned["countryPeopleVaccinatedPerHundred"]>
                } =>
                  dataPoint.countryPeopleVaccinatedPerHundred !== null &&
                  dataPoint.countryPeopleVaccinatedPerHundred !== undefined
                )
                .map((dataPoint) => (dataPoint.countryPeopleVaccinatedPerHundred / 100) * 100)
              ).toFixed(1))
            }

            if(secondaryKeyFields.valueType === SecondaryKeyValueType.SEROPREVALENCE) {
              return parseFloat(median(data
                .filter((dataPoint): dataPoint is Omit<SarsCov2EstimateWithMidDateCleaned, "seroprevalence"> & {
                  seroprevalence: NonNullable<SarsCov2EstimateWithMidDateCleaned["seroprevalence"]>
                } =>
                  dataPoint.seroprevalence !== null &&
                  dataPoint.seroprevalence !== undefined
                )
                .map((dataPoint) => (dataPoint.seroprevalence) * 100)
              ).toFixed(1))
            }

            assertNever(secondaryKeyFields.valueType)
          }}
          secondaryGroupingSortFunction={(secondaryKeyA, secondaryKeyB) => secondaryKeyA > secondaryKeyB ? 1 : -1 }
          getLineColour={(_secondaryKey, index) => indexToColourMap[index] ?? generateRandomColour()}
          legendConfiguration={props.legendConfiguration}
          percentageFormattingEnabled={true}
        />
      </div>
    </div>
  );

}