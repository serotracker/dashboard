import { useCallback } from 'react';
import { AlternateViewConfigurationTableConfiguration } from "@/components/ui/pathogen-map/map-pop-up/map-pop-up-alternate-configuration";
import { PopUpContentRowProps, PopUpContentRowType } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import {
  AnimalMersEvent,
  AnimalMersSeroprevalenceEstimate,
  AnimalMersViralEstimate,
  HumanMersEvent,
  HumanMersSeroprevalenceEstimate,
  HumanMersViralEstimate,
  MersEstimate,
  MersSeroprevalenceEstimate,
  MersSubEstimateInformation,
  MersViralEstimate,
  isAnimalMersEstimate,
  isHumanMersAgeGroupSubEstimate,
  isHumanMersEstimate,
  isMersSeroprevalenceSubEstimateInformation,
  isMersViralEstimate,
  isMersViralSubEstimateInformation
} from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import {
  MersDiagnosisSource,
  MersDiagnosisStatus,
  MersAnimalSpecies,
  MersEventAnimalType,
  MersAnimalType,
  Clade,
  GenomeSequenced,
  WhoRegion
} from "@/gql/graphql"
import { TranslateDate } from "@/utils/translate-util/translate-service";
import assertNever from "assert-never";
import { parseISO } from "date-fns";
import { MapDataPointVisibilityOptions } from "./use-mers-map-customization-modal";
import { useContext } from "react";
import { CountryInformationContext } from "@/contexts/pathogen-context/country-information-context";

export const diagnosisStatusToStringMap = {
  [MersDiagnosisStatus.Confirmed]: "Confirmed",
  [MersDiagnosisStatus.Denied]: "Denied",
}

export const diagnosisStatusToColourClassnameMap = {
  [MersDiagnosisStatus.Confirmed]: "bg-green-600",
  [MersDiagnosisStatus.Denied]: "bg-red-600",
}

export const isMersDiagnosisStatus = (diagnosisStatus: string): diagnosisStatus is MersDiagnosisStatus => Object.values(MersDiagnosisStatus).some((element) => element === diagnosisStatus);

export const sexToColourClassnameMap = {
  'All': 'bg-indigo-300',
  'Female': 'bg-pink-300',
  'Male': 'bg-blue-300'
}

export const sourceTypeToColourClassnameMap = {
  'Journal Article (Peer-Reviewed)': 'bg-purple-300'
}

export const assayToColourClassnameMap = {
  "ELISA": "bg-red-300",
  "RT-PCR": "bg-yellow-300",
  "N2 RT-qPCR": "bg-green-300",
  "N3 RT-qPCR": "bg-violet-300",
  "Neutralization": "bg-cyan-300",
  "Protein microarray": "bg-orange-300",
  "Microneutralization": "bg-rose-300",
  "Pseudoparticle Neutralization": "bg-emerald-300",
  "Virus Neutralization": "bg-teal-300",
  "Immunofluorescence": "bg-fuchsia-300",
  "RT-LAMP": "bg-pink-300",
  "PRNT": "bg-lime-300",
  "Not reported": "bg-blue-300"
}

export const isotypeToColourClassnameMap = {
  "IgG": "bg-teal-300",
  "IgA": "bg-lime-300",
  "IgM": "bg-cyan-300",
  "Total Antibody": "bg-fuchsia-300",
  "Not reported": "bg-rose-300",
  "Neutralizing": "bg-red-300",
  "N/A": "bg-emerald-300"
}

export const specimenTypeToColourClassnameMap = {
  "Nasal Swab or NP": "bg-lime-200",
  "Throat swab or OP": "bg-purple-200",
  "Serum": "bg-orange-200",
  "Saliva": "bg-pink-200",
  "Rectal swab": "bg-teal-200",
	"Milk": "bg-red-200",
	"Lymph nodes": "bg-emerald-200",
	"Whole Blood": "bg-yellow-200",
  "Plasma": "bg-rose-200",
  "Dried Blood": "bg-fuchsia-200",
  "Not reported": "bg-violet-200",
  "Multiple Types": "bg-rose-200",
  "Urine": "bg-green-200",
  "Muscle": "bg-cyan-200",
  "Sputum": "bg-indigo-200",
  "Bronchiol (BAL)": "bg-purple-200"
}

export const animalDetectionSettingsToColourClassnameMap = {
  "Abattoirs": "bg-orange-200",
  "Free-roaming herds": "bg-lime-200",
  "Livestock markets": "bg-cyan-200",
  "Not reported": "bg-red-200",
  "Animal contacts of human cases": "bg-violet-200",
  "Farms": "bg-rose-200",
  "Quarantine": "bg-teal-200",
  "Other": "bg-yellow-200",
  "Multiple populations": "bg-fuchsia-200",
  "Camel racetrack": "bg-indigo-200"
}

export const animalPurposeSettingsToColourClassnameMap = {
  "Slaughter": "bg-emerald-200",
  "Multiple purposes": "bg-sky-200",
  "Not reported": "bg-rose-200",
  "Milking": "bg-purple-200",
  "Meat": "bg-yellow-200",
  "Meat and milk": "bg-orange-200",
  "Meat, milk, racing": "bg-red-200",
  "Meat production": "bg-lime-200"
}

export const animalImportedOrLocalToColourClassnameMap = {
  "Local": "bg-purple-200",
  "Imported": "bg-yellow-200",
  "Not reported": "bg-sky-200"
}

export const sampleFrameToColourClassnameMap = {
  "Blood donors": "bg-yellow-200",
  "Camel traders": "bg-emerald-200",
  "Livestock workers": "bg-teal-200",
  "Multiple populations": "bg-orange-200",
  "Pilgrims": "bg-amber-200",
  "Livestock handlers": "bg-violet-200",
  "Household and community sample": "bg-emerald-200",
  "Close contacts of camels": "bg-pink-200",
  "Close contacts of cases": "bg-fuchsia-200",
  "Suspected cases": "bg-indigo-200",
  "Marketplace vendor": "bg-red-200",
  "Residual sera": "bg-pink-200",
  "Outpatient population": "bg-yellow-300",
  "Healthcare workers": "bg-emerald-300",
  "Travellers/tourism": "bg-teal-300",
  "Quarantine station workers": "bg-orange-300",
  "Slaughterhouse workers": "bg-amber-300",
  "Nomadic communities": "bg-violet-300",
  "Camel racetrack workers": "bg-emerald-300",
  "Veterinary staff": "bg-pink-300",
  "Veterinary surgeons": "bg-fuchsia-300",
  "Camel herders": "bg-indigo-300"
}

export const samplingMethodToColourClassnameMap = {
  "Convenience": "bg-violet-400",
  "Sequential": "bg-orange-400",
  "Stratified probability": "bg-lime-400",
  "Unclear": "bg-amber-400",
  "Simplified probability": "bg-sky-400",
}

export const geographicScopeToColourClassnameMap = {
  "National": "bg-blue-400",
  "Regional": "bg-orange-400",
  "Local": "bg-red-400"
}

export const testProducerToColourClassnameMap = {
  "Euroimmun": "bg-teal-400",
  "Roche": "bg-fuchsia-400",
  "In-house": "bg-red-400",
  "Not reported": "bg-pink-400",
  "Altona Diagnostics": "bg-sky-400",
  "Other": "bg-orange-400",
  "QIAGEN": "bg-violet-400",
  "Corman": "bg-indigo-400",
  "QProbe": "bg-rose-400",
  "Eiken": "bg-blue-400",
  "TaqMan": "bg-orange-400",
}

export const testValidationToColourClassnameMap = {
  "Validated by developers": "bg-yellow-400",
  "Validated by independent authors": "bg-red-400",
  "Not reported": "bg-pink-400"
}

