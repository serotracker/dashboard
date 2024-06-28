import { useContext } from "react";
import { GbdSubRegion, GbdSuperRegion, UnRegion, WhoRegion } from "@/gql/graphql";
import assertNever from "assert-never";
import { gbdSubRegionToLabelMap, gbdSuperRegionToLabelMap, isGbdSubRegion, isGbdSuperRegion } from "@/lib/gbd-regions";
import { isUNRegion, unRegionEnumToLabelMap } from "@/lib/un-regions";
import { isWHORegion } from "@/lib/who-regions";
import { CountryInformationContext } from "@/contexts/pathogen-context/country-information-context";

export enum SeriesValueType {
  VACCINATIONS = "VACCINATIONS",
  POSITIVE_CASES = "POSITIVE_CASES",
  SEROPREVALENCE = "SEROPREVALENCE",
}

const isSeriesValueType = (valueType: string): valueType is SeriesValueType =>
  Object.values(SeriesValueType).some((element) => element === valueType)

export enum SeriesRegionType {
  GLOBAL = "GLOBAL",
  WHO_REGION = "WHO_REGION",
  UN_REGION = "UN_REGION",
  COUNTRY = "COUNTRY",
  GBD_SUPER_REGION = "GBD_SUPER_REGION",
  GBD_SUB_REGION = "GBD_SUB_REGION"
}

export const isSeriesRegionType = (regionType: string): regionType is SeriesRegionType =>
  Object.values(SeriesRegionType).some((element) => element === regionType)

export type SeriesFieldsRegionPortion = {
  regionType: SeriesRegionType.GLOBAL
} | {
  regionType: SeriesRegionType.WHO_REGION,
  whoRegion: WhoRegion,
} | {
  regionType: SeriesRegionType.UN_REGION,
  unRegion: UnRegion,
} | {
  regionType: SeriesRegionType.COUNTRY,
  countryAlphaTwoCode: string,
} | {
  regionType: SeriesRegionType.GBD_SUPER_REGION,
  gbdSuperRegion: GbdSuperRegion
} | {
  regionType: SeriesRegionType.GBD_SUB_REGION,
  gbdSubRegion: GbdSubRegion
}

type SeriesFields = SeriesFieldsRegionPortion & {
  valueType: SeriesValueType
}

interface GetAllSeriesInput {
  dataPoint: {
    alphaTwoCode: string;
    whoRegion: WhoRegion | undefined;
    unRegion: UnRegion | undefined;
    gbdSubRegion: GbdSubRegion | undefined;
    gbdSuperRegion: GbdSuperRegion | undefined;
  }
  seriesRegionPortions: SeriesFieldsRegionPortion[];
}

interface GetAllSeriesOutput {
  seriesStrings: SeriesString[],
}

const seriesStringSeperator = '___'

type SeriesString = `${SeriesRegionType}${typeof seriesStringSeperator}${string}${typeof seriesStringSeperator}${SeriesValueType}`

const getAllSeriesFields = (input: GetAllSeriesInput): SeriesFields[] => {
  return input.seriesRegionPortions.flatMap((seriesFields) => [
    { ...seriesFields, valueType: SeriesValueType.VACCINATIONS },
    { ...seriesFields, valueType: SeriesValueType.POSITIVE_CASES },
    { ...seriesFields, valueType: SeriesValueType.SEROPREVALENCE }
  ])
}

const seriesFieldsToSeriesString = (seriesFields: SeriesFields): SeriesString => {
  if(seriesFields.regionType === SeriesRegionType.COUNTRY) {
    return `${seriesFields.regionType}${seriesStringSeperator}${seriesFields.countryAlphaTwoCode}${seriesStringSeperator}${seriesFields.valueType}`
  }
  if(seriesFields.regionType === SeriesRegionType.GBD_SUB_REGION) {
    return `${seriesFields.regionType}${seriesStringSeperator}${seriesFields.gbdSubRegion}${seriesStringSeperator}${seriesFields.valueType}`
  }
  if(seriesFields.regionType === SeriesRegionType.GBD_SUPER_REGION) {
    return `${seriesFields.regionType}${seriesStringSeperator}${seriesFields.gbdSuperRegion}${seriesStringSeperator}${seriesFields.valueType}`
  }
  if(seriesFields.regionType === SeriesRegionType.UN_REGION) {
    return `${seriesFields.regionType}${seriesStringSeperator}${seriesFields.unRegion}${seriesStringSeperator}${seriesFields.valueType}`
  }
  if(seriesFields.regionType === SeriesRegionType.WHO_REGION) {
    return `${seriesFields.regionType}${seriesStringSeperator}${seriesFields.whoRegion}${seriesStringSeperator}${seriesFields.valueType}`
  }
  if(seriesFields.regionType === SeriesRegionType.GLOBAL) {
    return `${seriesFields.regionType}${seriesStringSeperator}GLOBAL${seriesStringSeperator}${seriesFields.valueType}`
  }

  assertNever(seriesFields);
}

const getFallbackSeriesFields = (): SeriesFields => ({
  regionType: SeriesRegionType.GLOBAL,
  valueType: SeriesValueType.SEROPREVALENCE
})

