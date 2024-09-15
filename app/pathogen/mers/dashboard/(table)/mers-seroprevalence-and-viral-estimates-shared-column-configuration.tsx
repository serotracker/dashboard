import { DataTableColumnConfigurationEntryType } from "@/components/ui/data-table/data-table-column-config";
import { WhoRegion } from "@/gql/graphql";
import {
  animalAgeGroupToColourClassnameMap,
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
  isMersSeroprevalenceEstimateTypename,
  isMersViralEstimateTypename,
  isotypeToColourClassnameMap,
  mersDataTypeToColourClassnameMap,
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
import { useContext, useMemo, useCallback } from "react";
import { CountryDataContext } from "@/contexts/pathogen-context/country-information-context";
import { pipe } from "fp-ts/lib/function";
import { distinctBackgroundColoursMap, distinctColoursMap, typedObjectFromEntries } from "@/lib/utils";

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


  return `${humanOrAnimal}_${country}_${sampleFrame}_${samplingYearString}`.replaceAll(/ /g, '');
}

export const mersEstimateTypeToTypeMap = {
  "PrimaryHumanMersSeroprevalenceEstimateInformation": "Human",
  "PrimaryAnimalMersSeroprevalenceEstimateInformation": "Animal",
  "PrimaryHumanMersViralEstimateInformation": "Human",
  "PrimaryAnimalMersViralEstimateInformation": "Animal",
}

export const generateConciseSourceId = (estimate: MersEstimate) => {
  const firstAuthorFullName = estimate.primaryEstimateInfo.firstAuthorFullName;
  const sourcePublicationYear = estimate.primaryEstimateInfo.sourcePublicationYear.toString();

  return `${firstAuthorFullName}_${sourcePublicationYear}`.replaceAll(/ /g, '_');
}

export const generatePrimaryEstimateSamplingYearRange = (estimate: MersEstimate) => {
  const samplingStartYear = estimate.primaryEstimateInfo.samplingStartDate
    ? parseISO(estimate.primaryEstimateInfo.samplingStartDate).getFullYear()
    : undefined;
  const samplingEndYear = estimate.primaryEstimateInfo.samplingEndDate
    ? parseISO(estimate.primaryEstimateInfo.samplingEndDate).getFullYear()
    : undefined;

  if(samplingStartYear === undefined && samplingEndYear === undefined) {
    return 'Unknown';
  }

  if(samplingStartYear === undefined) {
    return samplingEndYear?.toString() ?? 'Unknown';
  }

  if(samplingEndYear === undefined) {
    return samplingStartYear?.toString() ?? 'Unknown';
  }

  if(samplingStartYear === samplingEndYear) {
    return samplingStartYear.toString();
  }

  return `${samplingStartYear.toString()}-${samplingEndYear.toString()}`;
}

export const mapMersEstimateBaseForDataTable = (estimate: MersEstimate) => ({
  latitude: estimate.primaryEstimateInfo.latitude,
  longitude: estimate.primaryEstimateInfo.longitude,
  conciseEstimateId: generateConciseEstimateId(estimate),
  primaryEstimateSamplingYearRange: generatePrimaryEstimateSamplingYearRange(estimate),
  primaryEstimateHumanAndAnimalSampleFrame: isHumanMersEstimate(estimate)
    ? (estimate.primaryEstimateInfo.sampleFrame ? [ estimate.primaryEstimateInfo.sampleFrame ] : [] )
    : estimate.primaryEstimateInfo.animalDetectionSettings,
  primaryEstimateCountryOfTravelOrImport: isHumanMersEstimate(estimate)
    ? estimate.primaryEstimateInfo.humanCountriesOfTravel.map(({ name }) => name)
    : estimate.primaryEstimateInfo.animalCountriesOfImport.map(({ name }) => name),
  primaryEstimateHumanAndAnimalAgeGroup: isHumanMersEstimate(estimate)
    ? estimate.primaryEstimateInfo.ageGroup
    : estimate.primaryEstimateInfo.animalAgeGroup,
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
});

const getEstimateTypeColumns = (
  input: GetMersSeroprevalenceAndViralEstimateSharedColumnConfigurationInput
) => {
  if(input.dataTableType === MersEstimateDataTableType.SEROPREVALENCE_ESTIMATES) {
    return [{
      type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
      fieldName: 'primaryEstimateTypename',
      valueToDisplayLabel: (typename: string) => isMersSeroprevalenceEstimateTypename(typename) ? mersEstimateTypeToTypeMap[typename] : typename,
      valueToColourSchemeClassnameMap: mersDataTypeToColourClassnameMap,
      defaultColourSchemeClassname: "bg-sky-100",
      label: 'Type'
    }]
  }

  return [{
    type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
    fieldName: 'primaryEstimateTypename',
    valueToDisplayLabel: (typename: string) => isMersViralEstimateTypename(typename) ? mersEstimateTypeToTypeMap[typename] : typename,
    valueToColourSchemeClassnameMap: mersDataTypeToColourClassnameMap,
    defaultColourSchemeClassname: "bg-sky-100",
    label: 'Type'
  }];
}

