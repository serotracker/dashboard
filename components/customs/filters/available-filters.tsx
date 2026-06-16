import { PathogenContextState, PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { DateFilter } from "./date-filter";
import { MultiSelectFilter } from "./multi-select-filter";
import { unRegionEnumToLabelMap } from "@/lib/un-regions";
import { SingleSelectFilter } from "./single-select-filter";
import Link from "next/link";
import { useContext, useMemo } from "react";
import { SendFilterChangeDispatch } from "../filters";
import { BooleanSelectFilter } from "./boolean-select-filter";
import { BooleanSelectOptionString } from "./select-filter";
import { CountryInformationContext } from "@/contexts/pathogen-context/country-information-context";
import { Arbovirus, ArbovirusEstimateType, ArbovirusStudyPopulation, MersAnimalSpecies } from "@/gql/graphql";
import { arboShortformToFullNamePlusVirusMap } from "@/app/pathogen/arbovirus/dashboard/(visualizations)/recharts";
import { ColouredCheckboxFilter } from "./coloured-checkbox-filter";
import {
  animalSpeciesToStringMap,
  animalTypeToStringMap,
  diagnosisSourceToStringMap,
  isMersDataType,
  isMersDataTypeSuperOption,
  useMersDataTypeSuperOptionToLabelMap,
  mersDataTypeToColourClassnameMapForCheckbox,
  mersDataTypeToSortOrderMap,
  mersDataTypeToSuperOptionMap,
  mersMapPointVisibilitySettingToHiddenOptionsMap,
  useMersDataTypeToLabelMap,
  isMersAnimalSpecies
} from "@/app/pathogen/mers/dashboard/(map)/shared-mers-map-pop-up-variables";
import { UNRegionsTooltip, WHORegionsTooltip } from "../tooltip-content";
import { GroupedColouredCheckboxFilter } from "./grouped-coloured-checkbox-filter";
import { MersMapCustomizationsContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/map-customizations-context";
import { isMersMacroSampleFrameType, MersMacroSampleFramesContext, MersMacroSampleFrameType, mersMacroSampleFrameTypeToTextMap } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-macro-sample-frames-context";
import { isMersAssayClassification, MersAssayClassification, MersAssayClassificationContext, mersAssayClassificationToTextMap } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-assay-classification-content";
import { PositivePrevalenceFilterOptions } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-data-filtering";
import { MersFilterMetadataContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-filter-metadata-context";
import { isMersAnimalSpeciesGroup, MersAnimalSpeciesGroup, MersAnimalSpeciesGroupContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-animal-species-group-context";

export interface FieldInformation {
  field: FilterableField;
  label: string;
  valueToLabelMap: Record<string, string | undefined>;
  optionToColourClassnameMap?: Record<string, string | undefined>;
  optionSortingFunction?: (a: string, b:string) => number;
  optionToSuperOptionFunction?: (option: string) => string;
  superOptionSortingFunction?: (superOptionA: string, superOptionB: string) => number;
  sorted?: boolean;
  superOptionToLabelMap?: (superOption: string) => string;
  renderTooltipContent?: TooltipContentRenderingFunction
  filterRenderingFunction: FilterRenderingFunction;
  hiddenOptions?: string[];
  clearAllButtonText?: string;
}

interface RenderTooltipContentInput<
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
> {
  state: PathogenContextType<TEstimate, TPathogenContextState>;
}

export type TooltipContentRenderingFunction = <
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
>(input: RenderTooltipContentInput<TEstimate, TPathogenContextState>) => React.ReactNode;

interface FilterRenderingFunctionInput<
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
> {
  filter: string;
  placeholder: string;
  state: PathogenContextType<TEstimate, TPathogenContextState>;
  filterOptions: string[];
  data: TEstimate[] | Record<string, unknown>;
  optionToLabelMap: Record<string, string | undefined>;
  optionSortingFunction: ((a: string, b: string) => number) | undefined;
  optionToSuperOptionFunction: ((option: string) => string) | undefined;
  superOptionSortingFunction?: (superOptionA: string, superOptionB: string) => number;
  sorted?: boolean;
  superOptionToLabelMap?: ((superOption: string) => string) | undefined;
  renderTooltipContent: TooltipContentRenderingFunction | undefined;
  sendFilterChangeDispatch: SendFilterChangeDispatch;
  hiddenOptions: string[];
  optionToColourClassnameMap: Record<string, string | undefined>;
  clearAllButtonText: string;
}

type FilterRenderingFunction = <
  TEstimate extends Record<string, unknown>,
  TPathogenContextState extends PathogenContextState<TEstimate>
>(input: FilterRenderingFunctionInput<TEstimate, TPathogenContextState>) => React.ReactNode;

export enum FilterableField {
  ageGroup = "ageGroup",
  __typename = "__typename",
  pediatricAgeGroup = "pediatricAgeGroup",
  sex = "sex",
  estimateType = "estimateType",
  studyPopulation = "studyPopulation",
  samplingMethod = "samplingMethod",
  geographicScope = "geographicScope",
  testProducer = "testProducer",
  testValidation = "testValidation",
  animalDetectionSettings = "animalDetectionSettings",
  animalPurpose = "animalPurpose",
  animalImportedOrLocal = "animalImportedOrLocal",
  esm = "esm",
  positiveCases = "positiveCases",
  whoRegion = "whoRegion",
  unRegion = "unRegion",
  countryAlphaTwoCode = "countryAlphaTwoCode",
  assay = "assay",
  mersAssay = "mersAssay",
  producer = "producer",
  sampleFrame = "sampleFrame",
  sampleFrames = "sampleFrames",
  antibody = "antibody",
  antigen = "antigen",
  exposureToCamels = "exposureToCamels",
  pathogen = "pathogen",
  specimenType = "specimenType",
  start_date = "start_date",
  end_date = "end_date",
  samplingStartDate = "samplingStartDate",
  samplingEndDate = "samplingEndDate",
  isWHOUnityAligned = "isWHOUnityAligned",
  riskOfBias = "riskOfBias",
  serotype = "serotype",
  scope = "scope",
  sourceType = "sourceType",
  antibodies = "antibodies",
  testType = "testType",
  isotypes = "isotypes",
  populationGroup = "populationGroup",
  diagnosisSource = "diagnosisSource",
  animalType = "animalType",
  animalSpecies = "animalSpecies",
  clade = "clade",
  positivePrevalence = "positivePrevalence"
}

const RiskOfBiasTooltip: TooltipContentRenderingFunction = (input) => (
  <p>Reflects the extent to which the true prevalence may be different from the estimated prevalence. Estimated by SeroTracker reviewers based on the Joanna Briggs Institute critical appraisal tool for prevalence estimates.</p>
)

const WhoUnityTooltip: TooltipContentRenderingFunction = (input) => (
  <>
    <p className="inline">The WHO developed several standardized generic protocols for robust investigations for COVID-19: </p>
    <Link className="inline text-link" target="_blank" rel="noopener noreferrer" href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/technical-guidance/early-investigations">the Unity studies</Link>
    <p className="inline">. SeroTracker is collaborating with the WHO to support and visualize studies aligned with the population-based seroepidemiological Unity protocol.</p>
  </>
)

const esmValueToLink: Record<string, string | undefined> = {
  'dengue2015': 'https://doi.org/10.1038/s41564-019-0476-8',
  'dengue2050': 'https://doi.org/10.1038/s41564-019-0476-8',
  'zika': 'http://dx.doi.org/10.7554/eLife.15272.001'
}

const EnvironmentalSuitabilityMapTooltip: TooltipContentRenderingFunction = (input) => {
  const isEsmMapSelected = input.state.selectedFilters.esm?.length === 1;

  const filterLink = useMemo(() => {
    if(!isEsmMapSelected) {
      return ''
    }

    const selectedEsmFilter = input.state.selectedFilters.esm[0];

    return esmValueToLink[selectedEsmFilter] ?? '';
  }, [isEsmMapSelected, input.state.selectedFilters])

  return (
    <p>
     This is a single-select dropdown representing environmental suitability for relevant vector species per pathogen. 
     {isEsmMapSelected && (
      <>
        <p className="inline"> This map is sourced from this </p>
        <Link
          rel="noopener noreferrer"
          target="_blank"
          href={filterLink}
          className="underline hover:text-gray-300 inline"
        >
          article
        </Link>
      </>
     )}
    </p>
  )
}

const positiveCasesToLink: Record<string, string | undefined> = {
  'orov_2024_Jan1ToJuly20': 'https://www.who.int/emergencies/disease-outbreak-news/item/2024-DON530'
}

const PositiveCasesMapTooltip: TooltipContentRenderingFunction = (input) => {
  const isPositiveCasesMapSelected = input.state.selectedFilters.positiveCases?.length === 1;

  const filterLink = useMemo(() => {
    if(!isPositiveCasesMapSelected) {
      return ''
    }

    const selectedEsmFilter = input.state.selectedFilters.positiveCases[0];

    return positiveCasesToLink[selectedEsmFilter] ?? '';
  }, [isPositiveCasesMapSelected, input.state.selectedFilters])

  return (
    <p>
     This is a single-select dropdown for different options for viewing positive cases.
     {isPositiveCasesMapSelected && (
      <>
        <p className="inline"> This map is sourced from this </p>
        <Link
          rel="noopener noreferrer"
          target="_blank"
          href={filterLink}
          className="underline hover:text-gray-300 inline"
        >
          report
        </Link>
      </>
     )}
    </p>
  )
}

export const filterArbovirusToSortOrderMap: Record<Arbovirus, number> & Record<string, number | undefined> = {
  [Arbovirus.Zikv]: 1,
  [Arbovirus.Denv]: 2,
  [Arbovirus.Chikv]: 3,
  [Arbovirus.Yfv]: 4,
  [Arbovirus.Wnv]: 5,
  [Arbovirus.Mayv]: 6,
  [Arbovirus.Orov]: 7,
}

const pathogenColorsTailwind: { [key in Arbovirus]: string } = {
  [Arbovirus.Zikv]: "data-[state=checked]:bg-zikv",
  [Arbovirus.Chikv]: "data-[state=checked]:bg-chikv",
  [Arbovirus.Wnv]: "data-[state=checked]:bg-wnv",
  [Arbovirus.Denv]: "data-[state=checked]:bg-denv",
  [Arbovirus.Yfv]: "data-[state=checked]:bg-yfv",
  [Arbovirus.Mayv]: "data-[state=checked]:bg-mayv",
  [Arbovirus.Orov]: "data-[state=checked]:bg-orov",
};

export const scopeToSortOrderMap: Record<string, number | undefined> = {
  'National': 1,
  'Regional': 2,
  'Local': 3
};

const scopeColorsTailwind: Record<string, string | undefined> = {
  "Local": "data-[state=checked]:bg-local-study",
  "Regional": "data-[state=checked]:bg-regional-study",
  "National": "data-[state=checked]:bg-national-study",
};

const scopeToLabelForFilter: Record<string, string | undefined> = {
  "Local": "Local Studies",
  "Regional": "Regional Studies",
  "National": "Country/Territory-Wide Studies",
};

export const useAvailableFilters = () => {
  const { countryAlphaTwoCodeToCountryNameMap } = useContext(CountryInformationContext);
  const { mapDataPointVisibilitySetting } = useContext(MersMapCustomizationsContext);
  const { mersDataTypeToLabelMap } = useMersDataTypeToLabelMap();
  const { getMacroSampleFramesForSampleFrame } = useContext(MersMacroSampleFramesContext);
  const { getAssayClassificationsForAssay } = useContext(MersAssayClassificationContext);
  const { areNonCamelAnimalsIncluded } = useContext(MersFilterMetadataContext);
  const { mersDataTypeSuperOptionToLabelMap } = useMersDataTypeSuperOptionToLabelMap();
  const {
    mersAnimalSpeciesToAnimalSpeciesGroupMap,
    mersAnimalSpeciesGroupToSortOrderMap,
    mersAnimalSpeciesGroupToLabelMap,
  } = useContext(MersAnimalSpeciesGroupContext);

  const availableFilters: {[key in FilterableField]: FieldInformation } = {
    [FilterableField.pathogen]: {
      field: FilterableField.pathogen,
      label: "Arbovirus",
      valueToLabelMap: arboShortformToFullNamePlusVirusMap,
      optionToColourClassnameMap: pathogenColorsTailwind,
      optionSortingFunction: (optionA, optionB) => 
        (filterArbovirusToSortOrderMap[optionA] ?? 0) - (filterArbovirusToSortOrderMap[optionB] ?? 0),
      filterRenderingFunction: ColouredCheckboxFilter,
      clearAllButtonText: 'Clear all viruses'
    },
    [FilterableField.estimateType]: {
      field: FilterableField.estimateType,
      label: "Estimate Type",
      valueToLabelMap: {
        [ArbovirusEstimateType.Seroprevalence]: "Seroprevalence Estimates",
        [ArbovirusEstimateType.ViralPrevalence]: "Viral Prevalence Estimates",
      },
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.studyPopulation]: {
      field: FilterableField.studyPopulation,
      label: "Study Population",
      valueToLabelMap: {
        [ArbovirusStudyPopulation.Human]: "Human",
        [ArbovirusStudyPopulation.Insect]: "Insect",
        [ArbovirusStudyPopulation.NonHumanAnimal]: "Non-Human Animal",
      },
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.start_date]: {
      field: FilterableField.start_date,
      label: "Sampling Start Date",
      valueToLabelMap: {},
      filterRenderingFunction: DateFilter
    },
    [FilterableField.end_date]: {
      field: FilterableField.end_date,
      label: "Sampling End Date",
      valueToLabelMap: {},
      filterRenderingFunction: DateFilter
    },
    [FilterableField.samplingStartDate]: {
      field: FilterableField.samplingStartDate,
      label: "Sampling Start Date",
      valueToLabelMap: {},
      filterRenderingFunction: DateFilter
    },
    [FilterableField.samplingEndDate]: {
      field: FilterableField.samplingEndDate,
      label: "Sampling End Date",
      valueToLabelMap: {},
      filterRenderingFunction: DateFilter
    },
    [FilterableField.isWHOUnityAligned]: {
      field: FilterableField.isWHOUnityAligned,
      label: "WHO Unity Alignment",
      valueToLabelMap: {
        [BooleanSelectOptionString.TRUE]: 'WHO Unity Aligned Only',
        [BooleanSelectOptionString.FALSE]: 'Non-WHO Unity Aligned Only'
      } as const,
      renderTooltipContent: WhoUnityTooltip,
      filterRenderingFunction: BooleanSelectFilter
    },
    [FilterableField.riskOfBias]: {
      field: FilterableField.riskOfBias,
      label: "Risk of Bias",
      valueToLabelMap: {},
      renderTooltipContent: RiskOfBiasTooltip,
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.whoRegion]: {
      field: FilterableField.whoRegion,
      label: "WHO Region",
      valueToLabelMap: {},
      renderTooltipContent: () => <WHORegionsTooltip />,
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.unRegion]: {
      field: FilterableField.unRegion,
      label: "UN Region",
      valueToLabelMap: unRegionEnumToLabelMap,
      renderTooltipContent: () => <UNRegionsTooltip />,
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.countryAlphaTwoCode]: {
      field: FilterableField.countryAlphaTwoCode,
      label: "Countries and Areas",
      valueToLabelMap: countryAlphaTwoCodeToCountryNameMap,
      filterRenderingFunction: MultiSelectFilter,
      sorted: false
    },
    [FilterableField.esm]: {
      field: FilterableField.esm,
      label: "Environmental Suitability Map",
      valueToLabelMap: {
        "zika": "Zika 2016",
        "dengue2015": "Dengue 2015",
        "dengue2050": "Dengue 2050 (Projected)",
      },
      renderTooltipContent: EnvironmentalSuitabilityMapTooltip,
      filterRenderingFunction: SingleSelectFilter
    },
    [FilterableField.positiveCases]: {
      field: FilterableField.positiveCases,
      label: "Positive Cases Map",
      valueToLabelMap: {
        "orov_2024_Jan1ToJuly20": "Oropouche Positive Cases Reported (Jan 1st 2024 - July 20th 2024)"
      },
      renderTooltipContent: PositiveCasesMapTooltip,
      filterRenderingFunction: SingleSelectFilter
    },
    [FilterableField.ageGroup]: {
      field: FilterableField.ageGroup,
      label: "Age Group",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.clade]: {
      field: FilterableField.clade,
      label: "Clade",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.specimenType]: {
      field: FilterableField.specimenType,
      label: "Specimen Type",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.samplingMethod]: {
      field: FilterableField.samplingMethod,
      label: "Sampling Method",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.geographicScope]: {
      field: FilterableField.geographicScope,
      label: "Geographic Scope",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.testProducer]: {
      field: FilterableField.testProducer,
      label: "Test Producer",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.testValidation]: {
      field: FilterableField.testValidation,
      label: "Test Validation",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.animalDetectionSettings]: {
      field: FilterableField.animalDetectionSettings,
      label: "Sample Frame",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.animalPurpose]: {
      field: FilterableField.animalPurpose,
      label: "Animal Purpose",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.animalImportedOrLocal]: {
      field: FilterableField.animalImportedOrLocal,
      label: "Imported or Local",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.scope]: {
      field: FilterableField.scope,
      label: "Scope of Study",
      valueToLabelMap: scopeToLabelForFilter,
      optionToColourClassnameMap: scopeColorsTailwind,
      optionSortingFunction: (optionA, optionB) => 
        (scopeToSortOrderMap[optionA] ?? 0) - (scopeToSortOrderMap[optionB] ?? 0),
      filterRenderingFunction: ColouredCheckboxFilter,
      clearAllButtonText: 'Clear all scopes'
    },
    [FilterableField.sourceType]: {
      field: FilterableField.sourceType,
      label: "Source Type",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.antibodies]: {
      field: FilterableField.antibodies,
      label: "Antibodies",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.antigen]: {
      field: FilterableField.antigen,
      label: "Antigen(s) / Gene(s)",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.exposureToCamels]: {
      field: FilterableField.exposureToCamels,
      label: "Exposure Level To Camels",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.testType]: {
      field: FilterableField.testType,
      label: "Test Type",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.isotypes]: {
      field: FilterableField.isotypes,
      label: "Isotype",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.pediatricAgeGroup]: {
      field: FilterableField.pediatricAgeGroup,
      label: "Pediatric Age Group",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.sex]: {
      field: FilterableField.sex,
      label: "Sex",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.sampleFrame]: {
      field: FilterableField.sampleFrame,
      label: "Sample Frame",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.sampleFrames]: {
      field: FilterableField.sampleFrames,
      label: "Sample Frame",
      valueToLabelMap: {},
      optionToSuperOptionFunction: (option: string) =>
        getMacroSampleFramesForSampleFrame(option).at(0) ?? MersMacroSampleFrameType.UNCATEGORIZED,
      superOptionSortingFunction: (mersMacroSampleFrameA, mersMacroSampleFrameB) => mersMacroSampleFrameA > mersMacroSampleFrameB
        ? 1
        : -1,
      superOptionToLabelMap: (superOption: string) => isMersMacroSampleFrameType(superOption)
        ? mersMacroSampleFrameTypeToTextMap[superOption]
        : 'Uncategorized',
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.assay]: {
      field: FilterableField.assay,
      label: "Assay",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.mersAssay]: {
      field: FilterableField.mersAssay,
      label: "Assay",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter,
      optionToSuperOptionFunction: (option: string) =>
        getAssayClassificationsForAssay(option).at(0) ?? MersAssayClassification.UNCATEGORIZED,
      superOptionSortingFunction: (assayClassificationA, assayClassificationB) => assayClassificationA > assayClassificationB
        ? -1
        : 1,
      superOptionToLabelMap: (superOption: string) => isMersAssayClassification(superOption)
        ? mersAssayClassificationToTextMap[superOption]
        : 'Uncategorized',
    },
    [FilterableField.producer]: {
      field: FilterableField.producer,
      label: "Assay Producer",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.antibody]: {
      field: FilterableField.antibody,
      label: "Antibody",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.serotype]: {
      field: FilterableField.serotype,
      label: "Serotype (DENV only)",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.populationGroup]: {
      field: FilterableField.populationGroup,
      label: "Population group",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.__typename]: {
      field: FilterableField.__typename,
      label: "Data Type",
      valueToLabelMap: mersDataTypeToLabelMap,
      optionToColourClassnameMap: mersDataTypeToColourClassnameMapForCheckbox,
      optionSortingFunction: (optionA, optionB) => 
        (mersDataTypeToSortOrderMap[optionA] ?? 0) - (mersDataTypeToSortOrderMap[optionB] ?? 0),
      optionToSuperOptionFunction: (typename) => isMersDataType(typename) ? mersDataTypeToSuperOptionMap[typename] : typename,
      superOptionToLabelMap: (superOption) => isMersDataTypeSuperOption(superOption) ? mersDataTypeSuperOptionToLabelMap[superOption] : superOption,
      filterRenderingFunction: GroupedColouredCheckboxFilter,
      hiddenOptions: mersMapPointVisibilitySettingToHiddenOptionsMap[mapDataPointVisibilitySetting],
      clearAllButtonText: 'Clear all data types'
    },
    [FilterableField.diagnosisSource]: {
      field: FilterableField.diagnosisSource,
      label: "Diagnosis Source",
      valueToLabelMap: diagnosisSourceToStringMap,
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.animalType]: {
      field: FilterableField.animalType,
      label: areNonCamelAnimalsIncluded
        ? "Animal Type"
        : "Camel Type",
      valueToLabelMap: animalTypeToStringMap,
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.animalSpecies]: {
      field: FilterableField.animalSpecies,
      label: "Animal Species",
      valueToLabelMap: animalSpeciesToStringMap,
      optionToSuperOptionFunction: (option: string) => isMersAnimalSpecies(option)
        ? mersAnimalSpeciesToAnimalSpeciesGroupMap[option]
        : MersAnimalSpeciesGroup.UNCATEGORIZED,
      superOptionSortingFunction: (superOptionA, superOptionB) => {
        const valueForOptionA = isMersAnimalSpeciesGroup(superOptionA)
          ? mersAnimalSpeciesGroupToSortOrderMap[superOptionA]
          : mersAnimalSpeciesGroupToSortOrderMap[MersAnimalSpeciesGroup.UNCATEGORIZED];
        const valueForOptionB = isMersAnimalSpeciesGroup(superOptionB)
          ? mersAnimalSpeciesGroupToSortOrderMap[superOptionB]
          : mersAnimalSpeciesGroupToSortOrderMap[MersAnimalSpeciesGroup.UNCATEGORIZED];

        return valueForOptionA - valueForOptionB;
      },
      superOptionToLabelMap: (superOption: string) => isMersAnimalSpeciesGroup(superOption)
        ? mersAnimalSpeciesGroupToLabelMap[superOption]
        : mersAnimalSpeciesGroupToLabelMap[MersAnimalSpeciesGroup.UNCATEGORIZED],
      filterRenderingFunction: MultiSelectFilter
    },
    positivePrevalence: {
      field: FilterableField.positivePrevalence,
      label: "Positive Prevalence",
      valueToLabelMap: {
        [PositivePrevalenceFilterOptions.SOME_POSITIVE_PREVALANCE_ONLY]: 'Estimates with some positive prevalence only',
        [PositivePrevalenceFilterOptions.NO_POSITIVE_PREVALANCE_ONLY]: 'Estimates with no positive prevalence only'
      },
      filterRenderingFunction: SingleSelectFilter
    }
  }

  return {
    availableFilters
  }
}