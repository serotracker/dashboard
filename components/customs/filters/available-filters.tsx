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
import { Arbovirus } from "@/gql/graphql";
import { arboShortformToFullNamePlusVirusMap } from "@/app/pathogen/arbovirus/dashboard/(visualizations)/recharts";
import { ColouredCheckboxFilter } from "./coloured-checkbox-filter";
import { animalSpeciesToStringMap, animalTypeToStringMap, diagnosisSourceToStringMap, isMersDataType, isMersDataTypeSuperOption, mersDataTypeSuperOptionToLabelMap, mersDataTypeToColourClassnameMapForCheckbox, mersDataTypeToLabelMap, mersDataTypeToSortOrderMap, mersDataTypeToSuperOptionMap, mersMapPointVisibilitySettingToHiddenOptionsMap } from "@/app/pathogen/mers/dashboard/(map)/shared-mers-map-pop-up-variables";
import { UNRegionsTooltip, WHORegionsTooltip } from "../tooltip-content";
import { GroupedColouredCheckboxFilter } from "./grouped-coloured-checkbox-filter";
import { MersMapCustomizationsContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/map-customizations-context";

export interface FieldInformation {
  field: FilterableField;
  label: string;
  valueToLabelMap: Record<string, string | undefined>;
  optionToColourClassnameMap?: Record<string, string | undefined>;
  optionSortingFunction?: (a: string, b:string) => number;
  optionToSuperOptionFunction?: (option: string) => string;
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
  samplingMethod = "samplingMethod",
  geographicScope = "geographicScope",
  testProducer = "testProducer",
  testValidation = "testValidation",
  animalDetectionSettings = "animalDetectionSettings",
  animalPurpose = "animalPurpose",
  animalImportedOrLocal = "animalImportedOrLocal",
  esm = "esm",
  whoRegion = "whoRegion",
  unRegion = "unRegion",
  countryAlphaTwoCode = "countryAlphaTwoCode",
  assay = "assay",
  producer = "producer",
  sampleFrame = "sampleFrame",
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
  clade = "clade"
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

export const filterArbovirusToSortOrderMap: Record<Arbovirus, number> & Record<string, number | undefined> = {
  [Arbovirus.Zikv]: 1,
  [Arbovirus.Denv]: 2,
  [Arbovirus.Chikv]: 3,
  [Arbovirus.Yf]: 4,
  [Arbovirus.Wnv]: 5,
  [Arbovirus.Mayv]: 6,
}

const pathogenColorsTailwind: { [key in Arbovirus]: string } = {
  [Arbovirus.Zikv]: "data-[state=checked]:bg-zikv",
  [Arbovirus.Chikv]: "data-[state=checked]:bg-chikv",
  [Arbovirus.Wnv]: "data-[state=checked]:bg-wnv",
  [Arbovirus.Denv]: "data-[state=checked]:bg-denv",
  [Arbovirus.Yf]: "data-[state=checked]:bg-yf",
  [Arbovirus.Mayv]: "data-[state=checked]:bg-mayv",
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
  const {
    mapDataPointVisibilitySetting,
    setMapDataPointVisibilitySetting
  } = useContext(MersMapCustomizationsContext);

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
      label: "Country",
      valueToLabelMap: countryAlphaTwoCodeToCountryNameMap,
      filterRenderingFunction: MultiSelectFilter
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
    [FilterableField.assay]: {
      field: FilterableField.assay,
      label: "Assay",
      valueToLabelMap: {},
      filterRenderingFunction: MultiSelectFilter
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
      label: "Animal Type",
      valueToLabelMap: animalTypeToStringMap,
      filterRenderingFunction: MultiSelectFilter
    },
    [FilterableField.animalSpecies]: {
      field: FilterableField.animalSpecies,
      label: "Animal Species",
      valueToLabelMap: animalSpeciesToStringMap,
      filterRenderingFunction: MultiSelectFilter
    },
  }

  return {
    availableFilters
  }
}