export const antigenToColourClassnameMap = {
  "S1": "bg-orange-300",
  "Not reported": "bg-lime-300",
  "UpE": "bg-sky-300",
  "N": "bg-violet-300",
  "Spike RBD": "bg-red-300",
  "ORF1a": "bg-yellow-300",
  "ORF1A": "bg-yellow-300",
  "N2": "bg-indigo-300",
  "N3": "bg-emerald-300",
  "LAMP ORF1a": "bg-cyan-300",
  "S": "bg-rose-300",
  "ORF1b": "bg-fuchsia-300",
}

export const exposureToCamelLevelToColourClassnameMap = {
  "Mixed exposure": "bg-fuchsia-500",
  "Unknown exposure": "bg-lime-500",
  "Direct exposure": "bg-indigo-500",
  "Indirect exposure": "bg-orange-500",
  "No or limited exposure": "bg-teal-500"
}

export const animalTypeToStringMap = {
  [MersEventAnimalType.Domestic]: "Domestic",
  [MersEventAnimalType.Wild]: "Wild",
}

export const animalTypeToColourClassnameMap = {
  [MersEventAnimalType.Domestic]: "bg-sky-300",
  [MersEventAnimalType.Wild]: "bg-emerald-300",
}

export const isMersEventAnimalType = (animalType: string): animalType is MersEventAnimalType => Object.values(MersEventAnimalType).some((element) => element === animalType);
export const isMersAnimalType = (animalType: string): animalType is MersAnimalType => Object.values(MersAnimalType).some((element) => element === animalType);

export const animalSpeciesToStringMap = {
  [MersAnimalSpecies.Bat]: "Bat",
  [MersAnimalSpecies.DromedaryCamel]: "Dromedary Camel",
  [MersAnimalSpecies.BactrianCamel]: "Bactrian Camel",
  [MersAnimalSpecies.Goat]: "Goat",
  [MersAnimalSpecies.Horse]: "Horse",
  [MersAnimalSpecies.Mule]: "Mule",
  [MersAnimalSpecies.Buffalo]: "Buffalo",
  [MersAnimalSpecies.Cattle]: "Cattle",
  [MersAnimalSpecies.Sheep]: "Sheep",
  [MersAnimalSpecies.Donkey]: "Donkey",
  [MersAnimalSpecies.WaterBuffalo]: "Water Buffalo",
  [MersAnimalSpecies.Baboon]: "Baboon",
}

export const cladeToColourClassnameMap = {
  [Clade.A]: "bg-yellow-200",
  [Clade.B]: "bg-emerald-200",
  [Clade.C1]: "bg-teal-200",
  [Clade.C2]: "bg-orange-200",
  [Clade.C]: "bg-amber-200",
}

export const isGenomeSequenced = (genomeSequenced: string): genomeSequenced is GenomeSequenced => Object.values(GenomeSequenced).some((element) => element === genomeSequenced);

export const genomeSequenceToColourClassnameMap = {
  [GenomeSequenced.FullLength]: "bg-pink-300",
  [GenomeSequenced.PartialNGene]: "bg-red-200",
  [GenomeSequenced.PartialSGene]: "bg-green-200",
}

export const genomeSequenceToStringMap = {
  [GenomeSequenced.FullLength]: "Full length",
  [GenomeSequenced.PartialNGene]: "Partial N gene",
  [GenomeSequenced.PartialSGene]: "Partial S gene"
}

export const animalSpeciesToColourClassnameMap = {
  [MersAnimalSpecies.Bat]: "bg-orange-700",
  [MersAnimalSpecies.DromedaryCamel]: "bg-yellow-300",
  [MersAnimalSpecies.BactrianCamel]: "bg-purple-200",
  [MersAnimalSpecies.Mule]: "bg-cyan-300",
  [MersAnimalSpecies.Horse]: "bg-lime-200",
  [MersAnimalSpecies.Buffalo]: "bg-amber-200",
  [MersAnimalSpecies.Goat]: "bg-sky-300",
  [MersAnimalSpecies.Cattle]: "bg-pink-300",
  [MersAnimalSpecies.Sheep]: "bg-red-200",
  [MersAnimalSpecies.Donkey]: "bg-green-200",
  [MersAnimalSpecies.WaterBuffalo]: "bg-teal-400",
  [MersAnimalSpecies.Baboon]: "bg-blue-400",
}

export const humanAgeGroupToColourClassnameMap = {
  'Adults (18-45 years)': "bg-red-300",
  'Adults (46-59 years)': "bg-cyan-300",
  'Children and youth (0-17 years)': "bg-lime-300",
  'Seniors (≥60 years)': "bg-amber-300",
}

export const animalAgeGroupToColourClassnameMap = {
  'Adult (>2 years)': "bg-orange-300",
  'Juvenile (6 months-2 years)': 'bg-purple-300',
  'Neonatal (≤6 months)': 'bg-rose-300'
}

export const isMersAnimalSpecies = (animalSpecies: string): animalSpecies is MersAnimalSpecies => Object.values(MersAnimalSpecies).some((element) => element === animalSpecies);

export const diagnosisSourceToStringMap = {
  [MersDiagnosisSource.FaoFieldOfficer]: "FAO Field Officer",
  [MersDiagnosisSource.Media]: "Media",
  [MersDiagnosisSource.NationalAuthorities]: "National Authorities",
  [MersDiagnosisSource.WorldOrganisationForAnimalHealth]: "World Organisation For Animal Health",
  [MersDiagnosisSource.WorldHealthOrganization]: "World Health Organization",
  [MersDiagnosisSource.Publications]: "Publications",
}

export const diagnosisSourceToColourClassnameMap = {
  [MersDiagnosisSource.FaoFieldOfficer]: "bg-orange-300",
  [MersDiagnosisSource.Media]: "bg-lime-300",
  [MersDiagnosisSource.NationalAuthorities]: "bg-purple-300",
  [MersDiagnosisSource.WorldOrganisationForAnimalHealth]: "bg-pink-300",
  [MersDiagnosisSource.WorldHealthOrganization]: "bg-yellow-300",
  [MersDiagnosisSource.Publications]: "bg-red-300",
}

export const isMersDiagnosisSource = (diagnosisSource: string): diagnosisSource is MersDiagnosisSource => Object.values(MersDiagnosisSource).some((element) => element === diagnosisSource);

export type HumanMersEventMapMarkerData = Omit<HumanMersEvent,'country'> & {
  country: string;
  countryAlphaThreeCode: string;
  countryAlphaTwoCode: string;
};

export type AnimalMersEventMapMarkerData = Omit<AnimalMersEvent,'country'> & {
  country: string;
  countryAlphaThreeCode: string;
  countryAlphaTwoCode: string;
};

export type HumanMersSeroprevalenceEstimateMapMarkerData = HumanMersSeroprevalenceEstimate;
export type AnimalMersSeroprevalenceEstimateMapMarkerData = AnimalMersSeroprevalenceEstimate;
export type HumanMersViralEstimateMapMarkerData = HumanMersViralEstimate;
export type AnimalMersViralEstimateMapMarkerData = AnimalMersViralEstimate;

export const isMersFaoHumanEventMapMarkerData = (mersMapMarkerData: MersMapMarkerData): mersMapMarkerData is HumanMersEventMapMarkerData => 
  mersMapMarkerData.__typename === "HumanMersEvent";

export const isMersFaoAnimalEventMapMarkerData = (mersMapMarkerData: MersMapMarkerData): mersMapMarkerData is AnimalMersEventMapMarkerData => 
  mersMapMarkerData.__typename === "AnimalMersEvent";

export const isHumanMersSeroprevalenceEstimateMapMarkerData = (mersMapMarkerData: MersMapMarkerData): mersMapMarkerData is HumanMersSeroprevalenceEstimateMapMarkerData => 
  'primaryEstimateInfo' in mersMapMarkerData && mersMapMarkerData.primaryEstimateInfo.__typename === 'PrimaryHumanMersSeroprevalenceEstimateInformation';

export const isAnimalMersSeroprevalenceEstimateMapMarkerData = (mersMapMarkerData: MersMapMarkerData): mersMapMarkerData is AnimalMersSeroprevalenceEstimateMapMarkerData => 
  'primaryEstimateInfo' in mersMapMarkerData && mersMapMarkerData.primaryEstimateInfo.__typename === 'PrimaryAnimalMersSeroprevalenceEstimateInformation';

