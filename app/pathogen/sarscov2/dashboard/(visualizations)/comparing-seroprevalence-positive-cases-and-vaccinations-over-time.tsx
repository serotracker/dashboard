import { useContext, useMemo } from "react";
import parseISO from 'date-fns/parseISO';

import { LineChart } from "@/components/customs/visualizations/line-chart";
import { SarsCov2Context, SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { dateToMonthCount, monthCountToMonthYearString, monthYearStringToMonthCount } from "@/lib/time-utils";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { generateRandomColour } from "@/lib/utils";
import { SecondaryKeyValueType, secondaryKeyStringToSecondaryKeyFields, useComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeSecondaryKeyFunctions } from "./comparing-seroprevalance-positive-cases-and-vaccinations-over-time/secondary-key-lib";
import { median } from "@/app/pathogen/arbovirus/dashboard/(visualizations)/recharts";
import assertNever from "assert-never";

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

export const ComparingSeroprevalencePositiveCasesAndVaccinationsOverTime = (
  props: ComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeProps
) => {
  const state = useContext(SarsCov2Context);
  const {
    getAllSecondaryKeys,
    secondaryKeyStringToLabel,
  } = useComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeSecondaryKeyFunctions()

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
    <LineChart
      graphId="comparing-seroprevalence-positive-cases-and-vaccinations"
      data={consideredData}
      primaryGroupingFunction={(dataPoint) => generateTimeBucketsForEstimate({ estimate: dataPoint })}
      primaryGroupingSortFunction={(timeBucketA, timeBucketB) => monthYearStringToMonthCount(timeBucketA) - monthYearStringToMonthCount(timeBucketB)}
      secondaryGroupingFunction={() => getAllSecondaryKeys({
        selectedWhoRegions: [],
        selectedUnRegions: [],
        selectedCountryAlphaTwoCodes: [],
        selectedGbdSuperRegions: [],
        selectedGbdSubRegions: []
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
      getLineColour={() => generateRandomColour()}
      legendConfiguration={props.legendConfiguration}
      percentageFormattingEnabled={true}
    />
  );

}