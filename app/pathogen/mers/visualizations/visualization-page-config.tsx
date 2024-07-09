
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
import { SummaryByWhoRegion, SummaryByWhoRegionDropdownOption } from "../dashboard/(visualizations)/summary-by-who-region";
import { useCallback, useState } from "react";
import { WHORegionsTooltip } from "@/components/customs/tooltip-content";

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
  TVisualizationDisplayNameDropdownOption extends string
> = VisualizationInformation<
  MersVisualizationId,
  MersVisualizationUrlParameter,
  MersEstimate | FaoMersEvent | FaoYearlyCamelPopulationDataEntry,
  TCustomizationModalDropdownOption,
  TVisualizationDisplayNameDropdownOption
>

export const isMersVisualizationUrlParameter = (
  visualizationUrlParameter: string
): visualizationUrlParameter is MersVisualizationUrlParameter =>
  Object.values(MersVisualizationUrlParameter).some((element) => element === visualizationUrlParameter);

const mersVisualizationInformation: Record<MersVisualizationId, MersVisualizationInformation<string, string>> = {
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
    titleTooltipContent: <WHORegionsTooltip />,
    renderVisualization: () => <p> Requires state. Initialized in following step. </p>
  }
}

export const useVisualizationPageConfiguration = () => {
  const [
    summaryByWhoRegionSelectedDropdownOption,
    setSummaryByWhoRegionSelectedDropdownOption,
  ] = useState<SummaryByWhoRegionDropdownOption>(SummaryByWhoRegionDropdownOption.SEROPREVALENCE_ESTIMATES);

  const getDisplayNameForSummaryByWhoRegion: MersVisualizationInformation<string, SummaryByWhoRegionDropdownOption>['getDisplayName'] = useCallback(() => ({
    type: VisualizationDisplayNameType.WITH_DROPDOWN,
    beforeDropdownHeaderText: "",
    afterDropdownHeaderText: " By WHO Region",
    dropdownProps: {
      dropdownName: 'Data Selection',
      borderColourClassname: 'border-mers',
      hoverColourClassname: 'hover:bg-mersHover/50',
      highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
      dropdownOptionGroups: [{
        groupHeader: 'Seroprevalence Estimates',
        options: [
          SummaryByWhoRegionDropdownOption.SEROPREVALENCE_ESTIMATES
        ]
      }, {
        groupHeader: 'Cases and Deaths',
        options: [
          SummaryByWhoRegionDropdownOption.MERS_ANIMAL_CASES,
          SummaryByWhoRegionDropdownOption.MERS_HUMAN_CASES,
          SummaryByWhoRegionDropdownOption.MERS_HUMAN_DEATHS,
        ]
      }],
      chosenDropdownOption: summaryByWhoRegionSelectedDropdownOption,
      dropdownOptionToLabelMap: {
        [SummaryByWhoRegionDropdownOption.SEROPREVALENCE_ESTIMATES]: "Seroprevalence Estimates",
        [SummaryByWhoRegionDropdownOption.MERS_ANIMAL_CASES]: "Confirmed Animal Cases",
        [SummaryByWhoRegionDropdownOption.MERS_HUMAN_CASES]: "Confirmed Human Cases",
        [SummaryByWhoRegionDropdownOption.MERS_HUMAN_DEATHS]: "Confirmed Human Deaths"
      },
      onDropdownOptionChange: (option) => setSummaryByWhoRegionSelectedDropdownOption(option)
    }
  }), [ summaryByWhoRegionSelectedDropdownOption, setSummaryByWhoRegionSelectedDropdownOption ])

  const renderVisualizationForSummaryByWhoRegion: MersVisualizationInformation<
    string, SummaryByWhoRegionDropdownOption
  >['renderVisualization'] = useCallback(({ data }) => (
    <SummaryByWhoRegion
      data={data}
      selectedDropdownOption={summaryByWhoRegionSelectedDropdownOption}
    />
  ), [ summaryByWhoRegionSelectedDropdownOption ]);

  const completedMersVisualizationInformation = {
    [MersVisualizationId.REPORTED_EVENT_SUMMARY_OVER_TIME]:
      mersVisualizationInformation[MersVisualizationId.REPORTED_EVENT_SUMMARY_OVER_TIME],
    [MersVisualizationId.CAMEL_POPULATION_OVER_TIME]:
      mersVisualizationInformation[MersVisualizationId.CAMEL_POPULATION_OVER_TIME],
    [MersVisualizationId.MEDIAN_SEROPREVALENCE_OVER_TIME]:
      mersVisualizationInformation[MersVisualizationId.MEDIAN_SEROPREVALENCE_OVER_TIME],
    [MersVisualizationId.SUMMARY_BY_WHO_REGION]: {
      ...mersVisualizationInformation[MersVisualizationId.SUMMARY_BY_WHO_REGION],
      getDisplayName: getDisplayNameForSummaryByWhoRegion,
      renderVisualization: renderVisualizationForSummaryByWhoRegion
    }
  } as const;

  return {
    mersVisualizationInformation: completedMersVisualizationInformation,
    mersVisualizationInformationArray: typedObjectEntries(completedMersVisualizationInformation).map(([_, value]) => value)
  }
}

export const mersVisualizationInformationArray = typedObjectEntries(mersVisualizationInformation).map(([_, value]) => value);
export const getUrlParameterFromVisualizationId: GetUrlParameterFromVisualizationIdFunction<
  MersVisualizationId,
  MersVisualizationUrlParameter
> = ({ visualizationId }) => ({urlParameter: mersVisualizationInformation[visualizationId].urlParameter})