export const isHumanMersViralEstimateMapMarkerData = (mersMapMarkerData: MersMapMarkerData): mersMapMarkerData is HumanMersViralEstimateMapMarkerData => 
  'primaryEstimateInfo' in mersMapMarkerData && mersMapMarkerData.primaryEstimateInfo.__typename === 'PrimaryHumanMersViralEstimateInformation';

export const isAnimalMersViralEstimateMapMarkerData = (mersMapMarkerData: MersMapMarkerData): mersMapMarkerData is AnimalMersViralEstimateMapMarkerData => 
  'primaryEstimateInfo' in mersMapMarkerData && mersMapMarkerData.primaryEstimateInfo.__typename === 'PrimaryAnimalMersViralEstimateInformation';

export const mersDataTypeToSortOrderMap: Record<string, number | undefined> & Record<
  | "PrimaryHumanMersSeroprevalenceEstimateInformation"
  | "PrimaryAnimalMersSeroprevalenceEstimateInformation"
  | "PrimaryHumanMersViralEstimateInformation"
  | "PrimaryAnimalMersViralEstimateInformation"
  | "HumanMersEvent"
  | "AnimalMersEvent"
, number> = {
  "PrimaryHumanMersSeroprevalenceEstimateInformation": 1,
  "PrimaryAnimalMersSeroprevalenceEstimateInformation": 2,
  "PrimaryHumanMersViralEstimateInformation": 3,
  "PrimaryAnimalMersViralEstimateInformation": 4,
  "HumanMersEvent": 5,
  "AnimalMersEvent": 6
};
export const mersDataTypeToLabelMap = {
  "PrimaryHumanMersSeroprevalenceEstimateInformation": "Human Seroprevalence Estimate",
  "PrimaryAnimalMersSeroprevalenceEstimateInformation": "Animal Seroprevalence Estimate",
  "PrimaryHumanMersViralEstimateInformation": "Human Viral Estimate",
  "PrimaryAnimalMersViralEstimateInformation": "Animal Viral Estimate",
  "AnimalMersEvent": "Animal Case",
  "HumanMersEvent": "Human Case",
};

export const mersMapPointVisibilitySettingToHiddenOptionsMap = {
  [MapDataPointVisibilityOptions.NOTHING_VISIBLE]: [
    'PrimaryHumanMersSeroprevalenceEstimateInformation',
    'PrimaryAnimalMersSeroprevalenceEstimateInformation',
    'PrimaryHumanMersViralEstimateInformation',
    'PrimaryAnimalMersViralEstimateInformation',
    'AnimalMersEvent',
    'HumanMersEvent'
  ],
  [MapDataPointVisibilityOptions.EVENTS_ONLY]: [
    'PrimaryHumanMersSeroprevalenceEstimateInformation',
    'PrimaryAnimalMersSeroprevalenceEstimateInformation',
    'PrimaryHumanMersViralEstimateInformation',
    'PrimaryAnimalMersViralEstimateInformation',
  ],
  [MapDataPointVisibilityOptions.ESTIMATES_ONLY]: [
    'AnimalMersEvent',
    'HumanMersEvent'
  ],
  [MapDataPointVisibilityOptions.EVENTS_AND_ESTIMATES_VISIBLE]: []
}

export enum MersDataTypeSuperOption {
  HUMAN = 'HUMAN',
  ANIMAL = 'ANIMAL',
}

export const isMersDataTypeSuperOption = (superOption: string): superOption is MersDataTypeSuperOption =>
  Object.values(MersDataTypeSuperOption).some((element) => element === superOption);

export const isMersDataType = (dataType: string): dataType is
  | "PrimaryHumanMersSeroprevalenceEstimateInformation"
  | "PrimaryAnimalMersSeroprevalenceEstimateInformation"
  | "PrimaryHumanMersViralEstimateInformation"
  | "PrimaryAnimalMersViralEstimateInformation"
  | "AnimalMersEvent"
  | "HumanMersEvent" =>
  [
    "PrimaryHumanMersSeroprevalenceEstimateInformation",
    "PrimaryAnimalMersSeroprevalenceEstimateInformation",
    "PrimaryHumanMersViralEstimateInformation",
    "PrimaryAnimalMersViralEstimateInformation",
    "AnimalMersEvent",
    "HumanMersEvent"
  ].includes(dataType)

export const mersDataTypeToSuperOptionMap = {
  "PrimaryHumanMersSeroprevalenceEstimateInformation": MersDataTypeSuperOption.HUMAN,
  "PrimaryAnimalMersSeroprevalenceEstimateInformation": MersDataTypeSuperOption.ANIMAL,
  "PrimaryHumanMersViralEstimateInformation": MersDataTypeSuperOption.HUMAN,
  "PrimaryAnimalMersViralEstimateInformation": MersDataTypeSuperOption.ANIMAL,
  "HumanMersEvent": MersDataTypeSuperOption.HUMAN,
  "AnimalMersEvent": MersDataTypeSuperOption.ANIMAL
}

export const mersDataTypeSuperOptionToLabelMap = {
  [MersDataTypeSuperOption.HUMAN]: "Human Data",
  [MersDataTypeSuperOption.ANIMAL]: "Animal Data"
}

export const mersDataTypeToColourClassnameMap = {
  "PrimaryHumanMersSeroprevalenceEstimateInformation": "bg-mers-human-estimate",
  "PrimaryHumanMersViralEstimateInformation": "bg-mers-human-viral-estimate",
  "PrimaryAnimalMersSeroprevalenceEstimateInformation": "bg-mers-animal-estimate",
  "PrimaryAnimalMersViralEstimateInformation": "bg-mers-animal-viral-estimate",
  "AnimalMersEvent": "bg-mers-animal-event",
  "HumanMersEvent": "bg-mers-human-event"
}

export const mersDataTypeToColourClassnameMapForCheckbox = {
  "PrimaryHumanMersSeroprevalenceEstimateInformation": "data-[state=checked]:bg-mers-human-estimate",
  "PrimaryHumanMersViralEstimateInformation": "data-[state=checked]:bg-mers-human-viral-estimate",
  "PrimaryAnimalMersSeroprevalenceEstimateInformation": "data-[state=checked]:bg-mers-animal-estimate",
  "PrimaryAnimalMersViralEstimateInformation": "data-[state=checked]:bg-mers-animal-viral-estimate",
  "AnimalMersEvent": "data-[state=checked]:bg-mers-animal-event",
  "HumanMersEvent": "data-[state=checked]:bg-mers-human-event"
}

export const whoRegionToColourClassnameMap: Record<WhoRegion, string> = {
  [WhoRegion.Afr]: "bg-who-region-afr",
  [WhoRegion.Amr]: "bg-who-region-amr",
  [WhoRegion.Emr]: "bg-who-region-emr",
  [WhoRegion.Eur]: "bg-who-region-eur",
  [WhoRegion.Sear]: "bg-who-region-sear",
  [WhoRegion.Wpr]: "bg-who-region-wpr text-white"
};

export const isMersEventTypename = (typename: string):
  typename is "HumanMersEvent"|"AnimalMersEvent" =>
    ["HumanMersEvent","AnimalMersEvent"].includes(typename);
export const isMersSeroprevalenceEstimateTypename = (typename: string):
  typename is "PrimaryHumanMersSeroprevalenceEstimateInformation"|"PrimaryAnimalMersSeroprevalenceEstimateInformation" =>
    ["PrimaryHumanMersSeroprevalenceEstimateInformation","PrimaryAnimalMersSeroprevalenceEstimateInformation"].includes(typename);
export const isMersViralEstimateTypename = (typename: string):
  typename is "PrimaryHumanMersViralEstimateInformation"|"PrimaryAnimalMersViralEstimateInformation" =>
    ["PrimaryHumanMersViralEstimateInformation","PrimaryAnimalMersViralEstimateInformation"].includes(typename);

