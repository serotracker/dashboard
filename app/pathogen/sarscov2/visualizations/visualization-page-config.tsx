"use client";
import { VisualizationInformation } from "../../generic-pathogen-visualizations-page";
import { typedObjectEntries } from "@/lib/utils";
import { GetUrlParameterFromVisualizationIdFunction } from '@/components/customs/visualizations/visualization-header';
import { SarsCov2Estimate } from '@/contexts/pathogen-context/pathogen-contexts/sc2-context';
import { PublishedStudiesByGdbRegionGraph } from "../dashboard/(visualizations)/published-studies-by-gbd-region";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";

export enum SarsCov2VisualizationId {
  PUBLISHED_STUDY_COUNT_BY_GBD_REGION = "PUBLISHED_STUDY_COUNT_BY_GBD_REGION",
}

export const isSarsCov2VisualizationId = (
  visualizationId: string
): visualizationId is SarsCov2VisualizationId =>
  Object.values(SarsCov2VisualizationId).some((element) => element === visualizationId);

export enum SarsCov2VisualizationUrlParameter {
  "published-study-count-by-gbd-region" = "published-study-count-by-gbd-region",
}

export type SarsCov2VisualizationInformation = VisualizationInformation<
  SarsCov2VisualizationId,
  SarsCov2VisualizationUrlParameter,
  SarsCov2Estimate
>;

export const isSarsCov2VisualizationUrlParameter = (
  visualizationUrlParameter: string
): visualizationUrlParameter is SarsCov2VisualizationUrlParameter =>
  Object.values(SarsCov2VisualizationUrlParameter).some((element) => element === visualizationUrlParameter);

export const sarsCov2VisualizationInformation: Record<SarsCov2VisualizationId, SarsCov2VisualizationInformation> = {
  [SarsCov2VisualizationId.PUBLISHED_STUDY_COUNT_BY_GBD_REGION]: {
    id: SarsCov2VisualizationId.PUBLISHED_STUDY_COUNT_BY_GBD_REGION,
    urlParameter:
      SarsCov2VisualizationUrlParameter[
        "published-study-count-by-gbd-region"
      ],
    getDisplayName: () => "Cumulative estimate count over time by arbovirus",
    renderVisualization: () => PublishedStudiesByGdbRegionGraph({legendConfiguration: LegendConfiguration.RIGHT_ALIGNED})
  },
}

export const sarsCov2VisualizationInformationArray = typedObjectEntries(sarsCov2VisualizationInformation).map(([_, value]) => value);
export const getUrlParameterFromVisualizationId: GetUrlParameterFromVisualizationIdFunction<
  SarsCov2VisualizationId,
  SarsCov2VisualizationUrlParameter
> = ({ visualizationId }) => ({urlParameter: sarsCov2VisualizationInformation[visualizationId].urlParameter})
