"use client";
import { useContext, useMemo } from "react";
import { VisualizationDisplayNameType, VisualizationInformation } from "../../generic-pathogen-visualizations-page";
import { typedObjectEntries } from "@/lib/utils";
import { GetUrlParameterFromVisualizationIdFunction } from '@/components/customs/visualizations/visualization-header';
import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { ReportedEventSummaryOverTime } from "../dashboard/(visualizations)/reported-event-summary-over-time";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { CamelPopulationOverTime } from "../dashboard/(visualizations)/camel-population-over-time";
import { MedianSeroprevalenceOverTime } from "../dashboard/(visualizations)/median-seroprevalence-over-time";
import { useSummaryByRegionVisualizationPageConfig } from "./visualization-page-config/use-summary-by-region-visualization-page-config";
import { MedianViralPositivePrevalenceOverTime } from "../dashboard/(visualizations)/median-viral-positive-prevalence-over-time";
import { useEstimatesByRegionVisualizationPageConfig } from "./visualization-page-config/use-estimates-by-region-visualization-page-config";
import { useEstimateBreakdownTableAndFieldPageConfig } from "./visualization-page-config/use-estimate-summary-by-who-region-and-field-page-config";
import { MersFilterMetadataContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-filter-metadata-context";

export enum MersVisualizationId {
  REPORTED_EVENT_SUMMARY_OVER_TIME = "REPORTED_EVENT_SUMMARY_OVER_TIME",
  CAMEL_POPULATION_OVER_TIME = "CAMEL_POPULATION_OVER_TIME",
  MEDIAN_SEROPREVALENCE_OVER_TIME = "MEDIAN_SEROPREVALENCE_OVER_TIME",
  MEDIAN_VIRAL_PREVALENCE_OVER_TIME = "MEDIAN_VIRAL_PREVALENCE_OVER_TIME",
  SUMMARY_BY_REGION = "SUMMARY_BY_REGION",
  ESTIMATES_BY_REGION = "ESTIMATES_BY_REGION",
  ESTIMATE_BREAKDOWN_TABLE = "ESTIMATE_BREAKDOWN_TABLE",
}

export const isMersVisualizationId = (
  visualizationId: string
): visualizationId is MersVisualizationId =>
  Object.values(MersVisualizationId).some((element) => element === visualizationId);

export enum MersVisualizationUrlParameter {
  "reported_event_summary_over_time" = "reported_event_summary_over_time",
  "camel_population_over_time" = "camel_population_over_time",
  "median_seroprevalence_over_time" = "median_seroprevalence_over_time",
  "median_viral_prevalence_over_time" = "median_viral_prevalence_over_time",
  "summary_by_region" = "summary_by_region",
  "estimates_by_region" = "estimates_by_region",
  "estimate_breakdown_table" = "estimate_breakdown_table"
}

export type MersVisualizationInformation<
  TCustomizationModalDropdownOption extends string,
  TVisualizationDisplayNameDropdownOption extends string,
  TSecondVisualizationDisplayNameDropdownOption extends string,
  TThirdVisualizationDisplayNameDropdownOption extends string,
  TFourthVisualizationDisplayNameDropdownOption extends string
> = VisualizationInformation<
  MersVisualizationId,
  MersVisualizationUrlParameter,
  MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry,
  TCustomizationModalDropdownOption,
  TVisualizationDisplayNameDropdownOption,
  TSecondVisualizationDisplayNameDropdownOption,
  TThirdVisualizationDisplayNameDropdownOption,
  TFourthVisualizationDisplayNameDropdownOption
>

export const isMersVisualizationUrlParameter = (
  visualizationUrlParameter: string
): visualizationUrlParameter is MersVisualizationUrlParameter =>
  Object.values(MersVisualizationUrlParameter).some((element) => element === visualizationUrlParameter);

const mersVisualizationInformation: Record<MersVisualizationId, MersVisualizationInformation<string, string, string, string, string>> = {
  [MersVisualizationId.REPORTED_EVENT_SUMMARY_OVER_TIME]: {
    id: MersVisualizationId.REPORTED_EVENT_SUMMARY_OVER_TIME,
    urlParameter:
      MersVisualizationUrlParameter[
        "reported_event_summary_over_time"
      ],
    getDisplayName: () => ({ type: VisualizationDisplayNameType.STANDARD, displayName: "Reported MERS Cases Over Time" }),
    renderVisualization: ({ data }) => <ReportedEventSummaryOverTime data={data} />,
    visualizationDownloadFootnote: undefined,
    visualizationNonDownloadFootnote: undefined
  },
  [MersVisualizationId.CAMEL_POPULATION_OVER_TIME]: {
    id: MersVisualizationId.CAMEL_POPULATION_OVER_TIME,
    urlParameter:
      MersVisualizationUrlParameter[
        "camel_population_over_time"
      ],
    getDisplayName: () => ({ type: VisualizationDisplayNameType.STANDARD, displayName: "Camel Population Over Time" }),
    renderVisualization: ({ data }) => <CamelPopulationOverTime data={data} />,
    visualizationDownloadFootnote: undefined,
    visualizationNonDownloadFootnote: undefined
  },
  [MersVisualizationId.MEDIAN_SEROPREVALENCE_OVER_TIME]: {
    id: MersVisualizationId.MEDIAN_SEROPREVALENCE_OVER_TIME,
    urlParameter:
      MersVisualizationUrlParameter[
        "median_seroprevalence_over_time"
      ],
    getDisplayName: () => ({ type: VisualizationDisplayNameType.STANDARD, displayName: "Median Seroprevalence Over Time" }),
    renderVisualization: ({ data }) => <MedianSeroprevalenceOverTime data={data} />,
    visualizationDownloadFootnote: undefined,
    visualizationNonDownloadFootnote: undefined
  },
  [MersVisualizationId.MEDIAN_VIRAL_PREVALENCE_OVER_TIME]: {
    id: MersVisualizationId.MEDIAN_VIRAL_PREVALENCE_OVER_TIME,
    urlParameter:
      MersVisualizationUrlParameter[
        "median_viral_prevalence_over_time"
      ],
    getDisplayName: () => ({ type: VisualizationDisplayNameType.STANDARD, displayName: "Median Viral Prevalenc eOver Time" }),
    renderVisualization: ({ data }) => <MedianViralPositivePrevalenceOverTime data={data} />,
    visualizationDownloadFootnote: undefined,
    visualizationNonDownloadFootnote: undefined
  },
  [MersVisualizationId.SUMMARY_BY_REGION]: {
    id: MersVisualizationId.SUMMARY_BY_REGION,
    urlParameter:
      MersVisualizationUrlParameter[
        "summary_by_region"
      ],
    getDisplayName: () => ({
      type: VisualizationDisplayNameType.STANDARD,
      displayName: "Requires state. Initialized in following step."
    }),
    titleTooltipContent: <p> Requires state. Initialized in following step. </p>,
    renderVisualization: () => <p> Requires state. Initialized in following step. </p>,
    visualizationDownloadFootnote: undefined,
    visualizationNonDownloadFootnote: 'Requires state. Initialized in following step.'
  },
  [MersVisualizationId.ESTIMATES_BY_REGION]: {
    id: MersVisualizationId.ESTIMATES_BY_REGION,
    urlParameter:
      MersVisualizationUrlParameter[
        "estimates_by_region"
      ],
    getDisplayName: () => ({
      type: VisualizationDisplayNameType.STANDARD,
      displayName: "Requires state. Initialized in following step."
    }),
    titleTooltipContent: <p> Requires state. Initialized in following step. </p>,
    renderVisualization: () => <p> Requires state. Initialized in following step. </p>,
    visualizationDownloadFootnote: undefined,
    visualizationNonDownloadFootnote: 'Requires state. Initialized in following step.'
  },
  [MersVisualizationId.ESTIMATE_BREAKDOWN_TABLE]: {
    id: MersVisualizationId.ESTIMATE_BREAKDOWN_TABLE,
    urlParameter:
      MersVisualizationUrlParameter[
        "estimate_breakdown_table"
      ],
    getDisplayName: () => ({
      type: VisualizationDisplayNameType.STANDARD,
      displayName: "Requires state. Initialized in following step."
    }),
    titleTooltipContent: <p> Requires state. Initialized in following step. </p>,
    renderVisualization: () => <p> Requires state. Initialized in following step. </p>,
    visualizationDownloadFootnote: undefined,
    visualizationNonDownloadFootnote: undefined
  }
}

export const useVisualizationPageConfiguration = () => {
  const { visualizationDownloadFootnote } = useContext(MersFilterMetadataContext)
  const {
    getDisplayNameForSummaryByWhoRegion,
    renderVisualizationForSummaryByWhoRegion,
    customizationModalConfigurationForSummaryByRegion,
    summaryByWhoRegionTitleTooltipContent,
    numberOfPagesAvailable,
    currentPageIndex,
    setCurrentPageIndex,
    visualizationFootnote: summaryByRegionVisualizationFootnote
  } = useSummaryByRegionVisualizationPageConfig();

  const {
    getDisplayNameForEstimatesByRegion,
    renderVisualizationForEstimatesByRegion,
    customizationModalConfigurationForEstimatesByRegion,
    estimatesByRegionTitleTooltipContent,
    visualizationFootnote: estimatesByRegionVisualizationFootnote
  } = useEstimatesByRegionVisualizationPageConfig();

  const {
    getDisplayNameForEstimateBreakdownTableAndField,
    estimateBreakdownTableAndFieldTooltipContent,
    renderVisualizationForEstimateBreakdownTableAndField
  } = useEstimateBreakdownTableAndFieldPageConfig();

  const completedMersVisualizationInformation = useMemo(() => ({
    [MersVisualizationId.REPORTED_EVENT_SUMMARY_OVER_TIME]:
      mersVisualizationInformation[MersVisualizationId.REPORTED_EVENT_SUMMARY_OVER_TIME],
    [MersVisualizationId.CAMEL_POPULATION_OVER_TIME]:
      mersVisualizationInformation[MersVisualizationId.CAMEL_POPULATION_OVER_TIME],
    [MersVisualizationId.MEDIAN_SEROPREVALENCE_OVER_TIME]:
      mersVisualizationInformation[MersVisualizationId.MEDIAN_SEROPREVALENCE_OVER_TIME],
    [MersVisualizationId.MEDIAN_VIRAL_PREVALENCE_OVER_TIME]:
      mersVisualizationInformation[MersVisualizationId.MEDIAN_VIRAL_PREVALENCE_OVER_TIME],
    [MersVisualizationId.SUMMARY_BY_REGION]: {
      ...mersVisualizationInformation[MersVisualizationId.SUMMARY_BY_REGION],
      getDisplayName: getDisplayNameForSummaryByWhoRegion,
      renderVisualization: renderVisualizationForSummaryByWhoRegion,
      customizationModalConfiguration: customizationModalConfigurationForSummaryByRegion,
      titleTooltipContent: summaryByWhoRegionTitleTooltipContent,
      paginationConfiguration: {
        numberOfPagesAvailable,
        currentPageIndex,
        setCurrentPageIndex
      },
      visualizationNonDownloadFootnote: summaryByRegionVisualizationFootnote,
      visualizationDownloadFootnote: visualizationDownloadFootnote
    },
    [MersVisualizationId.ESTIMATES_BY_REGION]: {
      ...mersVisualizationInformation[MersVisualizationId.ESTIMATES_BY_REGION],
      getDisplayName: getDisplayNameForEstimatesByRegion,
      renderVisualization: renderVisualizationForEstimatesByRegion,
      customizationModalConfiguration: customizationModalConfigurationForEstimatesByRegion,
      titleTooltipContent: estimatesByRegionTitleTooltipContent,
      visualizationNonDownloadFootnote: estimatesByRegionVisualizationFootnote,
      visualizationDownloadFootnote: visualizationDownloadFootnote
    },
    [MersVisualizationId.ESTIMATE_BREAKDOWN_TABLE]: {
      ...mersVisualizationInformation[MersVisualizationId.ESTIMATE_BREAKDOWN_TABLE],
      getDisplayName: getDisplayNameForEstimateBreakdownTableAndField,
      renderVisualization: renderVisualizationForEstimateBreakdownTableAndField,
      titleTooltipContent: estimateBreakdownTableAndFieldTooltipContent,
    }
  }), [
    getDisplayNameForEstimatesByRegion,
    renderVisualizationForEstimatesByRegion,
    estimatesByRegionTitleTooltipContent,
    getDisplayNameForSummaryByWhoRegion,
    renderVisualizationForSummaryByWhoRegion,
    summaryByWhoRegionTitleTooltipContent,
    customizationModalConfigurationForSummaryByRegion,
    customizationModalConfigurationForEstimatesByRegion,
    numberOfPagesAvailable,
    currentPageIndex,
    setCurrentPageIndex,
    getDisplayNameForEstimateBreakdownTableAndField,
    renderVisualizationForEstimateBreakdownTableAndField,
    estimateBreakdownTableAndFieldTooltipContent,
    summaryByRegionVisualizationFootnote,
    estimatesByRegionVisualizationFootnote,
    visualizationDownloadFootnote
  ])

  return {
    mersVisualizationInformation: completedMersVisualizationInformation,
    mersVisualizationInformationArray: typedObjectEntries(completedMersVisualizationInformation).map(([_, value]) => value)
  }
}

export const getUrlParameterFromVisualizationId: GetUrlParameterFromVisualizationIdFunction<
  MersVisualizationId,
  MersVisualizationUrlParameter
> = ({ visualizationId }) => ({urlParameter: mersVisualizationInformation[visualizationId].urlParameter})