type AnimalMersEstimateMarkerData = 
  | AnimalMersSeroprevalenceEstimateMapMarkerData
  | AnimalMersViralEstimateMapMarkerData;

type HumanMersEstimateMarkerData = 
  | HumanMersSeroprevalenceEstimateMapMarkerData
  | HumanMersViralEstimateMapMarkerData;

type MersEstimateMapMarkerData = 
  | HumanMersEstimateMarkerData
  | AnimalMersEstimateMarkerData;

export type MersMapMarkerData = 
  | MersEstimateMapMarkerData
  | HumanMersEventMapMarkerData
  | AnimalMersEventMapMarkerData;


interface GetPrevalenceConfidenceIntervalRowsInput {
  estimate: MersEstimateMapMarkerData;
}

interface GetSeroprevalenceConfidenceIntervalRowsInput {
  estimate: MersSeroprevalenceEstimate;
}

interface GetViralPrevalenceConfidenceIntervalRowsInput {
  estimate: MersViralEstimate;
}

interface GetSeroprevalenceConfidenceIntervalRowTextInput {
  estimate: MersSeroprevalenceEstimate;
}

interface GetViralPrevalenceConfidenceIntervalRowTextInput {
  estimate: MersViralEstimate;
}

const getViralPrevalenceConfidenceIntervalRowText = ({ estimate }: GetViralPrevalenceConfidenceIntervalRowTextInput) => {
  const {
    positivePrevalence95CILower,
    positivePrevalenceCalculated95CILower,
    positivePrevalence95CIUpper,
    positivePrevalenceCalculated95CIUpper,
  } = estimate.primaryEstimateInfo;

  const lowerText = (
    (positivePrevalence95CILower === null || positivePrevalence95CILower === undefined) &&
    (positivePrevalenceCalculated95CILower === null || positivePrevalenceCalculated95CILower === undefined)
  )
    ? undefined 
    : `${((positivePrevalence95CILower ?? positivePrevalenceCalculated95CILower ?? 0) * 100).toFixed(3)}%`;

  const upperText = (
    (positivePrevalence95CIUpper === null || positivePrevalence95CIUpper === undefined) &&
    (positivePrevalenceCalculated95CIUpper === null || positivePrevalenceCalculated95CIUpper === undefined)
  )
    ? undefined 
    : `${((positivePrevalence95CIUpper ?? positivePrevalenceCalculated95CIUpper ?? 0) * 100).toFixed(3)}%`;

  if(!!lowerText && !!upperText) {
    return `[${upperText}-${lowerText}]`
  }

  return 'Confidence interval unavailable'
}

const getViralPrevalenceConfidenceIntervalRows = ({ estimate }: GetViralPrevalenceConfidenceIntervalRowsInput) => [{
  title: (
    estimate.primaryEstimateInfo.positivePrevalence95CILower !== null &&
    estimate.primaryEstimateInfo.positivePrevalence95CILower !== undefined &&
    estimate.primaryEstimateInfo.positivePrevalence95CIUpper !== null &&
    estimate.primaryEstimateInfo.positivePrevalence95CIUpper !== undefined
  ) ? "Positive Prevalence 95% Confidence Interval"
    : "Positive Prevalence 95% Confidence Interval (Calculated using the Clopper-Pearson method)",
  type: PopUpContentRowType.TEXT as const,
  text: getViralPrevalenceConfidenceIntervalRowText({ estimate }),
}];

const getSeroprevalenceConfidenceIntervalRowText = ({ estimate }: GetSeroprevalenceConfidenceIntervalRowTextInput) => {
  const {
    seroprevalence95CILower,
    seroprevalenceCalculated95CILower,
    seroprevalence95CIUpper,
    seroprevalenceCalculated95CIUpper,
  } = estimate.primaryEstimateInfo;

  const lowerText = (
    (seroprevalence95CILower === null || seroprevalence95CILower === undefined) &&
    (seroprevalenceCalculated95CILower === null || seroprevalenceCalculated95CILower === undefined)
  )
    ? undefined 
    : `${((seroprevalence95CILower ?? seroprevalenceCalculated95CILower ?? 0) * 100).toFixed(3)}%`;

  const upperText = (
    (seroprevalence95CIUpper === null || seroprevalence95CIUpper === undefined) &&
    (seroprevalenceCalculated95CIUpper === null || seroprevalenceCalculated95CIUpper === undefined)
  )
    ? undefined 
    : `${((seroprevalence95CIUpper ?? seroprevalenceCalculated95CIUpper ?? 0) * 100).toFixed(3)}%`;

  if(!!lowerText && !!upperText) {
    return `[${upperText}-${lowerText}]`
  }

  return 'Confidence interval unavailable'
}

const getSeroprevalenceConfidenceIntervalRows = ({ estimate }: GetSeroprevalenceConfidenceIntervalRowsInput) => [{
  title: (
    estimate.primaryEstimateInfo.seroprevalence95CILower !== null &&
    estimate.primaryEstimateInfo.seroprevalence95CILower !== undefined &&
    estimate.primaryEstimateInfo.seroprevalence95CIUpper !== null &&
    estimate.primaryEstimateInfo.seroprevalence95CIUpper !== undefined
  ) ? "Seroprevalence 95% Confidence Interval"
    : "Seroprevalence 95% Confidence Interval (Calculated using the Clopper-Pearson method)",
  type: PopUpContentRowType.TEXT as const,
  text: getSeroprevalenceConfidenceIntervalRowText({ estimate }),
}];

const getPrevalenceConfidenceIntervalRows = ({ estimate }: GetPrevalenceConfidenceIntervalRowsInput) => isMersViralEstimate(estimate)
  ? getViralPrevalenceConfidenceIntervalRows({ estimate })
  : getSeroprevalenceConfidenceIntervalRows({ estimate });

interface GetCountryOfTravelOrImportRowsInput {
  estimate: MersEstimateMapMarkerData;
  countryNameToColourClassnameMap: Record<string, string | undefined>;
}

const getCountryOfTravelOrImportRows = ({ estimate, countryNameToColourClassnameMap }: GetCountryOfTravelOrImportRowsInput) => isAnimalMersEstimate(estimate) ? [{
  title: 'Countries/Areas of Import',
  type: PopUpContentRowType.COLOURED_PILL_LIST as const,
  values: estimate.primaryEstimateInfo.animalCountriesOfImport
    .map(({ name }) => name),
  valueToColourClassnameMap: countryNameToColourClassnameMap,
  defaultColourClassname: "bg-sky-100",
}] : [{
  title: 'Countries/Areas of Travel',
  type: PopUpContentRowType.COLOURED_PILL_LIST as const,
  values: estimate.primaryEstimateInfo.humanCountriesOfTravel
    .map(({ name }) => name),
  valueToColourClassnameMap: countryNameToColourClassnameMap,
  defaultColourClassname: "bg-sky-100",
}];

interface GetSampleNumeratorAndDenominatorRowsInput {
  estimate: MersEstimateMapMarkerData;
}

const getSampleNumeratorAndDenominatorRows = ({ estimate }: GetSampleNumeratorAndDenominatorRowsInput) => [
  ...(estimate.primaryEstimateInfo.sampleNumerator !== undefined && estimate.primaryEstimateInfo.sampleNumerator !== null
    ? [{
      title: "Sample Numerator",
      type: PopUpContentRowType.NUMBER as const,
      value: estimate.primaryEstimateInfo.sampleNumerator
    }]
    : [{
      title: "Sample Numerator",
      type: PopUpContentRowType.TEXT as const,
      text: 'N/A'
    }]
  ),
  ...(estimate.primaryEstimateInfo.sampleDenominator !== undefined && estimate.primaryEstimateInfo.sampleDenominator !== null
    ? [{
      title: "Sample Denominator",
      type: PopUpContentRowType.NUMBER as const,
      value: estimate.primaryEstimateInfo.sampleDenominator
    }]
    : [{
      title: "Sample Denominator",
      type: PopUpContentRowType.TEXT as const,
      text: 'N/A'
    }]
  ),
];

