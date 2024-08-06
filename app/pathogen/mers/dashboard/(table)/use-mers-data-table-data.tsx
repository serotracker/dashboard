import {
  useContext,
  useMemo
} from "react"
import {
  isMersSeroprevalenceEstimate,
  isMersViralEstimate,
  MersContext,
  MersSeroprevalenceEstimate,
  MersViralEstimate
} from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { mapMersEstimateBaseForDataTable, MersEstimateBaseForDataTable } from "./mers-seroprevalence-and-viral-estimates-shared-column-configuration";
import { CamelPopulationDataContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/camel-population-data-context";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { formatCamelsPerCapita } from "../(map)/country-highlight-layers/camels-per-capita-layer";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { MersDiagnosisStatus, MersEventAnimalSpecies, MersEventAnimalType, MersEventType } from "@/gql/graphql";

export type FaoYearlyCamelPopulationDataEntryForTable = Omit<FaoYearlyCamelPopulationDataEntry, 'country'|'camelCountPerCapita'|'countryAlphaThreeCode'|'countryAlphaTwoCode'> & {
  country: string;
  camelCountPerCapita: string | undefined;
  countryAlphaThreeCode: string;
  countryAlphaTwoCode: string;
  rawCountry: FaoYearlyCamelPopulationDataEntry['country'],
  rawCamelCountPerCapita: FaoYearlyCamelPopulationDataEntry['camelCountPerCapita'],
  rawCountryAlphaThreeCode: FaoYearlyCamelPopulationDataEntry['countryAlphaThreeCode'],
}

const formatFaoCamelPopulationDataForTable = (dataPoint: FaoYearlyCamelPopulationDataEntry): FaoYearlyCamelPopulationDataEntryForTable => ({
  ...dataPoint,
  country: dataPoint.country.name,
  camelCountPerCapita: dataPoint.camelCountPerCapita ? formatCamelsPerCapita(dataPoint.camelCountPerCapita) : undefined,
  countryAlphaThreeCode: dataPoint.country.alphaThreeCode,
  countryAlphaTwoCode: dataPoint.country.alphaTwoCode,
  rawCountry: dataPoint.country,
  rawCamelCountPerCapita: dataPoint.camelCountPerCapita,
  rawCountryAlphaThreeCode: dataPoint.countryAlphaThreeCode,
})

export const unformatFaoCamelPopulationDataFromTable = (dataPoint: FaoYearlyCamelPopulationDataEntryForTable): FaoYearlyCamelPopulationDataEntry => ({
  ...dataPoint,
  country: dataPoint.rawCountry,
  camelCountPerCapita: dataPoint.rawCamelCountPerCapita,
  countryAlphaThreeCode: dataPoint.rawCountryAlphaThreeCode
});

type FaoMersEventForTableBase = {
  id: FaoMersEvent['id'];
  diagnosisStatus: FaoMersEvent['diagnosisStatus'];
  diagnosisSource: FaoMersEvent['diagnosisSource'];
  eventRawCountry: FaoMersEvent['country'];
  state: FaoMersEvent['state'];
  city: FaoMersEvent['city'];
  eventRawLatitude: FaoMersEvent['latitude'];
  eventRawLongitude: FaoMersEvent['longitude'];
  whoRegion?: FaoMersEvent['whoRegion'];
  observationDate?: FaoMersEvent['observationDate'];
  reportDate: FaoMersEvent['reportDate'];
  country: string;
  latitude: string;
  longitude: string;
} & Record<string, unknown>;

type AnimalFaoMersEventForTable = FaoMersEventForTableBase & {
  __typename: "AnimalMersEvent"
  type: MersEventType.Animal,
  animalType: MersEventAnimalType,
  animalSpecies: MersEventAnimalSpecies
}

type HumanFaoMersEventForTable = FaoMersEventForTableBase & {
  __typename: "HumanMersEvent"
  type: MersEventType.Human,
  humansAffected: number,
  humanDeaths: number,
}

export type FaoMersEventForTable = 
  | AnimalFaoMersEventForTable
  | HumanFaoMersEventForTable;

const formatMersEventDataForTable = (dataPoint: FaoMersEvent): FaoMersEventForTable => {
  if(dataPoint.__typename === "HumanMersEvent") {
    return {
      ...dataPoint,
      type: MersEventType.Human,
      eventRawLatitude: dataPoint.latitude,
      eventRawLongitude: dataPoint.longitude,
      eventRawCountry: dataPoint.country,
      country: dataPoint.country.name,
      latitude: dataPoint.latitude.toFixed(2),
      longitude: dataPoint.longitude.toFixed(2),
    }
  } else {
    return {
      ...dataPoint,
      type: MersEventType.Animal,
      eventRawLatitude: dataPoint.latitude,
      eventRawLongitude: dataPoint.longitude,
      eventRawCountry: dataPoint.country,
      country: dataPoint.country.name,
      latitude: dataPoint.latitude.toFixed(2),
      longitude: dataPoint.longitude.toFixed(2),
    }
  }
}

export const unformatMersEventDataFromTable = (dataPoint: FaoMersEventForTable): FaoMersEvent => {
  if(dataPoint.__typename === "HumanMersEvent") {
    return {
      ...dataPoint,
      latitude: dataPoint.eventRawLatitude,
      longitude: dataPoint.eventRawLongitude,
      country: dataPoint.eventRawCountry,
    }
  } else {
    return {
      ...dataPoint,
      latitude: dataPoint.eventRawLatitude,
      longitude: dataPoint.eventRawLongitude,
      country: dataPoint.eventRawCountry,
    }
  }
}

export type MersSeroprevalenceEstimateForDataTable = MersSeroprevalenceEstimate & MersEstimateBaseForDataTable & {
  primaryEstimateId: string;
  primaryEstimateTypename: "PrimaryHumanMersSeroprevalenceEstimateInformation" | "PrimaryAnimalMersSeroprevalenceEstimateInformation";
  primaryEstimateSeroprevalence: number;
  primaryEstimateSeroprevalence95CILower: number | undefined | null;
  primaryEstimateSeroprevalence95CIUpper: number | undefined | null;
}

export type MersViralEstimateForDataTable = MersViralEstimate & MersEstimateBaseForDataTable & {
  primaryEstimateId: string;
  primaryEstimateTypename: "PrimaryHumanMersViralEstimateInformation" | "PrimaryAnimalMersViralEstimateInformation";
  primaryEstimatePositivePrevalence: number;
  primaryEstimatePositivePrevalence95CILower: number | undefined | null;
  primaryEstimatePositivePrevalence95CIUpper: number | undefined | null;
}

export interface UseMersDataTableDataOutput {
  mersSeroprevalenceEstimateData: MersSeroprevalenceEstimateForDataTable[],
  mersViralEstimateData: MersViralEstimateForDataTable[],
  mersEventData: FaoMersEventForTable[],
  camelPopulationData: FaoYearlyCamelPopulationDataEntryForTable[]
}

export const useMersDataTableData = (): UseMersDataTableDataOutput => {
  const { filteredData } = useContext(MersContext);
  const { faoMersEventData } = useContext(MersContext);
  const { latestFaoCamelPopulationDataPointsByCountry } = useContext(CamelPopulationDataContext);

  const mersSeroprevalenceEstimateData = useMemo(() => (filteredData
    .filter((dataPoint): dataPoint is MersSeroprevalenceEstimate => isMersSeroprevalenceEstimate(dataPoint))
    .map((dataPoint) => ({
      ...dataPoint,
      ...mapMersEstimateBaseForDataTable(dataPoint),
      primaryEstimateId: dataPoint.primaryEstimateInfo.estimateId,
      primaryEstimateTypename: dataPoint.primaryEstimateInfo.__typename,
      primaryEstimateSeroprevalence: dataPoint.primaryEstimateInfo.seroprevalence,
      primaryEstimateSeroprevalence95CILower: dataPoint.primaryEstimateInfo.seroprevalence95CILower,
      primaryEstimateSeroprevalence95CIUpper: dataPoint.primaryEstimateInfo.seroprevalence95CIUpper,
    }))
  ), [ filteredData ]);

  const mersViralEstimateData = useMemo(() => (filteredData
    .filter((dataPoint): dataPoint is MersViralEstimate => isMersViralEstimate(dataPoint))
    .map((dataPoint) => ({
      ...dataPoint,
      ...mapMersEstimateBaseForDataTable(dataPoint),
      primaryEstimateId: dataPoint.primaryEstimateInfo.estimateId,
      primaryEstimateTypename: dataPoint.primaryEstimateInfo.__typename,
      primaryEstimatePositivePrevalence: dataPoint.primaryEstimateInfo.positivePrevalence,
      primaryEstimatePositivePrevalence95CILower: dataPoint.primaryEstimateInfo.positivePrevalence95CILower,
      primaryEstimatePositivePrevalence95CIUpper: dataPoint.primaryEstimateInfo.positivePrevalence95CIUpper,
    }))
  ), [ filteredData ]);

  const mersEventData = useMemo(() => (faoMersEventData
    .filter((event) => event.diagnosisStatus === MersDiagnosisStatus.Confirmed)
    .map((event) => formatMersEventDataForTable(event))
  ), [ faoMersEventData ]);
  
  const camelPopulationData = useMemo(() => (
    latestFaoCamelPopulationDataPointsByCountry ?? []).map((dataPoint) => formatFaoCamelPopulationDataForTable(dataPoint)
  ), [ latestFaoCamelPopulationDataPointsByCountry ]);

  return {
    mersSeroprevalenceEstimateData,
    mersViralEstimateData,
    mersEventData,
    camelPopulationData
  }
}