
"use client";
import { VisualizationDisplayNameType, VisualizationInformation } from "../../generic-pathogen-visualizations-page";
import { typedObjectEntries } from "@/lib/utils";
import { GetUrlParameterFromVisualizationIdFunction } from '@/components/customs/visualizations/visualization-header';
import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { ReportedEventSummaryOverTime } from "../dashboard/(visualizations)/reported-event-summary-over-time";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { CamelPopulationOverTime } from "../dashboard/(visualizations)/camel-population-over-time";
import { MedianSeroprevalenceOverTime } from "../dashboard/(visualizations)/median-seroprevalence-over-time";
import { SummaryByRegion, SummaryByRegionRegionDropdownOption, SummaryByRegionVariableOfInterestDropdownOption } from "../dashboard/(visualizations)/summary-by-region";
import { useCallback, useMemo, useState } from "react";
import { UNRegionsTooltip, WHORegionsTooltip } from "@/components/customs/tooltip-content";
import { WhoRegion } from "@/gql/graphql";
import assertNever from "assert-never";

export enum MersVisualizationId {
  REPORTED_EVENT_SUMMARY_OVER_TIME = "REPORTED_EVENT_SUMMARY_OVER_TIME",
  CAMEL_POPULATION_OVER_TIME = "CAMEL_POPULATION_OVER_TIME",
  MEDIAN_SEROPREVALENCE_OVER_TIME = "MEDIAN_SEROPREVALENCE_OVER_TIME",
  SUMMARY_BY_WHO_REGION = "SUMMARY_BY_WHO_REGION"
}

export const isMersVisualizationId = (
  visualizationId: string
): visualizationId is MersVisualizationId =>
  Object.values(MersVisualizationId).some((element) => element === visualizationId);

export enum MersVisualizationUrlParameter {
  "reported_event_summary_over_time" = "reported_event_summary_over_time",
  "camel_population_over_time" = "camel_population_over_time",
  "median_seroprevalence_over_time" = "median_seroprevalence_over_time",
  "summary_by_who_region" = "summary_by_who_region"
}

export type MersVisualizationInformation<
  TCustomizationModalDropdownOption extends string,
  TVisualizationDisplayNameDropdownOption extends string,
  TSecondVisualizationDisplayNameDropdownOption extends string
> = VisualizationInformation<
  MersVisualizationId,
  MersVisualizationUrlParameter,
  MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry,
  TCustomizationModalDropdownOption,
  TVisualizationDisplayNameDropdownOption,
  TSecondVisualizationDisplayNameDropdownOption
>

export const isMersVisualizationUrlParameter = (
  visualizationUrlParameter: string
): visualizationUrlParameter is MersVisualizationUrlParameter =>
  Object.values(MersVisualizationUrlParameter).some((element) => element === visualizationUrlParameter);

const mersVisualizationInformation: Record<MersVisualizationId, MersVisualizationInformation<string, string, string>> = {
  [MersVisualizationId.REPORTED_EVENT_SUMMARY_OVER_TIME]: {
    id: MersVisualizationId.REPORTED_EVENT_SUMMARY_OVER_TIME,
    urlParameter:
      MersVisualizationUrlParameter[
        "reported_event_summary_over_time"
      ],
    getDisplayName: () => ({ type: VisualizationDisplayNameType.STANDARD, displayName: "Reported MERS Cases Over Time" }),
    renderVisualization: ({ data }) => <ReportedEventSummaryOverTime data={data} />
  },
  [MersVisualizationId.CAMEL_POPULATION_OVER_TIME]: {
    id: MersVisualizationId.CAMEL_POPULATION_OVER_TIME,
    urlParameter:
      MersVisualizationUrlParameter[
        "camel_population_over_time"
      ],
    getDisplayName: () => ({ type: VisualizationDisplayNameType.STANDARD, displayName: "Camel Population Over Time" }),
    renderVisualization: ({ data }) => <CamelPopulationOverTime data={data} />
  },
  [MersVisualizationId.MEDIAN_SEROPREVALENCE_OVER_TIME]: {
    id: MersVisualizationId.MEDIAN_SEROPREVALENCE_OVER_TIME,
    urlParameter:
      MersVisualizationUrlParameter[
        "median_seroprevalence_over_time"
      ],
    getDisplayName: () => ({ type: VisualizationDisplayNameType.STANDARD, displayName: "Median Seroprevalence Over Time" }),
    renderVisualization: ({ data }) => <MedianSeroprevalenceOverTime data={data} />
  },
  [MersVisualizationId.SUMMARY_BY_WHO_REGION]: {
    id: MersVisualizationId.SUMMARY_BY_WHO_REGION,
    urlParameter:
      MersVisualizationUrlParameter[
        "summary_by_who_region"
      ],
    getDisplayName: () => ({
      type: VisualizationDisplayNameType.STANDARD,
      displayName: "Requires state. Initialized in following step."
    }),
    titleTooltipContent: <p> Requires state. Initialized in following step. </p>,
    renderVisualization: () => <p> Requires state. Initialized in following step. </p>
  }
}