interface GetSampleFrameRowsInput {
  estimate: MersEstimateMapMarkerData;
}

const getSampleFrameRows = ({ estimate }: GetSampleFrameRowsInput) => isAnimalMersEstimate(estimate) ? [{
  title: 'Animal Sample Frame',
  type: PopUpContentRowType.COLOURED_PILL_LIST as const,
  values: estimate.primaryEstimateInfo.animalDetectionSettings,
  valueToColourClassnameMap: animalDetectionSettingsToColourClassnameMap,
  defaultColourClassname: "bg-sky-100",
}] : [{
  title: "Sample Frame",
  type: PopUpContentRowType.COLOURED_PILL_LIST as const,
  values: estimate.primaryEstimateInfo.sampleFrames,
  valueToColourClassnameMap: sampleFrameToColourClassnameMap,
  valueToLabelMap: {},
  defaultColourClassname: "bg-sky-100"
}];

interface GetGenomicSequencingDoneRowsInput {
  estimate: MersEstimateMapMarkerData;
}

const getGenomicSequencingDoneRows = ({ estimate }: GetGenomicSequencingDoneRowsInput) => estimate.primaryEstimateInfo.sequencingDone ? [{
  title: "Genomic Sequencing Done?",
  type: PopUpContentRowType.TEXT as const,
  text: 'Yes'
}] : [{
  title: "Genomic Sequencing Done?",
  type: PopUpContentRowType.TEXT as const,
  text: 'No'
}];

interface GetAnimalFieldRowsInput {
  estimate: MersEstimateMapMarkerData;
}

const getAnimalFieldRows = ({ estimate }: GetAnimalFieldRowsInput) => isAnimalMersEstimate(estimate) ? [{
  title: "Animal Type",
  type: PopUpContentRowType.COLOURED_PILL_LIST as const,
  values: estimate.primaryEstimateInfo.animalType,
  valueToColourClassnameMap: animalTypeToColourClassnameMap,
  valueToLabelMap: animalTypeToStringMap,
  defaultColourClassname: "bg-sky-100"
}, {
  title: 'Animal Purpose',
  type: PopUpContentRowType.COLOURED_PILL_LIST as const,
  values: estimate.primaryEstimateInfo.animalPurpose ? [ estimate.primaryEstimateInfo.animalPurpose ] : [],
  valueToColourClassnameMap: animalPurposeSettingsToColourClassnameMap,
  defaultColourClassname: "bg-sky-100",
}, {
  title: 'Imported Or Local',
  type: PopUpContentRowType.COLOURED_PILL_LIST as const,
  values: estimate.primaryEstimateInfo.animalImportedOrLocal ? [ estimate.primaryEstimateInfo.animalImportedOrLocal ] : [],
  valueToColourClassnameMap: animalImportedOrLocalToColourClassnameMap,
  defaultColourClassname: "bg-sky-100",
}] : [];

interface GetAgeGroupRowsInput {
  estimate: MersEstimateMapMarkerData;
}

const getAgeGroupRows = ({ estimate }: GetAgeGroupRowsInput) => isAnimalMersEstimate(estimate) ? [{
  title: "Age Group",
  type: PopUpContentRowType.COLOURED_PILL_LIST as const,
  values: estimate.primaryEstimateInfo.animalAgeGroup,
  valueToColourClassnameMap: animalAgeGroupToColourClassnameMap,
  valueToLabelMap: {},
  defaultColourClassname: "bg-sky-100"
}] : [{
  title: "Age Group",
  type: PopUpContentRowType.COLOURED_PILL_LIST as const,
  values: estimate.primaryEstimateInfo.ageGroup,
  valueToColourClassnameMap: humanAgeGroupToColourClassnameMap,
  valueToLabelMap: {},
  defaultColourClassname: "bg-sky-100"
}];

interface GetHumanFieldRowsInput {
  estimate: MersEstimateMapMarkerData;
}

const getHumanFieldRows = ({ estimate }: GetHumanFieldRowsInput) => isHumanMersEstimate(estimate) ? [{
  title: "Exposure To Camels",
  type: PopUpContentRowType.COLOURED_PILL_LIST as const,
  values: estimate.primaryEstimateInfo.exposureToCamels ? [ estimate.primaryEstimateInfo.exposureToCamels ] : [],
  valueToColourClassnameMap: exposureToCamelLevelToColourClassnameMap,
  valueToLabelMap: {},
  defaultColourClassname: "bg-sky-100"
}] : [];

interface GetTestSensitivityFieldsInput {
  estimate: MersEstimateMapMarkerData;
}

const getTestSensitivityFields = ({ estimate }: GetTestSensitivityFieldsInput) => [{
  title: "Test Sensitivity",
  type: PopUpContentRowType.TEXT as const,
  text:  estimate.primaryEstimateInfo.sensitivity !== null && estimate.primaryEstimateInfo.sensitivity !== undefined
    ? `${(estimate.primaryEstimateInfo.sensitivity * 100).toFixed(3)}%`
    : 'Not reported'
}, {
  title: "Test Sensitivity 95% Confidence Interval",
  type: PopUpContentRowType.TEXT as const,
  text: (
    estimate.primaryEstimateInfo.sensitivity95CILower !== null && estimate.primaryEstimateInfo.sensitivity95CILower !== undefined &&
    estimate.primaryEstimateInfo.sensitivity95CIUpper !== null && estimate.primaryEstimateInfo.sensitivity95CIUpper !== undefined
  ) ? `[${(estimate.primaryEstimateInfo.sensitivity95CILower * 100).toFixed(3)}% - ${(estimate.primaryEstimateInfo.sensitivity95CIUpper * 100).toFixed(3)}]`
    : 'Not reported'
}];

interface GetTestSpecificityFieldsInput {
  estimate: MersEstimateMapMarkerData;
}

const getTestSpecificityFields = ({ estimate }: GetTestSpecificityFieldsInput) => [{
  title: "Test Specificity",
  type: PopUpContentRowType.TEXT as const,
  text:  estimate.primaryEstimateInfo.specificity !== null && estimate.primaryEstimateInfo.specificity !== undefined
    ? `${(estimate.primaryEstimateInfo.specificity * 100).toFixed(3)}%`
    : 'Not reported'
}, {
  title: "Test Specificity 95% Confidence Interval",
  type: PopUpContentRowType.TEXT as const,
  text: (
    estimate.primaryEstimateInfo.specificity95CILower !== null && estimate.primaryEstimateInfo.specificity95CILower !== undefined &&
    estimate.primaryEstimateInfo.specificity95CIUpper !== null && estimate.primaryEstimateInfo.specificity95CIUpper !== undefined
  ) ? `[${(estimate.primaryEstimateInfo.specificity95CILower * 100).toFixed(3)}% - ${(estimate.primaryEstimateInfo.specificity95CIUpper * 100).toFixed(3)}]`
    : 'Not reported'
}];

