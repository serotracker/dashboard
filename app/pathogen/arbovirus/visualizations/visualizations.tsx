import { typedObjectEntries } from "@/lib/utils";
import { AntibodyPathogenBar, MedianSeroPrevByWHOregion, MedianSeroPrevByWHOregionAndAgeGroup, StudyCountOverTime, StudyCountOverTimeBySampleFrame, Top10CountriesByPathogenStudyCount, WHORegionAndArbovirusBar } from "../analyze/recharts";

export enum VisualizationId {
  CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_ARBOVIRUS = "CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_ARBOVIRUS",
  CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME = "CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME",
  ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE = "ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE",
  ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS = "ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS",
  MEDIAN_SEROPREVALENCE_BY_WHO_REGION = "MEDIAN_SEROPREVALENCE_BY_WHO_REGION",
  MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP = "MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP",
  TOP_TEN_COUNTRIES_REPORTING_ESTIMATES_BY_ARBOVIRUS = "TOP_TEN_COUNTRIES_REPORTING_ESTIMATES_BY_ARBOVIRUS",
}

export const isVisualizationId = (
  visualizationId: string
): visualizationId is VisualizationId =>
  Object.values(VisualizationId).some((element) => element === visualizationId);

enum VisualizationUrlParameter {
  "cumulative-estimate-count-over-time-by-arbovirus" = "cumulative-estimate-count-over-time-by-arbovirus",
  "cumulative-estimate-count-over-time-by-sample-frame" = "cumulative-estimate-count-over-time-by-sample-frame",
  "estimate-count-by-who-region-and-arbovirus" = "estimate-count-by-who-region-and-arbovirus",
  "estimate-count-by-arbovirus-and-antibody-type" = "estimate-count-by-arbovirus-and-antibody-type",
  "median-seroprevalence-by-who-region" = "median-seroprevalence-by-who-region",
  "median-seroprevalence-by-who-region-and-age-group" = "median-seroprevalence-by-who-region-and-age-group",
  "top-ten-countries-reporting-estimates-by-arbovirus" = "top-ten-countries-reporting-estimates-by-arbovirus",
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
  "Median seroprevalence by WHO Region" = "Median seroprevalence by WHO Region",
  "Median seroprevalence by WHO region and age group" = "Median seroprevalence by WHO region and age group",
  "Top ten countries reporting estimates by arbovirus" = "Top ten countries reporting estimates by arbovirus",
}

interface VisualizationInformation {
  id: VisualizationId;
  urlParameter: VisualizationUrlParameter;
  displayName: VisualizationDisplayName;
  renderVisualization: () => React.ReactNode;
  classNameWhenFullscreen: string
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
    renderVisualization: StudyCountOverTime,
    classNameWhenFullscreen: "p-16"
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
    renderVisualization: StudyCountOverTimeBySampleFrame,
    classNameWhenFullscreen: "p-20"
  },
  [VisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE]: {
    id: VisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE,
    urlParameter:
      VisualizationUrlParameter[
        "estimate-count-by-arbovirus-and-antibody-type"
      ],
    displayName:
      VisualizationDisplayName["Estimate count by arbovirus & antibody type"],
    renderVisualization: AntibodyPathogenBar,
    classNameWhenFullscreen: "p-16"
  },
  [VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS]: {
    id: VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS,
    urlParameter:
      VisualizationUrlParameter["estimate-count-by-who-region-and-arbovirus"],
    displayName:
      VisualizationDisplayName["Estimate count by WHO region and arbovirus"],
    renderVisualization: WHORegionAndArbovirusBar,
    classNameWhenFullscreen: "p-16"
  },
  [VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION]: {
    id: VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION,
    urlParameter:
      VisualizationUrlParameter["median-seroprevalence-by-who-region"],
    displayName:
      VisualizationDisplayName["Median seroprevalence by WHO Region"],
    renderVisualization: MedianSeroPrevByWHOregion,
    classNameWhenFullscreen: "p-10"
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
    renderVisualization: MedianSeroPrevByWHOregionAndAgeGroup,
    classNameWhenFullscreen: "p-6"
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
    renderVisualization: Top10CountriesByPathogenStudyCount,
    classNameWhenFullscreen: "p-14"
  },
}

const visualizationInformationArray = typedObjectEntries(allVisualizationInformation).map(([_, value]) => value);

interface GetInformationFromVisualizationIdInput {
  visualizationId: VisualizationId;
}

export const getVisualizationInformationFromVisualizationId = (
  input: GetInformationFromVisualizationIdInput
): VisualizationInformation | undefined => {
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

type AddVisualizationInformationInput<TNewInformation extends Record<string, unknown>> = Record<VisualizationId, TNewInformation>;
type AddVisualizationInformationOutput<TNewInformation extends Record<string, unknown>> = (TNewInformation & VisualizationInformation)[];

export const addToVisualizationInformation = <TNewInformation extends Record<string, unknown>>(
  input: AddVisualizationInformationInput<TNewInformation>
): AddVisualizationInformationOutput<TNewInformation> => {
  return typedObjectEntries(input).map(([key, value]) => ({
    ...allVisualizationInformation[key],
    ...value
  }));
}