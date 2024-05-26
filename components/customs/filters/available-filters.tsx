import { PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { DateFilter } from "./date-filter";
import { MultiSelectFilter } from "./multi-select-filter";
import { unRegionEnumToLabelMap } from "@/lib/un-regions";
import { SingleSelectFilter } from "./single-select-filter";
import Link from "next/link";
import { useMemo } from "react";
import { MapArbovirusFilter } from "@/app/pathogen/arbovirus/dashboard/(map)/MapArbovirusFilter";
import { SendFilterChangeDispatch } from "../filters";
import { BooleanSelectFilter } from "./boolean-select-filter";
import { BooleanSelectOptionString } from "./select-filter";

export interface FieldInformation {
  field: FilterableField;
  label: string;
  valueToLabelMap: Record<string, string | undefined>;
  renderTooltipContent?: TooltipContentRenderingFunction
  filterRenderingFunction: FilterRenderingFunction;
}

interface RenderTooltipContentInput<TEstimate extends Record<string, unknown>> {
  state: PathogenContextType<TEstimate>;
}

export type TooltipContentRenderingFunction = <TEstimate extends Record<string, unknown>>(input: RenderTooltipContentInput<TEstimate>) => React.ReactNode;

interface FilterRenderingFunctionInput<TEstimate extends Record<string, unknown>> {
  filter: string;
  placeholder: string;
  state: PathogenContextType<TEstimate>;
  filterOptions: string[];
  data: TEstimate[];
  optionToLabelMap: Record<string, string | undefined>;
  renderTooltipContent: TooltipContentRenderingFunction | undefined;
  sendFilterChangeDispatch: SendFilterChangeDispatch;
}

type FilterRenderingFunction = <TEstimate extends Record<string, unknown>>(input: FilterRenderingFunctionInput<TEstimate>) => React.ReactNode;

export enum FilterableField {
  ageGroup = "ageGroup",
  pediatricAgeGroup = "pediatricAgeGroup",
  sex = "sex",
  esm = "esm",
  whoRegion = "whoRegion",
  unRegion = "unRegion",
  country = "country",
  assay = "assay",
  producer = "producer",
  sampleFrame = "sampleFrame",
  antibody = "antibody",
  pathogen = "pathogen",
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
  isotypes = "isotypes"
}

const WhoRegionTooltip: TooltipContentRenderingFunction = (input) => (
  <div>
    <p> AFR: African Region </p>
    <p> AMR: Region of the Americas </p>
    <p> EMR: Eastern Mediterranean Region </p>
    <p> EUR: European Region </p>
    <p> SEAR: South-East Asia Region </p>
    <p> WPR: Western Pacific Region </p>
  </div>
)
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

export const availableFilters: {[key in FilterableField]: FieldInformation } = {
  [FilterableField.pathogen]: {
    field: FilterableField.pathogen,
    label: "Arbovirus",
    valueToLabelMap: {},
    filterRenderingFunction: MapArbovirusFilter
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
    renderTooltipContent: WhoRegionTooltip,
    filterRenderingFunction: MultiSelectFilter
  },
  [FilterableField.unRegion]: {
    field: FilterableField.unRegion,
    label: "UN Region",
    valueToLabelMap: unRegionEnumToLabelMap,
    filterRenderingFunction: MultiSelectFilter
  },
  [FilterableField.country]: {
    field: FilterableField.country,
    label: "Country",
    valueToLabelMap: {},
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
  [FilterableField.scope]: {
    field: FilterableField.scope,
    label: "Scope of Study",
    valueToLabelMap: {},
    filterRenderingFunction: MultiSelectFilter
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
  }
}