export const useMersEstimateRows = () => {
  const { countryNameToColourClassnameMap } = useContext(CountryInformationContext);

  const getSharedMersEstimateRows = useCallback((estimate: MersEstimateMapMarkerData): PopUpContentRowProps[] => [{
    title: "WHO Region",
    type: PopUpContentRowType.COLOURED_PILL_LIST,
    values: estimate.primaryEstimateInfo.whoRegion ? [ estimate.primaryEstimateInfo.whoRegion ] : [],
    valueToColourClassnameMap: whoRegionToColourClassnameMap,
    valueToLabelMap: {},
    defaultColourClassname: "bg-sky-100"
  }, {
    title: 'Geographic Scope',
    type: PopUpContentRowType.COLOURED_PILL_LIST,
    values: estimate.primaryEstimateInfo.geographicScope ? [ estimate.primaryEstimateInfo.geographicScope ] : [ 'Not Specified' ],
    valueToColourClassnameMap: geographicScopeToColourClassnameMap,
    defaultColourClassname: "bg-sky-100"
  }, {
    title: "Location",
    type: PopUpContentRowType.LOCATION,
    countryName: estimate.primaryEstimateInfo.country,
    districtName: estimate.primaryEstimateInfo.district ?? undefined,
    stateName: estimate.primaryEstimateInfo.state ?? undefined,
    cityName: estimate.primaryEstimateInfo.city ?? undefined
  }, {
    title: "Sampling Date Range",
    type: PopUpContentRowType.DATE_RANGE,
    dateRangeStart: estimate.primaryEstimateInfo.samplingStartDate ? parseISO(estimate.primaryEstimateInfo.samplingStartDate) : undefined,
    dateRangeEnd: estimate.primaryEstimateInfo.samplingEndDate ? parseISO(estimate.primaryEstimateInfo.samplingEndDate) : undefined
  },
  ...getSampleFrameRows({ estimate }),
  ...getPrevalenceConfidenceIntervalRows({ estimate }),
  ...getSampleNumeratorAndDenominatorRows({ estimate }),
  ...getCountryOfTravelOrImportRows({ estimate, countryNameToColourClassnameMap }),
  {
    title: "Sex",
    type: PopUpContentRowType.TEXT,
    text: estimate.primaryEstimateInfo.sex ?? 'Not Reported'
  }, {
    title: "Source Type",
    type: PopUpContentRowType.TEXT,
    text: estimate.primaryEstimateInfo.sourceType ?? 'Not Reported'
  }, {
    title: "Assay",
    type: PopUpContentRowType.COLOURED_PILL_LIST,
    values: estimate.primaryEstimateInfo.assay,
    valueToColourClassnameMap: assayToColourClassnameMap,
    defaultColourClassname: "bg-sky-100",
  }, {
    title: "Isotypes",
    type: PopUpContentRowType.COLOURED_PILL_LIST,
    values: estimate.primaryEstimateInfo.isotypes,
    valueToColourClassnameMap: isotypeToColourClassnameMap,
    defaultColourClassname: "bg-sky-100",
  }, {
    title: "Specimen Type",
    type: PopUpContentRowType.COLOURED_PILL_LIST,
    values: estimate.primaryEstimateInfo.specimenType,
    valueToColourClassnameMap: specimenTypeToColourClassnameMap,
    defaultColourClassname: "bg-sky-100",
  }, {
    title: "Antigens",
    type: PopUpContentRowType.COLOURED_PILL_LIST,
    values: estimate.primaryEstimateInfo.antigen,
    valueToColourClassnameMap: antigenToColourClassnameMap,
    defaultColourClassname: "bg-sky-100",
  },
  ...getGenomicSequencingDoneRows({ estimate }),
  {
    title: "First Author Full Name",
    type: PopUpContentRowType.TEXT,
    text: estimate.primaryEstimateInfo.firstAuthorFullName ?? 'Not Reported'
  }, {
    title: "Institution",
    type: PopUpContentRowType.TEXT,
    text: estimate.primaryEstimateInfo.insitutution ?? 'Not Reported'
  },
  ...getAnimalFieldRows({ estimate }),
  ...getAgeGroupRows({ estimate }),
  ...getHumanFieldRows({ estimate }),
  {
    title: "Socioeconomic Status",
    type: PopUpContentRowType.TEXT,
    text: estimate.primaryEstimateInfo.socioeconomicStatus ?? 'Not Reported'
  }, 
  ...getTestSensitivityFields({ estimate }),
  ...getTestSpecificityFields({ estimate }),
  {
    title: 'Sampling Method',
    type: PopUpContentRowType.COLOURED_PILL_LIST,
    values: estimate.primaryEstimateInfo.samplingMethod ? [ estimate.primaryEstimateInfo.samplingMethod ] : [],
    valueToColourClassnameMap: samplingMethodToColourClassnameMap,
    defaultColourClassname: "bg-sky-100",
  }, {
    title: 'Geographic Scope',
    type: PopUpContentRowType.COLOURED_PILL_LIST,
    values: estimate.primaryEstimateInfo.geographicScope ? [ estimate.primaryEstimateInfo.geographicScope ] : [],
    valueToColourClassnameMap: geographicScopeToColourClassnameMap,
    defaultColourClassname: "bg-sky-100",
  }, {
    title: 'Test Producer',
    type: PopUpContentRowType.COLOURED_PILL_LIST,
    values: estimate.primaryEstimateInfo.testProducer,
    valueToColourClassnameMap: testProducerToColourClassnameMap,
    defaultColourClassname: "bg-sky-100",
  }, {
    title: "Test Producer (If Other)",
    type: PopUpContentRowType.TEXT,
    text: estimate.primaryEstimateInfo.testProducerOther ?? 'Not Reported'
  }, {
    title: "Test Validated On",
    type: PopUpContentRowType.TEXT,
    text: estimate.primaryEstimateInfo.testValidatedOn ?? 'Not Reported'
  }, {
    title: "Positive Cutoff",
    type: PopUpContentRowType.TEXT,
    text: estimate.primaryEstimateInfo.positiveCutoff ?? 'Not Reported'
  }, {
    title: "Symptom Prevalence in Postive Cases",
    type: PopUpContentRowType.TEXT,
    text: estimate.primaryEstimateInfo.symptomPrevalenceOfPositives
      ? `${(estimate.primaryEstimateInfo.symptomPrevalenceOfPositives * 100).toFixed(3)}%`
      : "Unknown"
  }, {
    title: "Symptom Definition",
    type: PopUpContentRowType.TEXT,
    text: estimate.primaryEstimateInfo.symptomDefinition ?? 'Not Reported'
  }, {
    title: 'Test Validation',
    type: PopUpContentRowType.COLOURED_PILL_LIST,
    values: estimate.primaryEstimateInfo.testValidation,
    valueToColourClassnameMap: testValidationToColourClassnameMap,
    defaultColourClassname: "bg-sky-100",
  }, {
    title: "Study Inclusion Criteria",
    type: PopUpContentRowType.TEXT,
    text: estimate.primaryEstimateInfo.studyInclusionCriteria ?? 'Not Reported'
  }, {
    title: "Study Exclusion Criteria",
    type: PopUpContentRowType.TEXT,
    text: estimate.primaryEstimateInfo.studyExclusionCriteria ?? 'Not Reported'
  }], [ countryNameToColourClassnameMap ]);

  return {
    getSharedMersEstimateRows
  };
}

interface GenerateAlternateViewBannerConfigurationInput {
  estimate: MersEstimate;
}

type GenerateAlternateViewBannerConfigurationOutput = {
  alternateViewButtonEnabled: true;
  alternateViewEnableButtonText: string;
  alternateViewDisableButtonText: string;
  alternateViewButtonClassname: string;
} | {
  alternateViewButtonEnabled: false;
}

export const generateAlternateViewBannerConfiguration = (
  input: GenerateAlternateViewBannerConfigurationInput
): GenerateAlternateViewBannerConfigurationOutput  => {
  if(
    input.estimate.ageGroupSubestimates.length === 0 &&
    input.estimate.animalSpeciesSubestimates.length === 0 &&
    input.estimate.geographicalAreaSubestimates.length === 0 &&
    input.estimate.sexSubestimates.length === 0 &&
    input.estimate.testUsedSubestimates.length === 0 &&
    input.estimate.timeFrameSubestimates.length === 0 &&
    input.estimate.sampleTypeSubestimates.length === 0 &&
    input.estimate.occupationSubestimates.length === 0 &&
    input.estimate.animalSourceLocationSubestimates.length === 0 &&
    input.estimate.animalSamplingContextSubestimates.length === 0 &&
    input.estimate.camelExposureLevelSubestimates.length === 0 &&
    input.estimate.nomadismSubestimates.length === 0 &&
    input.estimate.humanCountriesOfTravelSubestimates.length === 0
  ) {
    return {
      alternateViewButtonEnabled: false,
    }
  }

  return {
    alternateViewButtonEnabled: true,
    alternateViewEnableButtonText: 'See subestimate details',
    alternateViewDisableButtonText: 'See primary estimate details',
    alternateViewButtonClassname: 'bg-mers hover:bg-mersHover text-white hover:text-black',
  }
}