const getPrevalenceColumns = (
  input: GetMersSeroprevalenceAndViralEstimateSharedColumnConfigurationInput
) => {
  if(input.dataTableType === MersEstimateDataTableType.SEROPREVALENCE_ESTIMATES) {
    return [
      {
        type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
        fieldName: 'primaryEstimateSeroprevalence',
        label: 'Seroprevalence'
      }, {
        type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
        fieldName: 'primaryEstimateSeroprevalence95CILower',
        label: 'Seroprevalence (95% Confidence Interval Lower Bound)',
        initiallyVisible: false
      }, {
        type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
        fieldName: 'primaryEstimateSeroprevalence95CIUpper',
        label: 'Seroprevalence (95% Confidence Interval Upper Bound)',
        initiallyVisible: false
      }
    ];
  }

  return [
    {
      type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
      fieldName: 'primaryEstimatePositivePrevalence',
      label: 'Positive Prevalence'
    }, {
      type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
      fieldName: 'primaryEstimatePositivePrevalence95CILower',
      label: 'Positive Prevalence (95% Confidence Interval Lower Bound)',
      initiallyVisible: false
    }, {
      type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
      fieldName: 'primaryEstimatePositivePrevalence95CIUpper',
      label: 'Positive Prevalence (95% Confidence Interval Upper Bound)',
      initiallyVisible: false
    }
  ]
}

export enum MersEstimateDataTableType {
  SEROPREVALENCE_ESTIMATES = 'SEROPREVALENCE_ESTIMATES',
  VIRAL_ESTIMATES = 'VIRAL_ESTIMATES'
}

interface GetMersSeroprevalenceAndViralEstimateSharedColumnConfigurationInput {
  dataTableType: MersEstimateDataTableType;
}

