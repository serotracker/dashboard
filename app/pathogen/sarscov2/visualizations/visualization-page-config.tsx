"use client";
import { VisualizationInformation } from "../../generic-pathogen-visualizations-page";
import { typedObjectEntries } from "@/lib/utils";
import { GetUrlParameterFromVisualizationIdFunction } from '@/components/customs/visualizations/visualization-header';
import { SarsCov2Estimate } from '@/contexts/pathogen-context/pathogen-contexts/sc2-context';
import { PublishedStudiesByGdbRegionGraph } from "../dashboard/(visualizations)/published-studies-by-gbd-region";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { CumulativeNumberOfSerosurveysPublishedOverTime } from "../dashboard/(visualizations)/cumulative-number-of-serosurveys-published-over-time";
import { ModelledSeroprevalenceByWhoRegionGraph } from "../dashboard/(visualizations)/modelled-seroprevalence-by-who-region";
import { ComparingSeroprevalencePositiveCasesAndVaccinationsOverTime } from "../dashboard/(visualizations)/comparing-seroprevalence-positive-cases-and-vaccinations-over-time";
import { NumberOfInfectionsPerConfirmedCaseAtTheStudyMidpointByGbdSuperRegion } from "../dashboard/(visualizations)/number-of-infections-at-midpoint-by-gbd-region";

export enum SarsCov2VisualizationId {
  PUBLISHED_STUDY_COUNT_BY_GBD_REGION = "PUBLISHED_STUDY_COUNT_BY_GBD_REGION",
  CUMULATIVE_NUMBER_OF_SEROSURVEYS_PUBLISHED_OVER_TIME = 'CUMULATIVE_NUMBER_OF_SEROSURVEYS_PUBLISHED_OVER_TIME',
  MODELLED_SEROPREVALENCE_BY_WHO_REGION = "MODELLED_SEROPREVALENCE_BY_WHO_REGION",
  COMPARING_SEROPREVALENCE_POSITIVE_CASES_AND_VACCINATIONS = "COMPARING_SEROPREVALENCE_POSITIVE_CASES_AND_VACCINATIONS",
  NUMBER_OF_INFECTIONS_AT_MIDPOINT_BY_GBD_REGION = "NUMBER_OF_INFECTIONS_AT_MIDPOINT_BY_GBD_REGION"
}

export const isSarsCov2VisualizationId = (
  visualizationId: string
): visualizationId is SarsCov2VisualizationId =>
  Object.values(SarsCov2VisualizationId).some((element) => element === visualizationId);

export enum SarsCov2VisualizationUrlParameter {
  "published-study-count-by-gbd-region" = "published-study-count-by-gbd-region",
  "cumulative-number-of-serosurveys-published-over-time" = "cumulative-number-of-serosurveys-published-over-time",
  "modelled-seroprevalence-by-who-region" = "modelled-seroprevalence-by-who-region",
  "comparing-seroprevalence-positive-cases-and-vaccinations" = "comparing-seroprevalence-positive-cases-and-vaccinations",
  "number-of-infections-at-midpoint-by-gbd-region" = "number-of-infections-at-midpoint-by-gbd-region"
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
    getDisplayName: () => "Published Studies per GBD Region",
    renderVisualization: () => PublishedStudiesByGdbRegionGraph({legendConfiguration: LegendConfiguration.RIGHT_ALIGNED})
  },
  [SarsCov2VisualizationId.CUMULATIVE_NUMBER_OF_SEROSURVEYS_PUBLISHED_OVER_TIME]: {
    id: SarsCov2VisualizationId.CUMULATIVE_NUMBER_OF_SEROSURVEYS_PUBLISHED_OVER_TIME,
    urlParameter:
      SarsCov2VisualizationUrlParameter[
        "cumulative-number-of-serosurveys-published-over-time"
      ],
    getDisplayName: () => "Cumulative Number Serosurveys Published Over Time",
    renderVisualization: () => CumulativeNumberOfSerosurveysPublishedOverTime()
  },
  [SarsCov2VisualizationId.MODELLED_SEROPREVALENCE_BY_WHO_REGION]: {
    id: SarsCov2VisualizationId.MODELLED_SEROPREVALENCE_BY_WHO_REGION,
    urlParameter:
      SarsCov2VisualizationUrlParameter[
        "modelled-seroprevalence-by-who-region"
      ],
    getDisplayName: () => "Modelled Seroprevalence Globally by WHO Region",
    renderVisualization: () => ModelledSeroprevalenceByWhoRegionGraph({legendConfiguration: LegendConfiguration.RIGHT_ALIGNED})
  },
  [SarsCov2VisualizationId.COMPARING_SEROPREVALENCE_POSITIVE_CASES_AND_VACCINATIONS]: {
    id: SarsCov2VisualizationId.COMPARING_SEROPREVALENCE_POSITIVE_CASES_AND_VACCINATIONS,
    urlParameter:
      SarsCov2VisualizationUrlParameter[
        "comparing-seroprevalence-positive-cases-and-vaccinations"
      ],
    getDisplayName: () => "Comparing Seroprevalence to Confirmed Cases and Vaccine Coverage Over Time",
    renderVisualization: () => ComparingSeroprevalencePositiveCasesAndVaccinationsOverTime({ legendConfiguration: LegendConfiguration.RIGHT_ALIGNED })
  },
  [SarsCov2VisualizationId.NUMBER_OF_INFECTIONS_AT_MIDPOINT_BY_GBD_REGION]: {
    id: SarsCov2VisualizationId.NUMBER_OF_INFECTIONS_AT_MIDPOINT_BY_GBD_REGION,
    urlParameter:
      SarsCov2VisualizationUrlParameter[
        "number-of-infections-at-midpoint-by-gbd-region"
      ],
    getDisplayName: () => "Number of Infections per Confirmed Case at the Study Midpoint by GBD Region",
    renderVisualization: () => NumberOfInfectionsPerConfirmedCaseAtTheStudyMidpointByGbdSuperRegion()
  },
}

export const sarsCov2VisualizationInformationArray = typedObjectEntries(sarsCov2VisualizationInformation).map(([_, value]) => value);
export const getUrlParameterFromVisualizationId: GetUrlParameterFromVisualizationIdFunction<
  SarsCov2VisualizationId,
  SarsCov2VisualizationUrlParameter
> = ({ visualizationId }) => ({urlParameter: sarsCov2VisualizationInformation[visualizationId].urlParameter})
