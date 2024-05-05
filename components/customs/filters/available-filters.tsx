import { PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { ArbovirusEstimate } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";
import { DateFilter } from "./date-filter";
import { MultiSelectFilter } from "./multi-select-filter";
import { unRegionEnumToLabelMap } from "@/lib/un-regions";
import { SingleSelectFilter } from "./single-select-filter";
import Link from "next/link";
import { useMemo } from "react";
import { MapArbovirusFilter } from "@/app/pathogen/arbovirus/dashboard/(map)/MapArbovirusFilter";
import { SendFilterChangeDispatch } from "../filters";

export interface FieldInformation {
  field: FilterableField;
  label: string;
  valueToLabelMap: Record<string, string | undefined>;
  renderTooltipContent?: TooltipContentRenderingFunction
  filterRenderingFunction: FilterRenderingFunction;
}

interface RenderTooltipContentInput {
  state: PathogenContextType<ArbovirusEstimate>;
}

export type TooltipContentRenderingFunction = ((input: RenderTooltipContentInput) => React.ReactNode);

interface FilterRenderingFunctionInput {
  filter: string;
  placeholder: string;
  state: PathogenContextType<ArbovirusEstimate>;
  filterOptions: string[];
  data: any;
  optionToLabelMap: Record<string, string | undefined>;
  renderTooltipContent: TooltipContentRenderingFunction | undefined;
  sendFilterChangeDispatch: SendFilterChangeDispatch;
}

type FilterRenderingFunction = (input: FilterRenderingFunctionInput) => React.ReactNode;

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
  serotype = "serotype"
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
  [FilterableField.assay]: {field: FilterableField.assay, label: "Assay", valueToLabelMap: {}, filterRenderingFunction: MultiSelectFilter},
  [FilterableField.producer]: {field: FilterableField.producer, label: "Assay Producer", valueToLabelMap: {}, filterRenderingFunction: MultiSelectFilter},
  [FilterableField.antibody]: {field: FilterableField.antibody, label: "Antibody", valueToLabelMap: {}, filterRenderingFunction: MultiSelectFilter},
  [FilterableField.serotype]: {field: FilterableField.serotype, label: "Serotype (DENV only)", valueToLabelMap: {}, filterRenderingFunction: MultiSelectFilter}
}