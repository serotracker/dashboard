import { DataTableColumnConfigurationEntryType } from "@/components/ui/data-table/data-table-column-config";
import { WhoRegion } from "@/gql/graphql";
import {
  ageGroupToColourClassnameMap,
  animalSpeciesToColourClassnameMap,
  animalSpeciesToStringMap,
  animalTypeToColourClassnameMap,
  animalTypeToStringMap,
  assayToColourClassnameMap,
  isMersAnimalSpecies,
  isMersAnimalType,
  isotypeToColourClassnameMap,
  sexToColourClassnameMap,
  sourceTypeToColourClassnameMap,
  specimenTypeToColourClassnameMap
} from "../(map)/shared-mers-map-pop-up-variables";

export const mersSeroprevalenceAndViralEstimateSharedColumnConfiguration = [{
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'whoRegion',
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
  fieldName: 'city',
  label: 'City'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'state',
  label: 'State'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'country',
  label: 'Country'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'sex',
  valueToColourSchemeClassnameMap: sexToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Sex'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'sourceType',
  valueToColourSchemeClassnameMap: sourceTypeToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Source Type'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'assay',
  valueToColourSchemeClassnameMap: assayToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Assay'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'isotypes',
  valueToColourSchemeClassnameMap: isotypeToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Isotypes'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'specimenType',
  valueToColourSchemeClassnameMap: specimenTypeToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Specimen Type'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'firstAuthorFullName',
  label: 'First Author Full Name'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sourceType',
  label: 'Source Type'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sourceTitle',
  label: 'Source Title'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'insitutution',
  label: 'Institution'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'animalType',
  valueToDisplayLabel: (animalType: string) => isMersAnimalType(animalType) ? animalTypeToStringMap[animalType] : animalType,
  valueToColourSchemeClassnameMap: animalTypeToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Animal Type'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
  fieldName: 'animalSpecies',
  valueToDisplayLabel: (animalSpecies: string) => isMersAnimalSpecies(animalSpecies) ? animalSpeciesToStringMap[animalSpecies] : animalSpecies,
  valueToColourSchemeClassnameMap: animalSpeciesToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Animal Species'
}, {
  type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
  fieldName: 'ageGroup',
  valueToColourSchemeClassnameMap: ageGroupToColourClassnameMap,
  defaultColourSchemeClassname: "bg-sky-100",
  label: 'Age Group'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sampleDenominator',
  label: 'Sample Size (Denominator)'
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'sampleNumerator',
  label: 'Sample Numerator'
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'sensitivity',
  label: 'Test Sensitivity'
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'sensitivity95CILower',
  label: 'Test Sensitivity (95% Confidence Interval Lower Bound)',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'sensitivity95CIUpper',
  label: 'Test Sensitivity (95% Confidence Interval Upper Bound)',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'specificity',
  label: 'Test Specificity'
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'specificity95CILower',
  label: 'Test Specificity (95% Confidence Interval Lower Bound)',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
  fieldName: 'specificity95CIUpper',
  label: 'Test Specificity (95% Confidence Interval Upper Bound)',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'studyInclusionCriteria',
  label: 'Study Inclusion Criteria',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'studyExclusionCriteria',
  label: 'Study Exclusion Criteria',
  initiallyVisible: false
}, {
  type: DataTableColumnConfigurationEntryType.LINK_BUTTON as const,
  fieldName: 'sourceUrl',
  label: 'Source',
  fieldNameForLink: 'sourceUrl',
  isSortable: false
}, {
  type: DataTableColumnConfigurationEntryType.STANDARD as const,
  fieldName: 'id',
  label: 'ID',
  isHideable: false,
  initiallyVisible: false
}]