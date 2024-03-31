import { typedObjectEntries } from "@/lib/utils";
import { AntibodyPathogenBar, MedianSeroPrevByWHOregionAndAgeGroup, StudyCountOverTime, StudyCountOverTimeBySampleFrame, Top10CountriesByPathogenStudyCount, arbovirusesSF, convertArboSFtoArbo } from "../dashboard/(visualizations)/recharts";
import { ChangeInMedianSeroprevalenceOverTimeGraph } from "../dashboard/(visualizations)/change-in-median-seroprevalence-over-time-graph";
import { EstimateCountByUnRegionAndArbovirusGraph } from "../dashboard/(visualizations)/estimate-count-by-un-region-and-arbovirus-graph";
import { EstimateCountByWHORegionAndArbovirusGraph } from "../dashboard/(visualizations)/estimate-count-by-who-region-and-arbovirus-graph";
import { LegendConfiguration } from "../dashboard/(visualizations)/stacked-bar-chart";
import { MedianSeroprevalenceByUnRegionAndArbovirusGraph } from "../dashboard/(visualizations)/median-seroprevalence-by-un-region-and-arbovirus-graph";
import { MedianSeroprevalenceByWHORegionAndArbovirusGraph } from "../dashboard/(visualizations)/median-seroprevalence-by-who-region-and-arbovirus-graph";
import { MedianSeroprevalenceByWhoRegionAndAgeGroupTable } from "../dashboard/(visualizations)/median-seroprevalence-by-who-region-and-age-group-table";
import { CountrySeroprevalenceComparisonScatterPlot } from "../dashboard/(visualizations)/country-seroprevalence-comparison-scatter-plot";
import uniq from "lodash/uniq";

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
  CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME = "CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME",
  COUNTRY_SEROPREVALENCE_COMPARISON_SCATTER_PLOT = "COUNTRY_SEROPREVALENCE_COMPARISON_SCATTER_PLOT"
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
  "change-in-median-seroprevalence-over-time" = "change-in-median-seroprevalence-over-time",
  "country-seroprevalence-comparison-scatter-plot" = "country-seroprevalence-comparison-scatter-plot",
}

export const isVisualizationUrlParameter = (
  visualizationUrlParameter: string
): visualizationUrlParameter is VisualizationUrlParameter =>
  Object.values(VisualizationUrlParameter).some((element) => element === visualizationUrlParameter);

interface GetDisplayNameInput {
  data: any[]
}

export interface VisualizationInformation {
  id: VisualizationId;
  urlParameter: VisualizationUrlParameter;
  getDisplayName: (input: GetDisplayNameInput) => string;
  titleTooltipText?: string;
  renderVisualization: () => React.ReactNode;
}

const allVisualizationInformation: Record<VisualizationId, VisualizationInformation> = {
  [VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_ARBOVIRUS]: {
    id: VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_ARBOVIRUS,
    urlParameter:
      VisualizationUrlParameter[
        "cumulative-estimate-count-over-time-by-arbovirus"
      ],
    getDisplayName: () => "Cumulative estimate count over time by arbovirus",
    renderVisualization: StudyCountOverTime
  },
  [VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME]: {
    id: VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME,
    urlParameter:
      VisualizationUrlParameter[
        "cumulative-estimate-count-over-time-by-sample-frame"
      ],
    getDisplayName: () => "Cumulative estimate count over time by sample frame",
    renderVisualization: StudyCountOverTimeBySampleFrame
  },
  [VisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE]: {
    id: VisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE,
    urlParameter:
      VisualizationUrlParameter[
        "estimate-count-by-arbovirus-and-antibody-type"
      ],
    getDisplayName: () => "Estimate count by arbovirus & antibody type",
    renderVisualization: AntibodyPathogenBar
  },
  [VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS]: {
    id: VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS,
    urlParameter:
      VisualizationUrlParameter["estimate-count-by-who-region-and-arbovirus"],
    getDisplayName: () => "Estimate count by WHO region and arbovirus",
    renderVisualization: () => EstimateCountByWHORegionAndArbovirusGraph({ legendConfiguration: LegendConfiguration.RIGHT_ALIGNED })
  },
  [VisualizationId.ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS]: {
    id: VisualizationId.ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS,
    urlParameter:
      VisualizationUrlParameter["estimate-count-by-un-region-and-arbovirus"],
    getDisplayName: () => "Estimate count by UN region and arbovirus",
    renderVisualization: () => EstimateCountByUnRegionAndArbovirusGraph({ legendConfiguration: LegendConfiguration.RIGHT_ALIGNED })
  },
  [VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION]: {
    id: VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION,
    urlParameter:
      VisualizationUrlParameter["median-seroprevalence-by-who-region"],
    getDisplayName: () => "Median seroprevalence of arboviruses by WHO Region",
    renderVisualization: MedianSeroprevalenceByWHORegionAndArbovirusGraph
  },
  [VisualizationId.MEDIAN_SEROPREVALENCE_BY_UN_REGION]: {
    id: VisualizationId.MEDIAN_SEROPREVALENCE_BY_UN_REGION,
    urlParameter:
      VisualizationUrlParameter["median-seroprevalence-by-un-region"],
    getDisplayName: () => "Median seroprevalence of arboviruses by UN Region",
    renderVisualization: MedianSeroprevalenceByUnRegionAndArbovirusGraph
  },
  [VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP]: {
    id: VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP,
    urlParameter:
      VisualizationUrlParameter[
        "median-seroprevalence-by-who-region-and-age-group"
      ],
    getDisplayName: () => "Median seroprevalence by WHO region and age group",
    renderVisualization: MedianSeroprevalenceByWhoRegionAndAgeGroupTable
  },
  [VisualizationId.TOP_TEN_COUNTRIES_REPORTING_ESTIMATES_BY_ARBOVIRUS]: {
    id: VisualizationId.TOP_TEN_COUNTRIES_REPORTING_ESTIMATES_BY_ARBOVIRUS,
    urlParameter:
      VisualizationUrlParameter[
        "top-ten-countries-reporting-estimates-by-arbovirus"
      ],
    getDisplayName: () => "Top ten countries reporting estimates by arbovirus",
    renderVisualization: Top10CountriesByPathogenStudyCount
  },
  [VisualizationId.CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME]: {
    id: VisualizationId.CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME,
    urlParameter:
      VisualizationUrlParameter[
        "change-in-median-seroprevalence-over-time"
      ],
    getDisplayName: () => "Change in median seroprevalence over time",
    renderVisualization: ChangeInMedianSeroprevalenceOverTimeGraph
  },
  [VisualizationId.COUNTRY_SEROPREVALENCE_COMPARISON_SCATTER_PLOT]: {
    id: VisualizationId.COUNTRY_SEROPREVALENCE_COMPARISON_SCATTER_PLOT,
    urlParameter:
      VisualizationUrlParameter['country-seroprevalence-comparison-scatter-plot'],
    getDisplayName: (input) => {
      const allPathogensInData = uniq(input.data.map((dataPoint) => dataPoint.pathogen as arbovirusesSF));

      if(allPathogensInData.length !== 1) {
        return "Estimates with 95% CIs";
      }

      const selectedPathogen = allPathogensInData[0];

      return `${convertArboSFtoArbo(selectedPathogen)} study estimates with 95% CIs`;
    },
    titleTooltipText: '95% confidence intervals were calculated using the Clopper-Pearson method if not reported in the source.',
    renderVisualization: CountrySeroprevalenceComparisonScatterPlot
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