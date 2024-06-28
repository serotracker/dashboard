import { AnimalMersEvent, HumanMersEvent, MersDiagnosisSource, MersDiagnosisStatus, MersEstimate, MersEventAnimalSpecies, MersEventAnimalType } from "@/gql/graphql"

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

export const animalSpeciesToStringMap = {
  [MersEventAnimalSpecies.Bat]: "Bat",
  [MersEventAnimalSpecies.Camel]: "Camel",
}

export const animalSpeciesToColourClassnameMap = {
  [MersEventAnimalSpecies.Bat]: "bg-orange-700",
  [MersEventAnimalSpecies.Camel]: "bg-yellow-300",
}

export const isMersEventAnimalSpecies = (animalSpecies: string): animalSpecies is MersEventAnimalSpecies => Object.values(MersEventAnimalSpecies).some((element) => element === animalSpecies);

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

export type MersEstimateMapMarkerData = MersEstimate;

export const isMersFaoHumanEventMapMarkerData = (mersMapMarkerData: MersMapMarkerData): mersMapMarkerData is HumanMersEventMapMarkerData => 
  mersMapMarkerData.__typename === "HumanMersEvent";

export const isMersFaoAnimalEventMapMarkerData = (mersMapMarkerData: MersMapMarkerData): mersMapMarkerData is AnimalMersEventMapMarkerData => 
  mersMapMarkerData.__typename === "AnimalMersEvent";

export const isMersEstimateMapMarkerData = (mersMapMarkerData: MersMapMarkerData): mersMapMarkerData is MersEstimateMapMarkerData => 
  mersMapMarkerData.__typename === "MersEstimate";

export const mersEventTypenameToLabelMap = {
  "AnimalMersEvent": "Animal Case",
  "HumanMersEvent": "Human Case",
};

export const mersEventTypenameToColourClassnameMap = {
  "AnimalMersEvent": "bg-mers-animal-event",
  "HumanMersEvent": "bg-mers-human-event"
}

export const isMersEventTypename = (typename: string): typename is "HumanMersEvent"|"AnimalMersEvent" => ["HumanMersEvent","AnimalMersEvent"].includes(typename);

export type MersMapMarkerData = 
  | MersEstimateMapMarkerData
  | HumanMersEventMapMarkerData
  | AnimalMersEventMapMarkerData;
