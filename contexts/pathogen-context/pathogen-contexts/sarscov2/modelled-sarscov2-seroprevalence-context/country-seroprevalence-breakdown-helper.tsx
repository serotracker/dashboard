import { GbdSubRegion, GbdSuperRegion, UnRegion, WhoRegion } from "@/gql/graphql";
import { parseISO } from 'date-fns';
import { typedGroupBy, typedObjectFromEntries, typedObjectKeys } from "@/lib/utils";
import { AcceptableSarsCov2Estimate, isAcceptableSarsCov2EstimateWithNumerator } from "./data-filtering";
import { dateToMonthCount, monthEnumFromMonthIndex } from "@/lib/time-utils";
import { LookupOptimizedSarsCov2CountryInformation } from "../monthly-sarscov2-country-information-context";

interface GenerateCountrySeroprevalenceDataBreakdownInput {
  filteredDataForModelling: AcceptableSarsCov2Estimate[];
  lookupOptimizedSarsCov2CountryInformation: LookupOptimizedSarsCov2CountryInformation | undefined;
}

export type CountryModelledSeroprevalenceBreakdown = Record<string, {
  global: "Global",
  countryAlphaThreeCode: string;
  whoRegion: WhoRegion | undefined;
  gbdSuperRegion: GbdSuperRegion | undefined;
  gbdSubRegion: GbdSubRegion | undefined;
  unRegion: UnRegion | undefined;
  data: Array<{
    countryPopulation: number | undefined;
    xAxisValue: number;
    yAxisValue: number;
  }>;
}>;

interface GenerateCountrySeroprevalenceDataBreakdownOutput {
  countryModelledSeroprevalenceBreakdown: CountryModelledSeroprevalenceBreakdown;
}

export const generateCountrySeroprevalenceDataBreakdown = (input: GenerateCountrySeroprevalenceDataBreakdownInput): GenerateCountrySeroprevalenceDataBreakdownOutput => {
  if(input.filteredDataForModelling.length === 0) {
    return {
      countryModelledSeroprevalenceBreakdown: {}
    };
  }

  const dataBrokenDownByCountry = typedGroupBy(input.filteredDataForModelling, (dataPoint) => dataPoint.countryAlphaThreeCode);
  const allCountryAlphaThreeCodes = typedObjectKeys(dataBrokenDownByCountry);

  const countryModelledSeroprevalenceBreakdown = typedObjectFromEntries(allCountryAlphaThreeCodes
    .map((countryAlphaThreeCode): [string, AcceptableSarsCov2Estimate[]] => [
      countryAlphaThreeCode, dataBrokenDownByCountry[countryAlphaThreeCode]
    ])
    .map(([countryAlphaThreeCode, dataForCountry]): [
      string,
      CountryModelledSeroprevalenceBreakdown[string]
    ] => [
      countryAlphaThreeCode,
      {
        global: "Global" as const,
        countryAlphaThreeCode: countryAlphaThreeCode,
        whoRegion: dataForCountry.length > 0 ? (dataForCountry[0].whoRegion ?? undefined) : undefined,
        gbdSuperRegion: dataForCountry.length > 0 ? (dataForCountry[0].gbdSuperRegion ?? undefined) : undefined,
        gbdSubRegion: dataForCountry.length > 0 ? (dataForCountry[0].gbdSubRegion ?? undefined) : undefined,
        unRegion: dataForCountry.length > 0 ? (dataForCountry[0].unRegion ?? undefined) : undefined,
        data: dataForCountry.map((dataPoint) => {
          const seroprevalenceDecimalValue = isAcceptableSarsCov2EstimateWithNumerator(dataPoint)
            ? dataPoint.numeratorValue / dataPoint.denominatorValue
            : (dataPoint.seroprevalence * dataPoint.denominatorValue) / dataPoint.denominatorValue
          const samplingMidDate = parseISO(dataPoint.samplingMidDate);
          const year = samplingMidDate.getFullYear();
          const month = monthEnumFromMonthIndex({ monthIndex: samplingMidDate.getMonth() });
          const alphaTwoCode = dataPoint.countryAlphaTwoCode;

          const countryPopulation = !!month && input.lookupOptimizedSarsCov2CountryInformation
            ? input.lookupOptimizedSarsCov2CountryInformation
              .find((element) => element.alphaTwoCode === alphaTwoCode)?.data
              .find((element) => element.year === year)?.data
              .find((element) => element.month === month)?.data
              .at(0)?.population
              ?? undefined
            : undefined

          return {
            countryPopulation,
            xAxisValue: dateToMonthCount(samplingMidDate),
            yAxisValue: seroprevalenceDecimalValue
          }
        })
      }
    ])
  )

  return {
    countryModelledSeroprevalenceBreakdown
  }
}