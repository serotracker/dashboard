import { AlternateViewConfigurationTableConfiguration } from "@/components/ui/pathogen-map/map-pop-up/map-pop-up-alternate-configuration";
import { PopUpContentRowProps, PopUpContentRowType } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import {
  AnimalMersSeroprevalenceEstimate,
  AnimalMersViralEstimate,
  HumanMersSeroprevalenceEstimate,
  HumanMersViralEstimate,
  MersEstimate,
  MersSubEstimateInformation,
  isHumanMersAgeGroupSubEstimate,
  isMersSeroprevalenceSubEstimateInformation,
  isMersViralSubEstimateInformation
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
import { TranslateDate } from "@/utils/translate-util/translate-service";
import assertNever from "assert-never";
import { parseISO } from "date-fns";

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
  'All': 'bg-indigo-300'
}

export const sourceTypeToColourClassnameMap = {
  'Journal Article (Peer-Reviewed)': 'bg-purple-300'
}

export const assayToColourClassnameMap = {
  "ELISA": "bg-red-300",
  "N2 RT-qPCR": "bg-green-300",
  "N3 RT-qPCR": "bg-violet-300",
  "Neutralization": "bg-cyan-300"
}

export const isotypeToColourClassnameMap = {
  "IgG": "bg-teal-300"
}

export const specimenTypeToColourClassnameMap = {
  "Nasal Swab": "bg-lime-300",
  "Serum": "bg-orange-300"
}

export const animalDetectionSettingsToColourClassnameMap = {
  "Abattoirs": "bg-orange-200",
  "Free-roaming herds": "bg-lime-200",
  "Livestock markets": "bg-cyan-200"
}

export const animalPurposeSettingsToColourClassnameMap = {
  "Multiple purposes": "bg-emerald-200"
}

export const animalImportedOrLocalToColourClassnameMap = {
  "Local": "bg-purple-200",
  "Imported": "bg-yellow-200",
}

export const sampleFrameToColourClassnameMap = {
  "Livestock workers": "bg-teal-200"
}

export const samplingMethodToColourClassnameMap = {
  "Convenience": "bg-violet-400",
  "Stratified probability": "bg-lime-400"
}

export const geographicScopeToColourClassnameMap = {
  "National": "bg-orange-400",
}

export const testProducerToColourClassnameMap = {
  "Euroimmun": "bg-teal-400",
  "Roche": "bg-fuchsia-400",
  "In-house": "bg-red-400",
  "Not reported": "bg-pink-400"
}

export const testValidationToColourClassnameMap = {
  "Validated by developers": "bg-yellow-400",
  "Not reported": "bg-pink-400"
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
  [MersEventAnimalSpecies.Bat]: "Bat",
  [MersEventAnimalSpecies.Camel]: "Camel",
  [MersEventAnimalSpecies.Goat]: "Goat",
  [MersEventAnimalSpecies.Cattle]: "Cattle",
  [MersEventAnimalSpecies.Sheep]: "Sheep",
}

export const ageGroupToColourClassnameMap = {
  "Adults": "bg-lime-200"
}