export const useVisualizationPageConfiguration = () => {
  const [
    summaryByRegionVariableOfInterestSelectedDropdownOption,
    setSummaryByRegionVariableOfInterestSelectedDropdownOption,
  ] = useState<SummaryByRegionVariableOfInterestDropdownOption>(SummaryByRegionVariableOfInterestDropdownOption.MEDIAN_SEROPREVALENCE);

  const [
    summaryByRegionSelectedDropdownOption,
    setSummaryByRegionSelectedDropdownOption,
  ] = useState<SummaryByRegionRegionDropdownOption>(SummaryByRegionRegionDropdownOption.WHO_REGION);

  const getDisplayNameForSummaryByWhoRegion: MersVisualizationInformation<
    string,
    SummaryByRegionVariableOfInterestDropdownOption,
    SummaryByRegionRegionDropdownOption
  >['getDisplayName'] = useCallback(() => ({
    type: VisualizationDisplayNameType.WITH_DOUBLE_DROPDOWN,
    beforeBothDropdownsHeaderText: "",
    firstDropdownProps: {
      dropdownName: 'Variable of Interest Selection',
      borderColourClassname: 'border-mers',
      hoverColourClassname: 'hover:bg-mersHover/50',
      highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
      dropdownOptionGroups: [{
        groupHeader: 'Seroprevalence Estimates',
        options: [
          SummaryByRegionVariableOfInterestDropdownOption.MEDIAN_SEROPREVALENCE
        ]
      }, {
        groupHeader: 'Cases and Deaths',
        options: [
          SummaryByRegionVariableOfInterestDropdownOption.MERS_ANIMAL_CASES,
          SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_CASES,
          SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_DEATHS,
        ]
      }],
      chosenDropdownOption: summaryByRegionVariableOfInterestSelectedDropdownOption,
      dropdownOptionToLabelMap: {
        [SummaryByRegionVariableOfInterestDropdownOption.MEDIAN_SEROPREVALENCE]: "Median Seroprevalence",
        [SummaryByRegionVariableOfInterestDropdownOption.MERS_ANIMAL_CASES]: "Confirmed Animal Cases",
        [SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_CASES]: "Confirmed Human Cases",
        [SummaryByRegionVariableOfInterestDropdownOption.MERS_HUMAN_DEATHS]: "Confirmed Human Deaths"
      },
      onDropdownOptionChange: (option) => setSummaryByRegionVariableOfInterestSelectedDropdownOption(option)
    },
    betweenDropdownsHeaderText: " By ",
    secondDropdownProps: {
      dropdownName: 'Region Selection',
      borderColourClassname: 'border-mers',
      hoverColourClassname: 'hover:bg-mersHover/50',
      highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
      dropdownOptionGroups: [{
        groupHeader: 'Regions',
        options: [
          SummaryByRegionRegionDropdownOption.WHO_REGION,
          SummaryByRegionRegionDropdownOption.UN_REGION,
        ]
      }],
      chosenDropdownOption: summaryByRegionSelectedDropdownOption,
      dropdownOptionToLabelMap: {
        [SummaryByRegionRegionDropdownOption.WHO_REGION]: "WHO Region",
        [SummaryByRegionRegionDropdownOption.UN_REGION]: "UN Region"
      },
      onDropdownOptionChange: (option) => setSummaryByRegionSelectedDropdownOption(option)
    },
    afterBothDropdownsHeaderText: " Over Time"
  }), [ summaryByRegionVariableOfInterestSelectedDropdownOption, setSummaryByRegionVariableOfInterestSelectedDropdownOption, summaryByRegionSelectedDropdownOption, setSummaryByRegionSelectedDropdownOption ])

  const renderVisualizationForSummaryByWhoRegion: MersVisualizationInformation<
    string, SummaryByRegionVariableOfInterestDropdownOption, SummaryByRegionRegionDropdownOption
  >['renderVisualization'] = useCallback(({ data }) => (
    <SummaryByRegion
      data={data}
      selectedVariableOfInterest={summaryByRegionVariableOfInterestSelectedDropdownOption}
      selectedRegion={summaryByRegionSelectedDropdownOption}
    />
  ), [ summaryByRegionVariableOfInterestSelectedDropdownOption, summaryByRegionSelectedDropdownOption ]);

  const summaryByWhoRegionTitleTooltipContent: MersVisualizationInformation<
    string, SummaryByRegionVariableOfInterestDropdownOption, SummaryByRegionRegionDropdownOption
  >['titleTooltipContent'] = useMemo(() => {
    if(summaryByRegionSelectedDropdownOption === SummaryByRegionRegionDropdownOption.WHO_REGION) {
      return <WHORegionsTooltip />
    }

    if(summaryByRegionSelectedDropdownOption === SummaryByRegionRegionDropdownOption.UN_REGION) {
      return <UNRegionsTooltip />
    }

    assertNever(summaryByRegionSelectedDropdownOption);
  }, [ summaryByRegionSelectedDropdownOption ]);

  const completedMersVisualizationInformation = useMemo(() => ({
    [MersVisualizationId.REPORTED_EVENT_SUMMARY_OVER_TIME]:
      mersVisualizationInformation[MersVisualizationId.REPORTED_EVENT_SUMMARY_OVER_TIME],
    [MersVisualizationId.CAMEL_POPULATION_OVER_TIME]:
      mersVisualizationInformation[MersVisualizationId.CAMEL_POPULATION_OVER_TIME],
    [MersVisualizationId.MEDIAN_SEROPREVALENCE_OVER_TIME]:
      mersVisualizationInformation[MersVisualizationId.MEDIAN_SEROPREVALENCE_OVER_TIME],
    [MersVisualizationId.SUMMARY_BY_WHO_REGION]: {
      ...mersVisualizationInformation[MersVisualizationId.SUMMARY_BY_WHO_REGION],
      getDisplayName: getDisplayNameForSummaryByWhoRegion,
      renderVisualization: renderVisualizationForSummaryByWhoRegion,
      titleTooltipContent: summaryByWhoRegionTitleTooltipContent,
    }
  }), [ getDisplayNameForSummaryByWhoRegion, renderVisualizationForSummaryByWhoRegion, summaryByWhoRegionTitleTooltipContent ])

  return {
    mersVisualizationInformation: completedMersVisualizationInformation,
    mersVisualizationInformationArray: typedObjectEntries(completedMersVisualizationInformation).map(([_, value]) => value)
  }
}

export const getUrlParameterFromVisualizationId: GetUrlParameterFromVisualizationIdFunction<
  MersVisualizationId,
  MersVisualizationUrlParameter
> = ({ visualizationId }) => ({urlParameter: mersVisualizationInformation[visualizationId].urlParameter})
