
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
import { MedianSeroprevalenceOverTimeByWhoRegion } from "../dashboard/(visualizations)/median-seroprevalence-over-time-by-who-region";
import { ReportedEventsOverTimeByWhoRegion } from "../dashboard/(visualizations)/reported-events-over-time-by-who-region";

export enum MersVisualizationId {
  REPORTED_EVENT_SUMMARY_OVER_TIME = "REPORTED_EVENT_SUMMARY_OVER_TIME",
  CAMEL_POPULATION_OVER_TIME = "CAMEL_POPULATION_OVER_TIME",
  MEDIAN_SEROPREVALENCE_OVER_TIME = "MEDIAN_SEROPREVALENCE_OVER_TIME",
  MEDIAN_SEROPREVALENCE_OVER_TIME_BY_WHO_REGION = "MEDIAN_SEROPREVALENCE_OVER_TIME_BY_WHO_REGION",
  REPORTED_EVENTS_OVER_TIME_BY_WHO_REGION = "REPORTED_EVENTS_OVER_TIME_BY_WHO_REGION",
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
  "median_seroprevalence_over_time_by_who_region" = "median_seroprevalence_over_time_by_who_region",
  "reported_events_over_time_by_who_region" = "reported_events_over_time_by_who_region",
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

export const mersVisualizationInformation: Record<MersVisualizationId, MersVisualizationInformation<string, string>> = {
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
  [MersVisualizationId.MEDIAN_SEROPREVALENCE_OVER_TIME_BY_WHO_REGION]: {
    id: MersVisualizationId.MEDIAN_SEROPREVALENCE_OVER_TIME_BY_WHO_REGION,
    urlParameter:
      MersVisualizationUrlParameter[
        "median_seroprevalence_over_time_by_who_region"
      ],
    getDisplayName: () => ({ type: VisualizationDisplayNameType.STANDARD, displayName: "Median Seroprevalence Over Time By WHO Region" }),
    renderVisualization: ({ data }) => <MedianSeroprevalenceOverTimeByWhoRegion data={data} />
  },
  [MersVisualizationId.REPORTED_EVENTS_OVER_TIME_BY_WHO_REGION]: {
    id: MersVisualizationId.REPORTED_EVENTS_OVER_TIME_BY_WHO_REGION,
    urlParameter:
      MersVisualizationUrlParameter[
        "reported_events_over_time_by_who_region"
      ],
    getDisplayName: () => ({ type: VisualizationDisplayNameType.STANDARD, displayName: "Reported MERS Cases Over Time By WHO Region" }),
    renderVisualization: ({ data }) => <ReportedEventsOverTimeByWhoRegion data={data} />
  },
  [MersVisualizationId.SUMMARY_BY_WHO_REGION]: {
    id: MersVisualizationId.SUMMARY_BY_WHO_REGION,
    urlParameter:
      MersVisualizationUrlParameter[
        "summary_by_who_region"
      ],
    getDisplayName: () => ({ type: VisualizationDisplayNameType.STANDARD, displayName: "MERS Summary By WHO Region" }),
    renderVisualization: ({ data }) => <ReportedEventsOverTimeByWhoRegion data={data} />
  }
}

export const mersVisualizationInformationArray = typedObjectEntries(mersVisualizationInformation).map(([_, value]) => value);
export const getUrlParameterFromVisualizationId: GetUrlParameterFromVisualizationIdFunction<
  MersVisualizationId,
  MersVisualizationUrlParameter
> = ({ visualizationId }) => ({urlParameter: mersVisualizationInformation[visualizationId].urlParameter})