export const animalSpeciesToColourClassnameMap = {
  [MersEventAnimalSpecies.Bat]: "bg-orange-700",
  [MersEventAnimalSpecies.Camel]: "bg-yellow-300",
  [MersEventAnimalSpecies.Goat]: "bg-sky-300",
  [MersEventAnimalSpecies.Cattle]: "bg-pink-300",
  [MersEventAnimalSpecies.Sheep]: "bg-red-200",
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


export const getSharedMersEstimateRows = (estimate: MersEstimateMapMarkerData): PopUpContentRowProps[] => [{
  title: "Location",
  type: PopUpContentRowType.LOCATION,
  countryName: estimate.primaryEstimateInfo.country,
  stateName: estimate.primaryEstimateInfo.state ?? undefined,
  cityName: estimate.primaryEstimateInfo.city ?? undefined
}, {
  title: "Source Type",
  type: PopUpContentRowType.TEXT,
  text: estimate.primaryEstimateInfo.sourceType ?? 'Not Reported'
}, {
  title: "Sampling Date Range",
  type: PopUpContentRowType.DATE_RANGE,
  dateRangeStart: estimate.primaryEstimateInfo.samplingStartDate ? parseISO(estimate.primaryEstimateInfo.samplingStartDate) : undefined,
  dateRangeEnd: estimate.primaryEstimateInfo.samplingEndDate ? parseISO(estimate.primaryEstimateInfo.samplingEndDate) : undefined
}, estimate.primaryEstimateInfo.sampleNumerator !== undefined && estimate.primaryEstimateInfo.sampleNumerator !== null ? {
  title: "Sample Numerator",
  type: PopUpContentRowType.NUMBER,
  value: estimate.primaryEstimateInfo.sampleNumerator
} : {
  title: "Sample Numerator",
  type: PopUpContentRowType.TEXT,
  text: 'N/A'
}, estimate.primaryEstimateInfo.sampleDenominator ? {
  title: "Sample Denominator",
  type: PopUpContentRowType.NUMBER,
  value: estimate.primaryEstimateInfo.sampleDenominator
} : {
  title: "Sample Denominator",
  type: PopUpContentRowType.TEXT,
  text: 'N/A'
}, {
  title: "First Author Full Name",
  type: PopUpContentRowType.TEXT,
  text: estimate.primaryEstimateInfo.firstAuthorFullName ?? 'Not Reported'
}, {
  title: "Institution",
  type: PopUpContentRowType.TEXT,
  text: estimate.primaryEstimateInfo.insitutution ?? 'Not Reported'
}, {
  title: "Study Inclusion Criteria",
  type: PopUpContentRowType.TEXT,
  text: estimate.primaryEstimateInfo.studyInclusionCriteria ?? 'Not Reported'
}, {
  title: "Study Exclusion Criteria",
  type: PopUpContentRowType.TEXT,
  text: estimate.primaryEstimateInfo.studyExclusionCriteria ?? 'Not Reported'
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
  values: estimate.primaryEstimateInfo.specimenType ? [ estimate.primaryEstimateInfo.specimenType ] : [],
  valueToColourClassnameMap: specimenTypeToColourClassnameMap,
  defaultColourClassname: "bg-sky-100",
}, {
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
  title: 'Test Validation',
  type: PopUpContentRowType.COLOURED_PILL_LIST,
  values: estimate.primaryEstimateInfo.testValidation,
  valueToColourClassnameMap: testValidationToColourClassnameMap,
  defaultColourClassname: "bg-sky-100",
}];

export const getAnimalMersEstimateRows = (estimate: AnimalMersEstimateMarkerData): PopUpContentRowProps[] => [{
  title: "Animal Type",
  type: PopUpContentRowType.COLOURED_PILL_LIST,
  values: estimate.primaryEstimateInfo.animalType,
  valueToColourClassnameMap: animalTypeToColourClassnameMap,
  valueToLabelMap: animalTypeToStringMap,
  defaultColourClassname: "bg-sky-100"
}, {
  title: 'Animal Detection Settings',
  type: PopUpContentRowType.COLOURED_PILL_LIST,
  values: estimate.primaryEstimateInfo.animalDetectionSettings,
  valueToColourClassnameMap: animalDetectionSettingsToColourClassnameMap,
  defaultColourClassname: "bg-sky-100",
}, {
  title: 'Animal Purpose',
  type: PopUpContentRowType.COLOURED_PILL_LIST,
  values: estimate.primaryEstimateInfo.animalPurpose ? [ estimate.primaryEstimateInfo.animalPurpose ] : [],
  valueToColourClassnameMap: animalPurposeSettingsToColourClassnameMap,
  defaultColourClassname: "bg-sky-100",
}, {
  title: 'Imported Or Local',
  type: PopUpContentRowType.COLOURED_PILL_LIST,
  values: estimate.primaryEstimateInfo.animalImportedOrLocal ? [ estimate.primaryEstimateInfo.animalImportedOrLocal ] : [],
  valueToColourClassnameMap: animalImportedOrLocalToColourClassnameMap,
  defaultColourClassname: "bg-sky-100",
}];

export const getHumanMersEstimateRows = (estimate: HumanMersEstimateMarkerData): PopUpContentRowProps[] => [{
  title: "Age Group",
  type: PopUpContentRowType.COLOURED_PILL_LIST,
  values: estimate.primaryEstimateInfo.ageGroup,
  valueToColourClassnameMap: ageGroupToColourClassnameMap,
  valueToLabelMap: {},
  defaultColourClassname: "bg-sky-100"
}, {
  title: "Sample Frame",
  type: PopUpContentRowType.COLOURED_PILL_LIST,
  values: estimate.primaryEstimateInfo.sampleFrame ? [ estimate.primaryEstimateInfo.sampleFrame ] : [],
  valueToColourClassnameMap: sampleFrameToColourClassnameMap,
  valueToLabelMap: {},
  defaultColourClassname: "bg-sky-100"
}];


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
    input.estimate.animalSamplingContextSubestimates.length === 0
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
        'Seroprevalence': `${(estimateInfo.seroprevalence * 100).toFixed(1)}%`,
        'Seroprevalence (95% CI)': (estimateInfo.seroprevalence95CILower === undefined || estimateInfo.seroprevalence95CILower === null)
          ? (estimateInfo.seroprevalence95CIUpper === undefined || estimateInfo.seroprevalence95CIUpper === null)
            ? 'Not reported'
            : `Unknown - ${(estimateInfo.seroprevalence95CIUpper * 100).toFixed(1)}%`
          : (estimateInfo.seroprevalence95CIUpper === undefined || estimateInfo.seroprevalence95CIUpper === null)
            ? `${(estimateInfo.seroprevalence95CILower * 100).toFixed(1)}% - Unknown`
            : `${(estimateInfo.seroprevalence95CILower * 100).toFixed(1)}% - ${(estimateInfo.seroprevalence95CIUpper * 100).toFixed(1)}%`
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
        'Positive Prevalence': `${(estimateInfo.positivePrevalence * 100).toFixed(1)}%`,
        'Positive Prevalence (95% CI)': (estimateInfo.positivePrevalence95CILower === undefined || estimateInfo.positivePrevalence95CILower === null)
          ? (estimateInfo.positivePrevalence95CIUpper === undefined || estimateInfo.positivePrevalence95CIUpper === null)
            ? 'Not reported'
            : `Unknown - ${(estimateInfo.positivePrevalence95CIUpper * 100).toFixed(1)}%`
          : (estimateInfo.positivePrevalence95CIUpper === undefined || estimateInfo.positivePrevalence95CIUpper === null)
            ? `${(estimateInfo.positivePrevalence95CILower * 100).toFixed(1)}% - Unknown`
            : `${(estimateInfo.positivePrevalence95CILower * 100).toFixed(1)}% - ${(estimateInfo.positivePrevalence95CIUpper * 100).toFixed(1)}%`
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
          'Animal Species': animalSpeciesToStringMap[element.subestimate.animalSpecies]
        }
      }))
  }] : []),
  ...(input.estimate.geographicalAreaSubestimates.length > 0 ? [{
    tableHeader: 'Geographical Area Subestimates',
    tableFields: [
      'Country',
      'State',
      'City',
      ...generateTableFields({ type: input.type })
    ],
    tableRows: input.estimate.geographicalAreaSubestimates
      .map((subestimate) => generateTableRowsForSubestimate({ type: input.type, subestimate }))
      .filter((element): element is NonNullable<typeof element> => !!element)
      .map((element) => ({
        values: {
          ...element.rows,
          'Country': element.subestimate.country,
          'State': element.subestimate.state ?? 'Unspecified',
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
          'Specimen Type': element.subestimate.specimenType
        }
      }))
  }] : []),
  ...(input.estimate.occupationSubestimates.length > 0 ? [{
    tableHeader: 'Occupation Subestimates',
    tableFields: [
      'Occupation',
      ...generateTableFields({ type: input.type })
    ],
    tableRows: input.estimate.occupationSubestimates
      .map((subestimate) => generateTableRowsForSubestimate({ type: input.type, subestimate }))
      .filter((element): element is NonNullable<typeof element> => !!element)
      .map((element) => ({
        values: {
          ...element.rows,
          'Occupation': element.subestimate.occupation
        }
      }))
  }] : []),
  ...(input.estimate.animalSourceLocationSubestimates.length > 0 ? [{
    tableHeader: 'Animal Source Location Subestimates',
    tableFields: [
      'Imported or Local',
      'Source Country',
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
          'Source Country': element.subestimate.animalCountryOfImport
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
]