export const useMersEstimateColumnConfiguration = () => {
  const countryDataContext = useContext(CountryDataContext);

  const countryNameToColourClassnameMap: Record<string, string | undefined> = useMemo(() => pipe(
    countryDataContext,
    (context) => context
      .map((element, index) => ({
        ...element,
        colourClassname: distinctBackgroundColoursMap[index % Object.keys(distinctColoursMap).length]
      }))
      .filter((element): element is Omit<typeof element, 'colourClassname'> & {
        colourClassname: NonNullable<typeof element['colourClassname']>
      } => !!element.colourClassname)
      .map((element): [string, string] => [element.countryName, element.colourClassname]),
    (context) => typedObjectFromEntries(context)
  ), [ countryDataContext ])

  const getMersSeroprevalenceAndViralEstimateSharedColumnConfiguration = useCallback((
    input: GetMersSeroprevalenceAndViralEstimateSharedColumnConfigurationInput
  ) => [{
    type: DataTableColumnConfigurationEntryType.LINK as const,
    fieldName: 'conciseEstimateId',
    label: 'Estimate ID',
    isHideable: false,
    isFixed: true,
    fieldNameForLink: 'primaryEstimateSourceUrl',
    size: 400,
  }, {
    type: DataTableColumnConfigurationEntryType.STANDARD as const,
    fieldName: 'primaryEstimateId',
    label: 'Full Estimate ID',
    initiallyVisible: false
  }, {
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
    fieldName: 'primaryEstimateSamplingYearRange',
    label: 'Year(s)'
  },
  ...getEstimateTypeColumns(input),
  {
    type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
    fieldName: 'primaryEstimateHumanAndAnimalSampleFrame',
    valueToColourSchemeClassnameMap: {
      ...sampleFrameToColourClassnameMap,
      ...animalDetectionSettingsToColourClassnameMap
    },
    defaultColourSchemeClassname: "bg-sky-100",
    label: 'Sample Frame',
  },
  ...getPrevalenceColumns(input),
  {
    type: DataTableColumnConfigurationEntryType.STANDARD as const,
    fieldName: 'primaryEstimateSampleDenominator',
    label: 'Denominator'
  }, {
    type: DataTableColumnConfigurationEntryType.STANDARD as const,
    fieldName: 'primaryEstimateSampleNumerator',
    label: 'Numerator'
  }, {
    type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
    fieldName: 'primaryEstimateCountryOfTravelOrImport',
    valueToColourSchemeClassnameMap: countryNameToColourClassnameMap,
    defaultColourSchemeClassname: "bg-sky-100",
    label: 'Country of Travel/Import'
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
    fieldName: 'primaryEstimateInsitutution',
    label: 'Institution'
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
    fieldName: 'primaryEstimateHumanAndAnimalAgeGroup',
    valueToColourSchemeClassnameMap: {
      ...humanAgeGroupToColourClassnameMap,
      ...animalAgeGroupToColourClassnameMap
    },
    defaultColourSchemeClassname: "bg-sky-100",
    label: 'Age Group'
  }, {
    type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
    fieldName: 'primaryEstimateExposureToCamels',
    valueToColourSchemeClassnameMap: exposureToCamelLevelToColourClassnameMap,
    defaultColourSchemeClassname: "bg-sky-100",
    label: 'Exposure To Camels'
  }, {
    type: DataTableColumnConfigurationEntryType.STANDARD as const,
    fieldName: 'primaryEstimateSocioeconomicStatus',
    label: 'Socioeconomic Status',
    initiallyVisible: false
  }, {
    type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
    fieldName: 'primaryEstimateSensitivity',
    label: 'Test Sensitivity',
    initiallyVisible: false
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
    label: 'Test Specificity',
    initiallyVisible: false
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
    initiallyVisible: false
  }, {
    type: DataTableColumnConfigurationEntryType.COLOURED_PILL as const,
    fieldName: 'primaryEstimateGeographicScope',
    valueToColourSchemeClassnameMap: geographicScopeToColourClassnameMap,
    defaultColourSchemeClassname: "bg-sky-100",
    label: 'Geographic Scope',
    initiallyVisible: false
  }, {
    type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
    fieldName: 'primaryEstimateTestProducer',
    valueToColourSchemeClassnameMap: testProducerToColourClassnameMap,
    defaultColourSchemeClassname: "bg-sky-100",
    label: 'Test Producer',
    initiallyVisible: false
  }, {
    type: DataTableColumnConfigurationEntryType.STANDARD as const,
    fieldName: 'primaryEstimateTestProducerOther',
    label: 'Test Producer (If Other)',
    initiallyVisible: false
  }, {
    type: DataTableColumnConfigurationEntryType.STANDARD as const,
    fieldName: 'primaryEstimateTestValidatedOn',
    label: 'Test Validated On',
    initiallyVisible: false
  }, {
    type: DataTableColumnConfigurationEntryType.STANDARD as const,
    fieldName: 'primaryEstimatePostiveCutoff',
    label: 'Positive Cutoff',
    initiallyVisible: false
  }, {
    type: DataTableColumnConfigurationEntryType.PERCENTAGE as const,
    fieldName: 'primaryEstimateSymptomPrevalenceOfPositives',
    label: 'Symptom Prevalence in Positive Cases',
    initiallyVisible: false
  }, {
    type: DataTableColumnConfigurationEntryType.STANDARD as const,
    fieldName: 'primaryEstimateSymptomDefinition',
    label: 'Symptom Definition',
    initiallyVisible: false
  }, {
    type: DataTableColumnConfigurationEntryType.COLOURED_PILL_LIST as const,
    fieldName: 'primaryEstimateTestValidation',
    valueToColourSchemeClassnameMap: testValidationToColourClassnameMap,
    defaultColourSchemeClassname: "bg-sky-100",
    label: 'Test Validation',
    initiallyVisible: false
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
    isSortable: false,
    initiallyVisible: false
  }, {
    type: DataTableColumnConfigurationEntryType.STANDARD as const,
    fieldName: 'primaryEstimateSourceTitle',
    label: 'Source Title'
  }, {
    type: DataTableColumnConfigurationEntryType.STANDARD as const,
    fieldName: 'id',
    label: 'ID',
    isHideable: false,
    initiallyVisible: false
  }], [ countryNameToColourClassnameMap ]);

  const mersSeroprevalenceEstimateColumnConfiguration = useMemo(() => getMersSeroprevalenceAndViralEstimateSharedColumnConfiguration({
    dataTableType: MersEstimateDataTableType.SEROPREVALENCE_ESTIMATES
  }), [ getMersSeroprevalenceAndViralEstimateSharedColumnConfiguration ]);

  const mersViralEstimateColumnConfiguration = useMemo(() => getMersSeroprevalenceAndViralEstimateSharedColumnConfiguration({
    dataTableType: MersEstimateDataTableType.SEROPREVALENCE_ESTIMATES
  }), [ getMersSeroprevalenceAndViralEstimateSharedColumnConfiguration ]);

  return {
    mersSeroprevalenceEstimateColumnConfiguration,
    mersViralEstimateColumnConfiguration
  }
}
