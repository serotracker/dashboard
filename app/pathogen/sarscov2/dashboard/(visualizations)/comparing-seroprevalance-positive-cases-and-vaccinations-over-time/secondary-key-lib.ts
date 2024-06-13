import { useContext } from "react";
import { GbdSubRegion, GbdSuperRegion, UnRegion, WhoRegion } from "@/gql/graphql";
import { SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sarscov2/sc2-context";
import assertNever from "assert-never";
import { gbdSubRegionToLabelMap, gbdSuperRegionToLabelMap, isGbdSubRegion, isGbdSuperRegion } from "@/lib/gbd-regions";
import { isUNRegion, unRegionEnumToLabelMap } from "@/lib/un-regions";
import { isWHORegion } from "@/lib/who-regions";
import { CountryInformationContext } from "@/contexts/pathogen-context/country-information-context";

export enum SecondaryKeyValueType {
  VACCINATIONS = "VACCINATIONS",
  POSITIVE_CASES = "POSITIVE_CASES",
  SEROPREVALENCE = "SEROPREVALENCE",
}

const isSecondaryKeyValueType = (valueType: string): valueType is SecondaryKeyValueType =>
  Object.values(SecondaryKeyValueType).some((element) => element === valueType)

export enum SecondaryKeyRegionType {
  GLOBAL = "GLOBAL",
  WHO_REGION = "WHO_REGION",
  UN_REGION = "UN_REGION",
  COUNTRY = "COUNTRY",
  GBD_SUPER_REGION = "GBD_SUPER_REGION",
  GBD_SUB_REGION = "GBD_SUB_REGION"
}

export const isSecondaryKeyRegionType = (regionType: string): regionType is SecondaryKeyRegionType =>
  Object.values(SecondaryKeyRegionType).some((element) => element === regionType)

export type SecondaryKeyFieldsRegionPortion = {
  regionType: SecondaryKeyRegionType.GLOBAL
} | {
  regionType: SecondaryKeyRegionType.WHO_REGION,
  whoRegion: WhoRegion,
} | {
  regionType: SecondaryKeyRegionType.UN_REGION,
  unRegion: UnRegion,
} | {
  regionType: SecondaryKeyRegionType.COUNTRY,
  countryAlphaTwoCode: string,
} | {
  regionType: SecondaryKeyRegionType.GBD_SUPER_REGION,
  gbdSuperRegion: GbdSuperRegion
} | {
  regionType: SecondaryKeyRegionType.GBD_SUB_REGION,
  gbdSubRegion: GbdSubRegion
}

type SecondaryKeyFields = SecondaryKeyFieldsRegionPortion & {
  valueType: SecondaryKeyValueType
}

interface GetAllSecondaryKeysInput {
  estimate: Pick<SarsCov2Estimate, 'whoRegion'|'countryAlphaTwoCode'|'unRegion'|'gbdSubRegion'|'gbdSuperRegion'>;
  secondaryKeyRegionPortions: SecondaryKeyFieldsRegionPortion[];
}

interface GetAllSecondaryKeysOutput {
  secondaryKeyStrings: SecondaryKeyString[],
}

const secondaryKeyStringSeperator = '___'

type SecondaryKeyString = `${SecondaryKeyRegionType}${typeof secondaryKeyStringSeperator}${string}${typeof secondaryKeyStringSeperator}${SecondaryKeyValueType}`

const getAllSecondaryKeyFields = (input: GetAllSecondaryKeysInput): SecondaryKeyFields[] => {
  return input.secondaryKeyRegionPortions.flatMap((secondaryKeyFields) => [
    { ...secondaryKeyFields, valueType: SecondaryKeyValueType.VACCINATIONS },
    { ...secondaryKeyFields, valueType: SecondaryKeyValueType.POSITIVE_CASES },
    { ...secondaryKeyFields, valueType: SecondaryKeyValueType.SEROPREVALENCE }
  ])
}

const secondaryKeyFieldsToSecondaryKeyString = (secondaryKeyFields: SecondaryKeyFields): SecondaryKeyString => {
  if(secondaryKeyFields.regionType === SecondaryKeyRegionType.COUNTRY) {
    return `${secondaryKeyFields.regionType}${secondaryKeyStringSeperator}${secondaryKeyFields.countryAlphaTwoCode}${secondaryKeyStringSeperator}${secondaryKeyFields.valueType}`
  }
  if(secondaryKeyFields.regionType === SecondaryKeyRegionType.GBD_SUB_REGION) {
    return `${secondaryKeyFields.regionType}${secondaryKeyStringSeperator}${secondaryKeyFields.gbdSubRegion}${secondaryKeyStringSeperator}${secondaryKeyFields.valueType}`
  }
  if(secondaryKeyFields.regionType === SecondaryKeyRegionType.GBD_SUPER_REGION) {
    return `${secondaryKeyFields.regionType}${secondaryKeyStringSeperator}${secondaryKeyFields.gbdSuperRegion}${secondaryKeyStringSeperator}${secondaryKeyFields.valueType}`
  }
  if(secondaryKeyFields.regionType === SecondaryKeyRegionType.UN_REGION) {
    return `${secondaryKeyFields.regionType}${secondaryKeyStringSeperator}${secondaryKeyFields.unRegion}${secondaryKeyStringSeperator}${secondaryKeyFields.valueType}`
  }
  if(secondaryKeyFields.regionType === SecondaryKeyRegionType.WHO_REGION) {
    return `${secondaryKeyFields.regionType}${secondaryKeyStringSeperator}${secondaryKeyFields.whoRegion}${secondaryKeyStringSeperator}${secondaryKeyFields.valueType}`
  }
  if(secondaryKeyFields.regionType === SecondaryKeyRegionType.GLOBAL) {
    return `${secondaryKeyFields.regionType}${secondaryKeyStringSeperator}GLOBAL${secondaryKeyStringSeperator}${secondaryKeyFields.valueType}`
  }

  assertNever(secondaryKeyFields);
}

const getFallbackSecondaryKeyFields = (): SecondaryKeyFields => ({
  regionType: SecondaryKeyRegionType.GLOBAL,
  valueType: SecondaryKeyValueType.SEROPREVALENCE
})

export const secondaryKeyStringToSecondaryKeyFields = (secondaryKeyString: SecondaryKeyString): SecondaryKeyFields => {
  const splitSecondaryKeyString = secondaryKeyString.split(secondaryKeyStringSeperator)

  // A fallback for when the string is improperly formatted or contains more instances of the separator than expected, not a normal use case.
  if( splitSecondaryKeyString.length !== 3 ) {
    return getFallbackSecondaryKeyFields();
  }

  // A fallback for when the string is improperly formatted or contains more instances of the separator than expected, not a normal use case.
  if( splitSecondaryKeyString.length !== 3 ) {
    return getFallbackSecondaryKeyFields();
  }

  const [regionType, regionValue, valueType] = splitSecondaryKeyString

  if(!isSecondaryKeyValueType(valueType) || !isSecondaryKeyRegionType(regionType)) {
    return getFallbackSecondaryKeyFields();
  }

  if(regionType === SecondaryKeyRegionType.COUNTRY) {
    return {
      regionType,
      countryAlphaTwoCode: regionValue,
      valueType
    }
  }
  if(regionType === SecondaryKeyRegionType.GBD_SUB_REGION) {
    return isGbdSubRegion(regionValue) ? {
      regionType,
      gbdSubRegion: regionValue,
      valueType
    } : getFallbackSecondaryKeyFields();
  }
  if(regionType === SecondaryKeyRegionType.GBD_SUPER_REGION) {
    return isGbdSuperRegion(regionValue) ? {
      regionType,
      gbdSuperRegion: regionValue,
      valueType
    } : getFallbackSecondaryKeyFields();
  }
  if(regionType === SecondaryKeyRegionType.UN_REGION) {
    return isUNRegion(regionValue) ? {
      regionType,
      unRegion: regionValue,
      valueType
    } : getFallbackSecondaryKeyFields();
  }
  if(regionType === SecondaryKeyRegionType.WHO_REGION) {
    return isWHORegion(regionValue) ? {
      regionType,
      whoRegion: regionValue,
      valueType
    } : getFallbackSecondaryKeyFields();
  }
  if(regionType === SecondaryKeyRegionType.GLOBAL) {
    return {
      regionType,
      valueType
    }
  }

  assertNever(regionType)
}


const valueTypeToLabelMap = {
  [SecondaryKeyValueType.VACCINATIONS]: "Vaccination Coverage",
  [SecondaryKeyValueType.POSITIVE_CASES]: "Cumulative Incidence of Positive Cases",
  [SecondaryKeyValueType.SEROPREVALENCE]: "Seroprevalence",
}

interface SecondaryKeyFieldsToLabelInput {
  secondaryKeyFields: SecondaryKeyFields;
  countryAlphaTwoCodeToCountryNameMap: Record<string, string | unknown>;
}

const secondaryKeyFieldsToLabel = (input: SecondaryKeyFieldsToLabelInput): string => {
  const { secondaryKeyFields, countryAlphaTwoCodeToCountryNameMap } = input;

  if(secondaryKeyFields.regionType === SecondaryKeyRegionType.COUNTRY) {
    return `${countryAlphaTwoCodeToCountryNameMap[secondaryKeyFields.countryAlphaTwoCode] ?? secondaryKeyFields.countryAlphaTwoCode} ${valueTypeToLabelMap[secondaryKeyFields.valueType]}`;
  }
  if(secondaryKeyFields.regionType === SecondaryKeyRegionType.GBD_SUB_REGION) {
    return `${gbdSubRegionToLabelMap[secondaryKeyFields.gbdSubRegion]} ${valueTypeToLabelMap[secondaryKeyFields.valueType]}`;
  }
  if(secondaryKeyFields.regionType === SecondaryKeyRegionType.GBD_SUPER_REGION) {
    return `${gbdSuperRegionToLabelMap[secondaryKeyFields.gbdSuperRegion]} ${valueTypeToLabelMap[secondaryKeyFields.valueType]}`;
  }
  if(secondaryKeyFields.regionType === SecondaryKeyRegionType.UN_REGION) {
    return `${unRegionEnumToLabelMap[secondaryKeyFields.unRegion]} ${valueTypeToLabelMap[secondaryKeyFields.valueType]}`;
  }
  if(secondaryKeyFields.regionType === SecondaryKeyRegionType.WHO_REGION) {
    // Intentional. AMR, SEAR, WPR, etc. are already the correct display name.
    return `${secondaryKeyFields.whoRegion} ${valueTypeToLabelMap[secondaryKeyFields.valueType]}`;
  }
  if(secondaryKeyFields.regionType === SecondaryKeyRegionType.GLOBAL) {
    return `Global ${valueTypeToLabelMap[secondaryKeyFields.valueType]}`;
  }

  assertNever(secondaryKeyFields);
}

export const useComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeSecondaryKeyFunctions = () => {
  const { countryAlphaTwoCodeToCountryNameMap } = useContext(CountryInformationContext);

  const getAllSecondaryKeys = (input: GetAllSecondaryKeysInput): GetAllSecondaryKeysOutput => ({
    secondaryKeyStrings: getAllSecondaryKeyFields(input)
      .filter((secondaryKeyFields) => (secondaryKeyFields.regionType !== SecondaryKeyRegionType.COUNTRY) || (secondaryKeyFields.countryAlphaTwoCode === input.estimate.countryAlphaTwoCode))
      .filter((secondaryKeyFields) => (secondaryKeyFields.regionType !== SecondaryKeyRegionType.GBD_SUB_REGION) || (!!input.estimate.gbdSubRegion && secondaryKeyFields.gbdSubRegion === input.estimate.gbdSubRegion))
      .filter((secondaryKeyFields) => (secondaryKeyFields.regionType !== SecondaryKeyRegionType.GBD_SUPER_REGION) || (!!input.estimate.gbdSuperRegion && secondaryKeyFields.gbdSuperRegion === input.estimate.gbdSuperRegion))
      .filter((secondaryKeyFields) => (secondaryKeyFields.regionType !== SecondaryKeyRegionType.WHO_REGION) || (!!input.estimate.whoRegion && secondaryKeyFields.whoRegion === input.estimate.whoRegion))
      .filter((secondaryKeyFields) => (secondaryKeyFields.regionType !== SecondaryKeyRegionType.UN_REGION) || (!!input.estimate.unRegion && secondaryKeyFields.unRegion === input.estimate.unRegion))
      .map((secondaryKeyFields) => secondaryKeyFieldsToSecondaryKeyString(secondaryKeyFields))
  })

  const secondaryKeyStringToLabel = (input: SecondaryKeyString): string => {
    return secondaryKeyFieldsToLabel({
      secondaryKeyFields: secondaryKeyStringToSecondaryKeyFields(
        input
      ),
      countryAlphaTwoCodeToCountryNameMap
    });
  }

  return {
    getAllSecondaryKeys,
    secondaryKeyStringToLabel,
  }
}