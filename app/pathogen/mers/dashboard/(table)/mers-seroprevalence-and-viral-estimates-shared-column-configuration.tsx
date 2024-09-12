import { DataTableColumnConfigurationEntryType } from "@/components/ui/data-table/data-table-column-config";
import { WhoRegion } from "@/gql/graphql";
import {
  animalDetectionSettingsToColourClassnameMap,
  animalImportedOrLocalToColourClassnameMap,
  animalPurposeSettingsToColourClassnameMap,
  animalSpeciesToColourClassnameMap,
  animalSpeciesToStringMap,
  animalTypeToColourClassnameMap,
  animalTypeToStringMap,
  antigenToColourClassnameMap,
  assayToColourClassnameMap,
  exposureToCamelLevelToColourClassnameMap,
  geographicScopeToColourClassnameMap,
  humanAgeGroupToColourClassnameMap,
  isMersAnimalSpecies,
  isMersAnimalType,
  isotypeToColourClassnameMap,
  sampleFrameToColourClassnameMap,
  samplingMethodToColourClassnameMap,
  sexToColourClassnameMap,
  sourceTypeToColourClassnameMap,
  specimenTypeToColourClassnameMap,
  testProducerToColourClassnameMap,
  testValidationToColourClassnameMap
} from "../(map)/shared-mers-map-pop-up-variables";
import { isHumanMersEstimate, MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { parseISO } from "date-fns";

export type MersEstimateBaseForDataTable = ReturnType<typeof mapMersEstimateBaseForDataTable>;

export const generateConciseEstimateId = (estimate: MersEstimate) => {
  const humanOrAnimal = isHumanMersEstimate(estimate) ? 'Human' : 'Animal';
  const country = estimate.primaryEstimateInfo.country;
  const sampleFrame = isHumanMersEstimate(estimate)
    ? estimate.primaryEstimateInfo.sampleFrame
    : estimate.primaryEstimateInfo.animalDetectionSettings.at(0)
  const samplingStartYear = estimate.primaryEstimateInfo.samplingStartDate
    ? parseISO(estimate.primaryEstimateInfo.samplingStartDate).getFullYear()
    : undefined;
  const samplingEndYear = estimate.primaryEstimateInfo.samplingEndDate
    ? parseISO(estimate.primaryEstimateInfo.samplingEndDate).getFullYear()
    : undefined;
  const samplingYearString = samplingStartYear !== undefined && samplingEndYear !== undefined
    ? (samplingStartYear !== samplingEndYear
      ? `${samplingStartYear}_${samplingEndYear}`
      : `${samplingStartYear}`
    )
    : undefined;


  return `${humanOrAnimal}_${country}_${sampleFrame}_${samplingYearString}`.replaceAll(/ /g, '_');
}

export const generateConciseSourceId = (estimate: MersEstimate) => {
  const firstAuthorFullName = estimate.primaryEstimateInfo.firstAuthorFullName;
  const sourcePublicationYear = estimate.primaryEstimateInfo.sourcePublicationYear.toString();

  return `${firstAuthorFullName}_${sourcePublicationYear}`.replaceAll(/ /g, '_');
}

export const mapMersEstimateBaseForDataTable = (estimate: MersEstimate) => ({
  latitude: estimate.primaryEstimateInfo.latitude,
  longitude: estimate.primaryEstimateInfo.longitude,
  primaryEstimateWhoRegion: estimate.primaryEstimateInfo.whoRegion,
  primaryEstimateCity: estimate.primaryEstimateInfo.city,
  primaryEstimateState: estimate.primaryEstimateInfo.state,
  primaryEstimateCountry: estimate.primaryEstimateInfo.country,
  primaryEstimateSamplingStartDate: estimate.primaryEstimateInfo.samplingStartDate,
  primaryEstimateSamplingEndDate: estimate.primaryEstimateInfo.samplingEndDate,
  primaryEstimateSex: estimate.primaryEstimateInfo.sex,
  primaryEstimateSourceType: estimate.primaryEstimateInfo.sourceType,
  primaryEstimateAssay: estimate.primaryEstimateInfo.assay,
  primaryEstimateIsotypes: estimate.primaryEstimateInfo.isotypes,
  primaryEstimateSpecimenType: estimate.primaryEstimateInfo.specimenType,
  primaryEstimateFirstAuthorFullName: estimate.primaryEstimateInfo.firstAuthorFullName,
  primaryEstimateSourceTitle: estimate.primaryEstimateInfo.sourceTitle,
  primaryEstimateInsitutution: estimate.primaryEstimateInfo.insitutution,
  primaryEstimateAnimalType: 'animalType' in estimate.primaryEstimateInfo
    ? estimate.primaryEstimateInfo.animalType
    : undefined,
  primaryEstimateAnimalSpecies: 'animalSpecies' in estimate.primaryEstimateInfo
    ? estimate.primaryEstimateInfo.animalSpecies
    : undefined,
  primaryEstimateAnimalDetectionSettings: 'animalDetectionSettings' in estimate.primaryEstimateInfo
    ? estimate.primaryEstimateInfo.animalDetectionSettings
    : undefined,
  primaryEstimateAnimalPurpose: 'animalPurpose' in estimate.primaryEstimateInfo
    ? estimate.primaryEstimateInfo.animalPurpose
    : undefined,
  primaryEstimateAnimalImportedOrLocal: 'animalPurpose' in estimate.primaryEstimateInfo
    ? estimate.primaryEstimateInfo.animalImportedOrLocal
    : undefined,
  primaryEstimateAgeGroup: 'ageGroup' in estimate.primaryEstimateInfo
    ? estimate.primaryEstimateInfo.ageGroup
    : undefined,
  primaryEstimateSampleFrame: 'sampleFrame' in estimate.primaryEstimateInfo
    ? estimate.primaryEstimateInfo.sampleFrame
    : undefined,
  primaryEstimateSampleDenominator: estimate.primaryEstimateInfo.sampleDenominator,
  primaryEstimateSampleNumerator: estimate.primaryEstimateInfo.sampleNumerator,
  primaryEstimateSensitivity: estimate.primaryEstimateInfo.sensitivity,
  primaryEstimateSensitivity95CILower: estimate.primaryEstimateInfo.sensitivity95CILower,
  primaryEstimateSensitivity95CIUpper: estimate.primaryEstimateInfo.sensitivity95CIUpper,
  primaryEstimateSpecificity: estimate.primaryEstimateInfo.specificity,
  primaryEstimateSpecificity95CILower: estimate.primaryEstimateInfo.specificity95CILower,
  primaryEstimateSpecificity95CIUpper: estimate.primaryEstimateInfo.specificity95CIUpper,
  primaryEstimateSamplingMethod: estimate.primaryEstimateInfo.samplingMethod,
  primaryEstimateGeographicScope: estimate.primaryEstimateInfo.geographicScope,
  primaryEstimateTestProducer: estimate.primaryEstimateInfo.testProducer,
  primaryEstimateTestValidation: estimate.primaryEstimateInfo.testValidation,
  primaryEstimateStudyInclusionCriteria: estimate.primaryEstimateInfo.studyInclusionCriteria,
  primaryEstimateStudyExclusionCriteria: estimate.primaryEstimateInfo.studyExclusionCriteria,
  primaryEstimateSourceUrl: estimate.primaryEstimateInfo.sourceUrl,
  primaryEstimateAntigen: estimate.primaryEstimateInfo.antigen,
  primaryEstimateSocioeconomicStatus: estimate.primaryEstimateInfo.socioeconomicStatus,
  primaryEstimateExposureToCamels: estimate.primaryEstimateInfo.exposureToCamels,
  primaryEstimateTestProducerOther: estimate.primaryEstimateInfo.testProducerOther,
  primaryEstimateTestValidatedOn: estimate.primaryEstimateInfo.testValidatedOn,
  primaryEstimatePositiveCutoff: estimate.primaryEstimateInfo.positiveCutoff,
  primaryEstimateSymptomPrevalenceOfPositives: estimate.primaryEstimateInfo.symptomPrevalenceOfPositives,
  primaryEstimateSymptomDefinition: estimate.primaryEstimateInfo.symptomDefinition,
  primaryEstimateSequencingDone: estimate.primaryEstimateInfo.sequencingDone,
  primaryEstimateClade: estimate.primaryEstimateInfo.clade,
  primaryEstimateAccessionNumbers: estimate.primaryEstimateInfo.accessionNumbers,
  primaryEstimateGenomeSequenced: estimate.primaryEstimateInfo.genomeSequenced,
})

export const mersSeroprevalenceAndViralEstimateSharedColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'primaryEstimateWhoRegion',
  label: 'WHO Region',
  valueToColourSchemeClassnameMap: {
    [WhoRegion.Afr]: "bg-who-region-afr",
    [WhoRegion.Amr]: "bg-who-region-amr",
    [WhoRegion.Emr]: "bg-who-region-emr",
    [WhoRegion.Eur]: "bg-who-region-eur",
    [WhoRegion.Sear]: "bg-who-region-sear",
    [WhoRegion.Wpr]: "bg-who-region-wpr text-white"
  },
  defaultColourSchemeClassname: 'bg-sky-100'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'primaryEstimateCountry',
  label: 'Country'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'primaryEstimateState',
  label: 'State'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'primaryEstimateCity',
  label: 'City'
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'primaryEstimateSamplingStartDate',
  label: 'Sampling Start Date',
}, {
  type: DataTableColumnConfigurationEntryType.DATE as const,
  fieldName: 'primaryEstimateSamplingEndDate',
  label: 'Sampling End Date',
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'primaryEstimateSex',
  valueToColourSchemeClassnameMap: sexToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Sex'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'primaryEstimateSourceType',
  valueToColourSchemeClassnameMap: sourceTypeToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Source Type'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'primaryEstimateAssay',
  valueToColourSchemeClassnameMap: assayToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Assay'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'primaryEstimateIsotypes',
  valueToColourSchemeClassnameMap: isotypeToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Isotypes'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'primaryEstimateSpecimenType',
  valueToColourSchemeClassnameMap: specimenTypeToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Specimen Type'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'primaryEstimateAntigen',
  valueToColourSchemeClassnameMap: antigenToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Antigen'
}, {
  type: DataTableColumnConfigurationEntryType.BOOLEAN as const,
  fieldName: 'primaryEstimateSequencingDone',
  label: 'Genomic Sequencing Done?'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'primaryEstimateFirstAuthorFullName',
  label: 'First Author Full Name'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'primaryEstimateSourceTitle',
  label: 'Source Title'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'primaryEstimateInsitutution',
  label: 'Institution'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'primaryEstimateSocioeconomicStatus',
  label: 'Socioeconomic Status'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'primaryEstimateAnimalType',
  valueToDisplayLabel: (animalType: string) => isMersAnimalType(animalType) ? animalTypeToStringMap[animalType] : animalType,
  valueToColourSchemeClassnameMap: animalTypeToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Animal Type'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'primaryEstimateAnimalSpecies',
  valueToDisplayLabel: (animalSpecies: string) => isMersAnimalSpecies(animalSpecies) ? animalSpeciesToStringMap[animalSpecies] : animalSpecies,
  valueToColourSchemeClassnameMap: animalSpeciesToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Animal Species'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'primaryEstimateAnimalDetectionSettings',
  valueToColourSchemeClassnameMap: animalDetectionSettingsToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Animal Sample Frame',
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'primaryEstimateAnimalPurpose',
  valueToColourSchemeClassnameMap: animalPurposeSettingsToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Animal Purpose',
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'primaryEstimateAnimalImportedOrLocal',
  valueToColourSchemeClassnameMap: animalImportedOrLocalToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Animal Imported Or Local',
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'primaryEstimateAgeGroup',
  valueToColourSchemeClassnameMap: humanAgeGroupToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Age Group'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'primaryEstimateExposureToCamels',
  valueToColourSchemeClassnameMap: exposureToCamelLevelToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Exposure To Camels'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'primaryEstimateSampleFrame',
  valueToColourSchemeClassnameMap: sampleFrameToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Sample Frame'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'primaryEstimateSampleDenominator',
  label: 'Sample Size (Denominator)'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'primaryEstimateSampleNumerator',
  label: 'Sample Numerator'
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'primaryEstimateSensitivity',
  label: 'Test Sensitivity'
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'primaryEstimateSensitivity95CILower',
  label: 'Test Sensitivity (95% Confidence Interval Lower Bound)',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'primaryEstimateSensitivity95CIUpper',
  label: 'Test Sensitivity (95% Confidence Interval Upper Bound)',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'primaryEstimateSpecificity',
  label: 'Test Specificity'
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'primaryEstimateSpecificity95CILower',
  label: 'Test Specificity (95% Confidence Interval Lower Bound)',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'primaryEstimateSpecificity95CIUpper',
  label: 'Test Specificity (95% Confidence Interval Upper Bound)',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'primaryEstimateSamplingMethod',
  valueToColourSchemeClassnameMap: samplingMethodToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Sampling Method',
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'primaryEstimateGeographicScope',
  valueToColourSchemeClassnameMap: geographicScopeToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Geographic Scope',
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'primaryEstimateTestProducer',
  valueToColourSchemeClassnameMap: testProducerToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Test Producer',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'primaryEstimateTestProducerOther',
  label: 'Test Producer (If Other)'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'primaryEstimateTestValidatedOn',
  label: 'Test Validated On'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'primaryEstimatePostiveCutoff',
  label: 'Positive Cutoff'
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'primaryEstimateSymptomPrevalenceOfPositives',
  label: 'Symptom Prevalence in Positive Cases'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'primaryEstimateSymptomDefinition',
  label: 'Symptom Definition'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'primaryEstimateTestValidation',
  valueToColourSchemeClassnameMap: testValidationToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Test Validation',
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'primaryEstimateStudyInclusionCriteria',
  label: 'Study Inclusion Criteria',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'primaryEstimateStudyExclusionCriteria',
  label: 'Study Exclusion Criteria',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.LINK_BUTTON as const,
  fieldName: 'primaryEstimateSourceUrl',
  label: 'Source',
  fieldNameForLink: 'primaryEstimateSourceUrl',
  isSortable: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'id',
  label: 'ID',
  isHideable: false,
  initiallyVisible: false
}]