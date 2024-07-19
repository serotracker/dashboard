import {
  AnimalMersSeroprevalenceEstimate,
  AnimalMersViralEstimate,
  HumanMersSeroprevalenceEstimate,
  HumanMersViralEstimate
} from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import {
  AnimalMersEvent,
  HumanMersEvent,
  MersDiagnosisSource,
  MersDiagnosisStatus,
  MersEventAnimalSpecies,
  MersEventAnimalType,
  MersAnimalType,
  MersAnimalSpecies
} from "@/gql/graphql"

export const diagnosisStatusToStringMap = {
  [MersDiagnosisStatus.Confirmed]: "Confirmed",
  [MersDiagnosisStatus.Denied]: "Denied",
}

export const diagnosisStatusToColourClassnameMap = {
  [MersDiagnosisStatus.Confirmed]: "bg-green-600",
  [MersDiagnosisStatus.Denied]: "bg-red-600",
}

export const isMersDiagnosisStatus = (diagnosisStatus: string): diagnosisStatus is MersDiagnosisStatus => Object.values(MersDiagnosisStatus).some((element) => element === diagnosisStatus);

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
  [MersEventAnimalSpecies.Bat]: "Bat",
  [MersEventAnimalSpecies.Camel]: "Camel",
}

export const animalSpeciesToColourClassnameMap = {
  [MersEventAnimalSpecies.Bat]: "bg-orange-700",
  [MersEventAnimalSpecies.Camel]: "bg-yellow-300",
}

export const isMersEventAnimalSpecies = (animalSpecies: string): animalSpecies is MersEventAnimalSpecies => Object.values(MersEventAnimalSpecies).some((element) => element === animalSpecies);
export const isMersAnimalSpecies = (animalSpecies: string): animalSpecies is MersAnimalSpecies => Object.values(MersAnimalSpecies).some((element) => element === animalSpecies);

