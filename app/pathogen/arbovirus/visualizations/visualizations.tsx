import { typedObjectEntries } from "@/lib/utils";
import { AntibodyPathogenBar, MedianSeroPrevByWHOregionAndAgeGroup, StudyCountOverTime, StudyCountOverTimeBySampleFrame, Top10CountriesByPathogenStudyCount } from "../dashboard/(visualizations)/recharts";
import { ChangeInMedianSeroprevalenceOverTimeGraph } from "../dashboard/(visualizations)/change-in-median-seroprevalence-over-time-graph";
import { EstimateCountByUnRegionAndArbovirusGraph } from "../dashboard/(visualizations)/estimate-count-by-un-region-and-arbovirus-graph";
import { EstimateCountByWHORegionAndArbovirusGraph } from "../dashboard/(visualizations)/estimate-count-by-who-region-and-arbovirus-graph";
import { LegendConfiguration } from "../dashboard/(visualizations)/stacked-bar-chart";
import { MedianSeroprevalenceByUnRegionAndArbovirusGraph } from "../dashboard/(visualizations)/median-seroprevalence-by-un-region-and-arbovirus-graph";
import { MedianSeroprevalenceByWHORegionAndArbovirusGraph } from "../dashboard/(visualizations)/median-seroprevalence-by-who-region-and-arbovirus-graph";
import { MedianSeroprevalenceByWhoRegionAndAgeGroupTable } from "../dashboard/(visualizations)/median-seroprevalence-by-who-region-and-age-group-table";

export enum VisualizationId {
  CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_ARBOVIRUS = "CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_ARBOVIRUS",
  CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME = "CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME",
  ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE = "ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE",
  ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS = "ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS",
  ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS = "ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS",
  MEDIAN_SEROPREVALENCE_BY_WHO_REGION = "MEDIAN_SEROPREVALENCE_BY_WHO_REGION",
  MEDIAN_SEROPREVALENCE_BY_UN_REGION = "MEDIAN_SEROPREVALENCE_BY_UN_REGION",
  MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP = "MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP",
  TOP_TEN_COUNTRIES_REPORTING_ESTIMATES_BY_ARBOVIRUS = "TOP_TEN_COUNTRIES_REPORTING_ESTIMATES_BY_ARBOVIRUS",
  CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME = "CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME"
}

export const isVisualizationId = (
  visualizationId: string
): visualizationId is VisualizationId =>
  Object.values(VisualizationId).some((element) => element === visualizationId);

enum VisualizationUrlParameter {
  "cumulative-estimate-count-over-time-by-arbovirus" = "cumulative-estimate-count-over-time-by-arbovirus",
  "cumulative-estimate-count-over-time-by-sample-frame" = "cumulative-estimate-count-over-time-by-sample-frame",
  "estimate-count-by-who-region-and-arbovirus" = "estimate-count-by-who-region-and-arbovirus",
  "estimate-count-by-un-region-and-arbovirus" = "estimate-count-by-un-region-and-arbovirus",
  "estimate-count-by-arbovirus-and-antibody-type" = "estimate-count-by-arbovirus-and-antibody-type",
  "median-seroprevalence-by-who-region" = "median-seroprevalence-by-who-region",
  "median-seroprevalence-by-un-region" = "median-seroprevalence-by-un-region",
  "median-seroprevalence-by-who-region-and-age-group" = "median-seroprevalence-by-who-region-and-age-group",
  "top-ten-countries-reporting-estimates-by-arbovirus" = "top-ten-countries-reporting-estimates-by-arbovirus",
  "change-in-median-seroprevalence-over-time" = "change-in-median-seroprevalence-over-time"
}

export const isVisualizationUrlParameter = (
  visualizationUrlParameter: string
): visualizationUrlParameter is VisualizationUrlParameter =>
  Object.values(VisualizationUrlParameter).some((element) => element === visualizationUrlParameter);

enum VisualizationDisplayName {
  "Cumulative estimate count over time by arbovirus" = "Cumulative estimate count over time by arbovirus",
  "Cumulative estimate count over time by sample frame" = "Cumulative estimate count over time by sample frame",
  "Estimate count by arbovirus & antibody type" = "Estimate count by arbovirus & antibody type",
  "Estimate count by WHO region and arbovirus" = "Estimate count by WHO region and arbovirus",
  "Estimate count by UN region and arbovirus" = "Estimate count by UN region and arbovirus",
  "Median seroprevalence of arboviruses by WHO Region" = "Median seroprevalence of arboviruses by WHO Region",
  "Median seroprevalence of arboviruses by UN Region" = "Median seroprevalence of arboviruses by UN Region",
  "Median seroprevalence by WHO region and age group" = "Median seroprevalence by WHO region and age group",
  "Top ten countries reporting estimates by arbovirus" = "Top ten countries reporting estimates by arbovirus",
  "Change in median seroprevalence over time" = "Change in median seroprevalence over time",
}

export interface VisualizationInformation {
  id: VisualizationId;
  urlParameter: VisualizationUrlParameter;
  displayName: VisualizationDisplayName;
  renderVisualization: () => React.ReactNode;
}