export const seriesStringToSeriesFields = (seriesString: SeriesString): SeriesFields => {
  const splitSeriesString = seriesString.split(seriesStringSeperator)

  // A fallback for when the string is improperly formatted or contains more instances of the separator than expected, not a normal use case.
  if( splitSeriesString.length !== 3 ) {
    return getFallbackSeriesFields();
  }

  // A fallback for when the string is improperly formatted or contains more instances of the separator than expected, not a normal use case.
  if( splitSeriesString.length !== 3 ) {
    return getFallbackSeriesFields();
  }

  const [regionType, regionValue, valueType] = splitSeriesString

  if(!isSeriesValueType(valueType) || !isSeriesRegionType(regionType)) {
    return getFallbackSeriesFields();
  }

  if(regionType === SeriesRegionType.COUNTRY) {
    return {
      regionType,
      countryAlphaTwoCode: regionValue,
      valueType
    }
  }
  if(regionType === SeriesRegionType.GBD_SUB_REGION) {
    return isGbdSubRegion(regionValue) ? {
      regionType,
      gbdSubRegion: regionValue,
      valueType
    } : getFallbackSeriesFields();
  }
  if(regionType === SeriesRegionType.GBD_SUPER_REGION) {
    return isGbdSuperRegion(regionValue) ? {
      regionType,
      gbdSuperRegion: regionValue,
      valueType
    } : getFallbackSeriesFields();
  }
  if(regionType === SeriesRegionType.UN_REGION) {
    return isUNRegion(regionValue) ? {
      regionType,
      unRegion: regionValue,
      valueType
    } : getFallbackSeriesFields();
  }
  if(regionType === SeriesRegionType.WHO_REGION) {
    return isWHORegion(regionValue) ? {
      regionType,
      whoRegion: regionValue,
      valueType
    } : getFallbackSeriesFields();
  }
  if(regionType === SeriesRegionType.GLOBAL) {
    return {
      regionType,
      valueType
    }
  }

  assertNever(regionType)
}


const valueTypeToLabelMap = {
  [SeriesValueType.VACCINATIONS]: "Vaccination Coverage",
  [SeriesValueType.POSITIVE_CASES]: "Cumulative Incidence of Positive Cases",
  [SeriesValueType.SEROPREVALENCE]: "Seroprevalence",
}

interface SeriesFieldsToLabelInput {
  seriesFields: SeriesFields;
  countryAlphaTwoCodeToCountryNameMap: Record<string, string | unknown>;
}

const seriesFieldsToLabel = (input: SeriesFieldsToLabelInput): string => {
  const { seriesFields, countryAlphaTwoCodeToCountryNameMap } = input;

  if(seriesFields.regionType === SeriesRegionType.COUNTRY) {
    return `${countryAlphaTwoCodeToCountryNameMap[seriesFields.countryAlphaTwoCode] ?? seriesFields.countryAlphaTwoCode} ${valueTypeToLabelMap[seriesFields.valueType]}`;
  }
  if(seriesFields.regionType === SeriesRegionType.GBD_SUB_REGION) {
    return `${gbdSubRegionToLabelMap[seriesFields.gbdSubRegion]} ${valueTypeToLabelMap[seriesFields.valueType]}`;
  }
  if(seriesFields.regionType === SeriesRegionType.GBD_SUPER_REGION) {
    return `${gbdSuperRegionToLabelMap[seriesFields.gbdSuperRegion]} ${valueTypeToLabelMap[seriesFields.valueType]}`;
  }
  if(seriesFields.regionType === SeriesRegionType.UN_REGION) {
    return `${unRegionEnumToLabelMap[seriesFields.unRegion]} ${valueTypeToLabelMap[seriesFields.valueType]}`;
  }
  if(seriesFields.regionType === SeriesRegionType.WHO_REGION) {
    // Intentional. AMR, SEAR, WPR, etc. are already the correct display name.
    return `${seriesFields.whoRegion} ${valueTypeToLabelMap[seriesFields.valueType]}`;
  }
  if(seriesFields.regionType === SeriesRegionType.GLOBAL) {
    return `Global ${valueTypeToLabelMap[seriesFields.valueType]}`;
  }

  assertNever(seriesFields);
}

export const useComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeSeries = () => {
  const { countryAlphaTwoCodeToCountryNameMap } = useContext(CountryInformationContext);

  const getAllSeries = (input: GetAllSeriesInput): GetAllSeriesOutput => ({
    seriesStrings: getAllSeriesFields(input)
      .filter((seriesFields) => (seriesFields.regionType !== SeriesRegionType.COUNTRY) || (seriesFields.countryAlphaTwoCode === input.dataPoint.alphaTwoCode))
      .filter((seriesFields) => (seriesFields.regionType !== SeriesRegionType.GBD_SUB_REGION) || (!!input.dataPoint.gbdSubRegion && seriesFields.gbdSubRegion === input.dataPoint.gbdSubRegion))
      .filter((seriesFields) => (seriesFields.regionType !== SeriesRegionType.GBD_SUPER_REGION) || (!!input.dataPoint.gbdSuperRegion && seriesFields.gbdSuperRegion === input.dataPoint.gbdSuperRegion))
      .filter((seriesFields) => (seriesFields.regionType !== SeriesRegionType.WHO_REGION) || (!!input.dataPoint.whoRegion && seriesFields.whoRegion === input.dataPoint.whoRegion))
      .filter((seriesFields) => (seriesFields.regionType !== SeriesRegionType.UN_REGION) || (!!input.dataPoint.unRegion && seriesFields.unRegion === input.dataPoint.unRegion))
      .map((seriesFields) => seriesFieldsToSeriesString(seriesFields))
  })

  const seriesStringToLabel = (input: SeriesString): string => {
    return seriesFieldsToLabel({
      seriesFields: seriesStringToSeriesFields(
        input
      ),
      countryAlphaTwoCodeToCountryNameMap
    });
  }

  return {
    getAllSeries,
    seriesStringToLabel,
  }
}