export enum GenerateMersEstimateTableConfigurationsType {
  SEROPREVALENCE_ESTIMATES = 'SEROPREVALENCE_ESTIMATES',
  VIRAL_ESTIMATES = 'VIRAL_ESTIMATES'
}

interface GenerateTableFieldsInput {
  type: GenerateMersEstimateTableConfigurationsType;
}

const generateTableFields = (input: GenerateTableFieldsInput) => [
  'Sample Numerator',
  'Sample Denominator',
  ...(input.type === GenerateMersEstimateTableConfigurationsType.SEROPREVALENCE_ESTIMATES ? [
    'Seroprevalence',
    'Seroprevalence (95% CI)'
  ] : []),
  ...(input.type === GenerateMersEstimateTableConfigurationsType.VIRAL_ESTIMATES ? [
    'Positive Prevalence',
    'Positive Prevalence (95% CI)'
  ] : [])
]

interface GenerateTableRowsForSubestimateInput<TSubEstimate extends {
  estimateInfo: MersSubEstimateInformation
}> {
  type: GenerateMersEstimateTableConfigurationsType;
  subestimate: TSubEstimate;
}

interface GenerateTableRowsForSubestimateOutput<TSubEstimate extends {
  estimateInfo: MersSubEstimateInformation
}> {
  subestimate: TSubEstimate;
  rows: Record<string, string | undefined>;
}

const generateTableRowsForSubestimate = <
  TSubEstimate extends { estimateInfo: MersSubEstimateInformation }
>(
  input: GenerateTableRowsForSubestimateInput<TSubEstimate>
): GenerateTableRowsForSubestimateOutput<TSubEstimate> | undefined => {
  const { estimateInfo } = input.subestimate;

  if(input.type === GenerateMersEstimateTableConfigurationsType.SEROPREVALENCE_ESTIMATES) {
    if(!isMersSeroprevalenceSubEstimateInformation(estimateInfo)) {
      return undefined;
    }

    return {
      subestimate: input.subestimate,
      rows: {
        'Sample Numerator': estimateInfo.sampleNumerator?.toFixed(0),
        'Sample Denominator': estimateInfo.sampleDenominator?.toFixed(0),
        'Seroprevalence': `${(estimateInfo.seroprevalence * 100).toFixed(3)}%`,
        'Seroprevalence (95% CI)': (estimateInfo.seroprevalence95CILower === undefined || estimateInfo.seroprevalence95CILower === null)
          ? (estimateInfo.seroprevalence95CIUpper === undefined || estimateInfo.seroprevalence95CIUpper === null)
            ? 'Not reported'
            : `Unknown - ${(estimateInfo.seroprevalence95CIUpper * 100).toFixed(3)}%`
          : (estimateInfo.seroprevalence95CIUpper === undefined || estimateInfo.seroprevalence95CIUpper === null)
            ? `${(estimateInfo.seroprevalence95CILower * 100).toFixed(3)}% - Unknown`
            : `${(estimateInfo.seroprevalence95CILower * 100).toFixed(3)}% - ${(estimateInfo.seroprevalence95CIUpper * 100).toFixed(3)}%`
      }
    }
  }

  if(input.type === GenerateMersEstimateTableConfigurationsType.VIRAL_ESTIMATES) {
    if(!isMersViralSubEstimateInformation(estimateInfo)) {
      return undefined;
    }

    return {
      subestimate: input.subestimate,
      rows: {
        'Sample Numerator': estimateInfo.sampleNumerator?.toFixed(0),
        'Sample Denominator': estimateInfo.sampleDenominator?.toFixed(0),
        'Positive Prevalence': `${(estimateInfo.positivePrevalence * 100).toFixed(3)}%`,
        'Positive Prevalence (95% CI)': (estimateInfo.positivePrevalence95CILower === undefined || estimateInfo.positivePrevalence95CILower === null)
          ? (estimateInfo.positivePrevalence95CIUpper === undefined || estimateInfo.positivePrevalence95CIUpper === null)
            ? 'Not reported'
            : `Unknown - ${(estimateInfo.positivePrevalence95CIUpper * 100).toFixed(3)}%`
          : (estimateInfo.positivePrevalence95CIUpper === undefined || estimateInfo.positivePrevalence95CIUpper === null)
            ? `${(estimateInfo.positivePrevalence95CILower * 100).toFixed(3)}% - Unknown`
            : `${(estimateInfo.positivePrevalence95CILower * 100).toFixed(3)}% - ${(estimateInfo.positivePrevalence95CIUpper * 100).toFixed(3)}%`
      }
    }
  }

  assertNever(input.type)
}

interface GenerateMersEstimateTableConfigurationsInput {
  type: GenerateMersEstimateTableConfigurationsType;
  estimate: MersEstimate;
}

