
"use client";
import { VisualizationInformation } from "../../generic-pathogen-visualizations-page";
import { typedObjectEntries } from "@/lib/utils";
import { GetUrlParameterFromVisualizationIdFunction } from '@/components/customs/visualizations/visualization-header';
import { MersEstimate } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { EventAndSeroprevalenceSummaryOverTime } from "../dashboard/(visualizations)/event-and-seroprevalence-summary-over-time";

export enum MersVisualizationId {
  EVENT_AND_SEROPREVALENCE_SUMMARY_OVER_TIME = "EVENT_AND_SEROPREVALENCE_SUMMARY_OVER_TIME",
}

export const isMersVisualizationId = (
  visualizationId: string
): visualizationId is MersVisualizationId =>
  Object.values(MersVisualizationId).some((element) => element === visualizationId);

export enum MersVisualizationUrlParameter {
  "event_and_seroprevalence_summary_over_time" = "event_and_seroprevalence_summary_over_time"
}

export type MersVisualizationInformation<TDropdownOption extends string> = VisualizationInformation<
  MersVisualizationId,
  MersVisualizationUrlParameter,
  MersEstimate,
  TDropdownOption
>;

export const isMersVisualizationUrlParameter = (
  visualizationUrlParameter: string
): visualizationUrlParameter is MersVisualizationUrlParameter =>
  Object.values(MersVisualizationUrlParameter).some((element) => element === visualizationUrlParameter);

export const mersVisualizationInformation: Record<MersVisualizationId, MersVisualizationInformation<string>> = {
  [MersVisualizationId.EVENT_AND_SEROPREVALENCE_SUMMARY_OVER_TIME]: {
    id: MersVisualizationId.EVENT_AND_SEROPREVALENCE_SUMMARY_OVER_TIME,
    urlParameter:
      MersVisualizationUrlParameter[
        "event_and_seroprevalence_summary_over_time"
      ],
    getDisplayName: () => "Event and Seroprevalence Summary Over Time",
    renderVisualization: () => <EventAndSeroprevalenceSummaryOverTime />
  }
}

export const mersVisualizationInformationArray = typedObjectEntries(mersVisualizationInformation).map(([_, value]) => value);
export const getUrlParameterFromVisualizationId: GetUrlParameterFromVisualizationIdFunction<
  MersVisualizationId,
  MersVisualizationUrlParameter
> = ({ visualizationId }) => ({urlParameter: mersVisualizationInformation[visualizationId].urlParameter})