const allVisualizationInformation: Record<VisualizationId, VisualizationInformation> = {
  [VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_ARBOVIRUS]: {
    id: VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_ARBOVIRUS,
    urlParameter:
      VisualizationUrlParameter[
        "cumulative-estimate-count-over-time-by-arbovirus"
      ],
    displayName:
      VisualizationDisplayName[
        "Cumulative estimate count over time by arbovirus"
      ],
    renderVisualization: StudyCountOverTime
  },
  [VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME]: {
    id: VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME,
    urlParameter:
      VisualizationUrlParameter[
        "cumulative-estimate-count-over-time-by-sample-frame"
      ],
    displayName:
      VisualizationDisplayName[
        "Cumulative estimate count over time by sample frame"
      ],
    renderVisualization: StudyCountOverTimeBySampleFrame
  },
  [VisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE]: {
    id: VisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE,
    urlParameter:
      VisualizationUrlParameter[
        "estimate-count-by-arbovirus-and-antibody-type"
      ],
    displayName:
      VisualizationDisplayName["Estimate count by arbovirus & antibody type"],
    renderVisualization: AntibodyPathogenBar
  },
  [VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS]: {
    id: VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS,
    urlParameter:
      VisualizationUrlParameter["estimate-count-by-who-region-and-arbovirus"],
    displayName:
      VisualizationDisplayName["Estimate count by WHO region and arbovirus"],
    renderVisualization: () => EstimateCountByWHORegionAndArbovirusGraph({ legendConfiguration: LegendConfiguration.RIGHT_ALIGNED })
  },
  [VisualizationId.ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS]: {
    id: VisualizationId.ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS,
    urlParameter:
      VisualizationUrlParameter["estimate-count-by-un-region-and-arbovirus"],
    displayName:
      VisualizationDisplayName["Estimate count by UN region and arbovirus"],
    renderVisualization: () => EstimateCountByUnRegionAndArbovirusGraph({ legendConfiguration: LegendConfiguration.RIGHT_ALIGNED })
  },
  [VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION]: {
    id: VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION,
    urlParameter:
      VisualizationUrlParameter["median-seroprevalence-by-who-region"],
    displayName:
      VisualizationDisplayName["Median seroprevalence of arboviruses by WHO Region"],
    renderVisualization: MedianSeroprevalenceByWHORegionAndArbovirusGraph
  },
  [VisualizationId.MEDIAN_SEROPREVALENCE_BY_UN_REGION]: {
    id: VisualizationId.MEDIAN_SEROPREVALENCE_BY_UN_REGION,
    urlParameter:
      VisualizationUrlParameter["median-seroprevalence-by-un-region"],
    displayName:
      VisualizationDisplayName["Median seroprevalence of arboviruses by UN Region"],
    renderVisualization: MedianSeroprevalenceByUnRegionAndArbovirusGraph
  },
  [VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP]: {
    id: VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP,
    urlParameter:
      VisualizationUrlParameter[
        "median-seroprevalence-by-who-region-and-age-group"
      ],
    displayName:
      VisualizationDisplayName[
        "Median seroprevalence by WHO region and age group"
      ],
    renderVisualization: MedianSeroprevalenceByWhoRegionAndAgeGroupTable
  },
  [VisualizationId.TOP_TEN_COUNTRIES_REPORTING_ESTIMATES_BY_ARBOVIRUS]: {
    id: VisualizationId.TOP_TEN_COUNTRIES_REPORTING_ESTIMATES_BY_ARBOVIRUS,
    urlParameter:
      VisualizationUrlParameter[
        "top-ten-countries-reporting-estimates-by-arbovirus"
      ],
    displayName:
      VisualizationDisplayName[
        "Top ten countries reporting estimates by arbovirus"
      ],
    renderVisualization: Top10CountriesByPathogenStudyCount
  },
  [VisualizationId.CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME]: {
    id: VisualizationId.CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME,
    urlParameter:
      VisualizationUrlParameter[
        "change-in-median-seroprevalence-over-time"
      ],
    displayName:
      VisualizationDisplayName[
        "Change in median seroprevalence over time"
      ],
    renderVisualization: ChangeInMedianSeroprevalenceOverTimeGraph
  },
}

const visualizationInformationArray = typedObjectEntries(allVisualizationInformation).map(([_, value]) => value);

interface GetInformationFromVisualizationIdInput {
  visualizationId: VisualizationId;
}

export const getVisualizationInformationFromVisualizationId = (
  input: GetInformationFromVisualizationIdInput
): VisualizationInformation => {
  return allVisualizationInformation[input.visualizationId];
};

interface GetInformationFromVisualizationUrlParameterInput {
  visualizationUrlParameter: VisualizationUrlParameter;
}

export const getVisualizationInformationFromVisualizationUrlParameter = (
  input: GetInformationFromVisualizationUrlParameterInput
): VisualizationInformation | undefined => {
  return visualizationInformationArray.find(
    (visualization) => input.visualizationUrlParameter === visualization.urlParameter
  );
};

type AddVisualizationInformationInput<TVisualizationId extends VisualizationId, TNewInformation extends Record<string, unknown>> = Record<TVisualizationId, TNewInformation>;
type AddVisualizationInformationOutput<TNewInformation extends Record<string, unknown>> = (TNewInformation & VisualizationInformation)[];

export const addToVisualizationInformation = <TVisualizationId extends VisualizationId, TNewInformation extends Record<string, unknown>>(
  input: AddVisualizationInformationInput<TVisualizationId, TNewInformation>
): AddVisualizationInformationOutput<TNewInformation> => {
  return typedObjectEntries(input).map(([key, value]) => ({
    ...allVisualizationInformation[key],
    ...value
  }));
}