export const generateMersEstimateTableConfigurations = (input: GenerateMersEstimateTableConfigurationsInput): AlternateViewConfigurationTableConfiguration[] => [
  ...(input.estimate.sexSubestimates.length > 0 ? [{
    tableHeader: 'Sex Subestimates',
    tableFields: [
      'Sex',
      ...generateTableFields({ type: input.type })
    ],
    tableRows: input.estimate.sexSubestimates
      .map((subestimate) => generateTableRowsForSubestimate({ type: input.type, subestimate }))
      .filter((element): element is NonNullable<typeof element> => !!element)
      .map((element) => ({
        rowColourClassname: element.subestimate.markedAsFiltered === true ? 'bg-slate-300' : '',
        values: {
          ...element.rows,
          'Sex': element.subestimate.sex,
        }
      }))
  }] : []),
  ...(input.estimate.ageGroupSubestimates.length > 0 ? [{
    tableHeader: 'Age Group Subestimates',
    tableFields: [
      'Age Group',
      ...generateTableFields({ type: input.type })
    ],
    tableRows: input.estimate.ageGroupSubestimates
      .map((subestimate) => generateTableRowsForSubestimate({ type: input.type, subestimate }))
      .filter((element): element is NonNullable<typeof element> => !!element)
      .map((element) => ({
        rowColourClassname: element.subestimate.markedAsFiltered === true ? 'bg-slate-300' : '',
        values: {
          ...element.rows,
          'Age Group': isHumanMersAgeGroupSubEstimate(element.subestimate)
            ? element.subestimate.ageGroupLabel
            : element.subestimate.animalAgeGroupLabel
        }
      }))
  }] : []),
  ...(input.estimate.testUsedSubestimates.length > 0 ? [{
    tableHeader: 'Test Used Subestimates',
    tableFields: [
      'Test Used',
      ...generateTableFields({ type: input.type })
    ],
    tableRows: input.estimate.testUsedSubestimates
      .map((subestimate) => generateTableRowsForSubestimate({ type: input.type, subestimate }))
      .filter((element): element is NonNullable<typeof element> => !!element)
      .map((element) => ({
        rowColourClassname: element.subestimate.markedAsFiltered === true ? 'bg-slate-300' : '',
        values: {
          ...element.rows,
          'Test Used': element.subestimate.assay.join(',')
        }
      }))
  }] : []),
  ...(input.estimate.animalSpeciesSubestimates.length > 0 ? [{
    tableHeader: 'Animal Species Subestimates',
    tableFields: [
      'Animal Species',
      ...generateTableFields({ type: input.type })
    ],
    tableRows: input.estimate.animalSpeciesSubestimates
      .map((subestimate) => generateTableRowsForSubestimate({ type: input.type, subestimate }))
      .filter((element): element is NonNullable<typeof element> => !!element)
      .map((element) => ({
        rowColourClassname: element.subestimate.markedAsFiltered === true ? 'bg-slate-300' : '',
        values: {
          ...element.rows,
          'Animal Species':  element.subestimate.animalSpecies
            .map((animalSpecies) => animalSpeciesToStringMap[animalSpecies])
            .join(', ')
        }
      }))
  }] : []),
  ...(input.estimate.geographicalAreaSubestimates.length > 0 ? [{
    tableHeader: 'Geographical Area Subestimates',
    tableFields: [
      ...(input.estimate.geographicalAreaSubestimates.some((element) => !!element.country) ? ['Country/Area'] : []),
      ...(input.estimate.geographicalAreaSubestimates.some((element) => !!element.state) ? ['State'] : []),
      ...(input.estimate.geographicalAreaSubestimates.some((element) => !!element.district) ? ['District'] : []),
      ...(input.estimate.geographicalAreaSubestimates.some((element) => !!element.city) ? ['City'] : []),
      ...generateTableFields({ type: input.type })
    ],
    tableRows: input.estimate.geographicalAreaSubestimates
      .map((subestimate) => generateTableRowsForSubestimate({ type: input.type, subestimate }))
      .filter((element): element is NonNullable<typeof element> => !!element)
      .map((element) => ({
        rowColourClassname: element.subestimate.markedAsFiltered === true ? 'bg-slate-300' : '',
        values: {
          ...element.rows,
          'Country/Area': element.subestimate.country,
          'State': element.subestimate.state ?? 'Unspecified',
          'District': element.subestimate.district ?? 'Unspecified',
          'City': element.subestimate.city ?? 'Unspecified',
        }
      }))
  }] : []),
  ...(input.estimate.timeFrameSubestimates.length > 0 ? [{
    tableHeader: 'Time Frame Subestimates',
    tableFields: [
      'Sampling Start Date',
      'Sampling End Date',
      ...generateTableFields({ type: input.type })
    ],
    tableRows: input.estimate.timeFrameSubestimates
      .map((subestimate) => generateTableRowsForSubestimate({ type: input.type, subestimate }))
      .filter((element): element is NonNullable<typeof element> => !!element)
      .map((element) => ({
        rowColourClassname: element.subestimate.markedAsFiltered === true ? 'bg-slate-300' : '',
        values: {
          ...element.rows,
          'Sampling Start Date': TranslateDate(element.subestimate.samplingStartDate),
          'Sampling End Date': TranslateDate(element.subestimate.samplingEndDate),
        }
      }))
  }] : []),
  ...(input.estimate.sampleTypeSubestimates.length > 0 ? [{
    tableHeader: 'Specimen Type Subestimates',
    tableFields: [
      'Specimen Type',
      ...generateTableFields({ type: input.type })
    ],
    tableRows: input.estimate.sampleTypeSubestimates
      .map((subestimate) => generateTableRowsForSubestimate({ type: input.type, subestimate }))
      .filter((element): element is NonNullable<typeof element> => !!element)
      .map((element) => ({
        rowColourClassname: element.subestimate.markedAsFiltered === true ? 'bg-slate-300' : '',
        values: {
          ...element.rows,
          'Specimen Type': element.subestimate.specimenType.join(',')
        }
      }))
  }] : []),
  ...(input.estimate.occupationSubestimates.length > 0 ? [{
    tableHeader: 'Occupation Subestimates',
    tableFields: [
      'Occupation',
      'Sample Frame',
      'Exposure To Camels',
      ...generateTableFields({ type: input.type })
    ],
    tableRows: input.estimate.occupationSubestimates
      .map((subestimate) => generateTableRowsForSubestimate({ type: input.type, subestimate }))
      .filter((element): element is NonNullable<typeof element> => !!element)
      .map((element) => ({
        rowColourClassname: element.subestimate.markedAsFiltered === true ? 'bg-slate-300' : '',
        values: {
          ...element.rows,
          'Occupation': element.subestimate.occupation,
          'Sample Frame': element.subestimate.sampleFrames.length > 0
            ? element.subestimate.sampleFrames.join(',')
            : 'Unknown',
          'Exposure To Camels': element.subestimate.exposureToCamels ?? 'Unknown',
        }
      }))
  }] : []),
  ...(input.estimate.animalSourceLocationSubestimates.length > 0 ? [{
    tableHeader: 'Animal Source Location Subestimates',
    tableFields: [
      'Imported or Local',
      'Source Countries/Areas',
      ...generateTableFields({ type: input.type })
    ],
    tableRows: input.estimate.animalSourceLocationSubestimates
      .map((subestimate) => generateTableRowsForSubestimate({ type: input.type, subestimate }))
      .filter((element): element is NonNullable<typeof element> => !!element)
      .map((element) => ({
        rowColourClassname: element.subestimate.markedAsFiltered === true ? 'bg-slate-300' : '',
        values: {
          ...element.rows,
          'Imported or Local': element.subestimate.animalImportedOrLocal,
          'Source Countries/Areas': element.subestimate.animalCountriesOfImport.join(', ')
        }
      }))
  }] : []),
  ...(input.estimate.animalSamplingContextSubestimates.length > 0 ? [{
    tableHeader: 'Animal Sample Frame Subestimates',
    tableFields: [
      'Sample Frame',
      ...generateTableFields({ type: input.type })
    ],
    tableRows: input.estimate.animalSamplingContextSubestimates
      .map((subestimate) => generateTableRowsForSubestimate({ type: input.type, subestimate }))
      .filter((element): element is NonNullable<typeof element> => !!element)
      .map((element) => ({
        rowColourClassname: element.subestimate.markedAsFiltered === true ? 'bg-slate-300' : '',
        values: {
          ...element.rows,
          'Sample Frame': element.subestimate.animalDetectionSettings.join(',')
        }
      }))
  }] : []),
  ...(input.estimate.camelExposureLevelSubestimates.length > 0 ? [{
    tableHeader: 'Camel Exposure Level Subestimates',
    tableFields: [
      'Details',
      'Sample Frame',
      'Exposure Level To Camels',
      ...generateTableFields({ type: input.type })
    ],
    tableRows: input.estimate.camelExposureLevelSubestimates
      .map((subestimate) => generateTableRowsForSubestimate({ type: input.type, subestimate }))
      .filter((element): element is NonNullable<typeof element> => !!element)
      .map((element) => ({
        rowColourClassname: element.subestimate.markedAsFiltered === true ? 'bg-slate-300' : '',
        values: {
          ...element.rows,
          'Details': element.subestimate.details,
          'Sample Frame': element.subestimate.sampleFrames.length > 0
            ? element.subestimate.sampleFrames.join(',')
            : 'Unknown',
          'Exposure Level To Camels': element.subestimate.exposureToCamels
        }
      }))
  }] : []),
  ...(input.estimate.nomadismSubestimates.length > 0 ? [{
    tableHeader: 'Nomadism Subestimates',
    tableFields: [
      'Details',
      ...generateTableFields({ type: input.type })
    ],
    tableRows: input.estimate.nomadismSubestimates
      .map((subestimate) => generateTableRowsForSubestimate({ type: input.type, subestimate }))
      .filter((element): element is NonNullable<typeof element> => !!element)
      .map((element) => ({
        rowColourClassname: element.subestimate.markedAsFiltered === true ? 'bg-slate-300' : '',
        values: {
          ...element.rows,
          'Details': element.subestimate.details,
        }
      }))
  }] : []),
  ...(input.estimate.humanCountriesOfTravelSubestimates.length > 0 ? [{
    tableHeader: 'Country/Area Of Travel Subestimates',
    tableFields: [
      'Countries/Areas of Travel',
      ...generateTableFields({ type: input.type })
    ],
    tableRows: input.estimate.humanCountriesOfTravelSubestimates
      .map((subestimate) => generateTableRowsForSubestimate({ type: input.type, subestimate }))
      .filter((element): element is NonNullable<typeof element> => !!element)
      .map((element) => ({
        rowColourClassname: element.subestimate.markedAsFiltered === true ? 'bg-slate-300' : '',
        values: {
          ...element.rows,
          'Countries/Areas of Travel': element.subestimate.humanCountriesOfTravel
            .map((countryOfTravel) => countryOfTravel.name)
            .join(', '),
        }
      }))
  }] : [])
]