export const diagnosisSourceToStringMap = {
  [MersDiagnosisSource.FaoFieldOfficer]: "FAO Field Officer",
  [MersDiagnosisSource.Media]: "Media",
  [MersDiagnosisSource.NationalAuthorities]: "National Authorities",
  [MersDiagnosisSource.WorldOrganisationForAnimalHealth]: "World Organization For Animal Health",
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
  mersMapMarkerData.__typename === "HumanMersEstimate";

export const isAnimalMersSeroprevalenceEstimateMapMarkerData = (mersMapMarkerData: MersMapMarkerData): mersMapMarkerData is AnimalMersSeroprevalenceEstimateMapMarkerData => 
  mersMapMarkerData.__typename === "AnimalMersEstimate";

export const isHumanMersViralEstimateMapMarkerData = (mersMapMarkerData: MersMapMarkerData): mersMapMarkerData is HumanMersViralEstimateMapMarkerData => 
  mersMapMarkerData.__typename === "HumanMersViralEstimate";

export const isAnimalMersViralEstimateMapMarkerData = (mersMapMarkerData: MersMapMarkerData): mersMapMarkerData is AnimalMersViralEstimateMapMarkerData => 
  mersMapMarkerData.__typename === "AnimalMersViralEstimate";

export const mersDataTypeToSortOrderMap: Record<string, number | undefined> & Record<
  | "HumanMersEstimate"
  | "AnimalMersEstimate"
  | "HumanMersEvent"
  | "AnimalMersEvent"
  | "HumanMersViralEstimate"
  | "AnimalMersViralEstimate"
, number> = {
  "HumanMersEstimate": 1,
  "AnimalMersEstimate": 2,
  "HumanMersViralEstimate": 3,
  "AnimalMersViralEstimate": 4,
  "HumanMersEvent": 5,
  "AnimalMersEvent": 6
};
export const mersDataTypeToLabelMap = {
  "HumanMersEstimate": "Human Seroprevalence Estimate",
  "AnimalMersEstimate": "Animal Seroprevalence Estimate",
  "HumanMersViralEstimate": "Human Viral Estimate",
  "AnimalMersViralEstimate": "Animal Viral Estimate",
  "AnimalMersEvent": "Animal Case",
  "HumanMersEvent": "Human Case",
};

export enum MersDataTypeSuperOption {
  HUMAN = 'HUMAN',
  ANIMAL = 'ANIMAL',
}

export const isMersDataTypeSuperOption = (superOption: string): superOption is MersDataTypeSuperOption =>
  Object.values(MersDataTypeSuperOption).some((element) => element === superOption);

export const isMersDataType = (dataType: string): dataType is
  "HumanMersEstimate" | "AnimalMersEstimate" | "HumanMersViralEstimate" | "AnimalMersViralEstimate" | "AnimalMersEvent" | "HumanMersEvent" =>
  ["HumanMersEstimate", "AnimalMersEstimate", "HumanMersViralEstimate", "AnimalMersViralEstimate", "AnimalMersEvent", "HumanMersEvent"].includes(dataType)

export const mersDataTypeToSuperOptionMap = {
  "HumanMersEstimate": MersDataTypeSuperOption.HUMAN,
  "AnimalMersEstimate": MersDataTypeSuperOption.ANIMAL,
  "HumanMersViralEstimate": MersDataTypeSuperOption.HUMAN,
  "AnimalMersViralEstimate": MersDataTypeSuperOption.ANIMAL,
  "HumanMersEvent": MersDataTypeSuperOption.HUMAN,
  "AnimalMersEvent": MersDataTypeSuperOption.ANIMAL
}

export const mersDataTypeSuperOptionToLabelMap = {
  [MersDataTypeSuperOption.HUMAN]: "Human Data",
  [MersDataTypeSuperOption.ANIMAL]: "Animal Data"
}

export const mersDataTypeToColourClassnameMap = {
  "HumanMersEstimate": "bg-mers-human-estimate",
  "HumanMersViralEstimate": "bg-mers-human-viral-estimate",
  "AnimalMersEstimate": "bg-mers-animal-estimate",
  "AnimalMersViralEstimate": "bg-mers-animal-viral-estimate",
  "AnimalMersEvent": "bg-mers-animal-event",
  "HumanMersEvent": "bg-mers-human-event"
}

export const mersDataTypeToColourClassnameMapForCheckbox = {
  "HumanMersEstimate": "data-[state=checked]:bg-mers-human-estimate",
  "HumanMersViralEstimate": "data-[state=checked]:bg-mers-human-viral-estimate",
  "AnimalMersEstimate": "data-[state=checked]:bg-mers-animal-estimate",
  "AnimalMersViralEstimate": "data-[state=checked]:bg-mers-animal-viral-estimate",
  "AnimalMersEvent": "data-[state=checked]:bg-mers-animal-event",
  "HumanMersEvent": "data-[state=checked]:bg-mers-human-event"
}

export const isMersEventTypename = (typename: string): typename is "HumanMersEvent"|"AnimalMersEvent" => ["HumanMersEvent","AnimalMersEvent"].includes(typename);
export const isMersSeroprevalenceEstimateTypename = (typename: string): typename is "HumanMersEstimate"|"AnimalMersEstimate" => ["HumanMersEstimate","AnimalMersEstimate"].includes(typename);
export const isMersViralEstimateTypename = (typename: string): typename is "HumanMersViralEstimate"|"AnimalMersViralEstimate" => ["HumanMersViralEstimate","AnimalMersViralEstimate"].includes(typename);

export type MersMapMarkerData = 
  | AnimalMersSeroprevalenceEstimateMapMarkerData
  | HumanMersSeroprevalenceEstimateMapMarkerData
  | HumanMersEventMapMarkerData
  | AnimalMersEventMapMarkerData
  | HumanMersViralEstimateMapMarkerData
  | AnimalMersViralEstimateMapMarkerData;
