import uniq from 'lodash/uniq';
import { VisualizationInformation } from "../../generic-pathogen-visualizations-page";
import { StudyCountOverTime, Top10CountriesByPathogenStudyCount, convertArboSFtoArbo } from "../dashboard/(visualizations)/recharts";
import { ArbovirusEstimate } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { EstimateCountByWHORegionAndArbovirusGraph } from "../dashboard/(visualizations)/estimate-count-by-who-region-and-arbovirus-graph";
import { EstimateCountByUnRegionAndArbovirusGraph } from "../dashboard/(visualizations)/estimate-count-by-un-region-and-arbovirus-graph";
import { MedianSeroprevalenceByWHORegionAndArbovirusGraph } from "../dashboard/(visualizations)/median-seroprevalence-by-who-region-and-arbovirus-graph";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";
import { MedianSeroprevalenceByUnRegionAndArbovirusGraph } from "../dashboard/(visualizations)/median-seroprevalence-by-un-region-and-arbovirus-graph";
import { MedianSeroprevalenceByWhoRegionAndAgeGroupTable } from "../dashboard/(visualizations)/median-seroprevalence-by-who-region-and-age-group-table";
import { ChangeInMedianSeroprevalenceOverTimeGraph } from "../dashboard/(visualizations)/change-in-median-seroprevalence-over-time-graph";
import { CountrySeroprevalenceComparisonScatterPlot } from "../dashboard/(visualizations)/country-seroprevalence-comparison-scatter-plot";
import { typedObjectEntries } from "@/lib/utils";
import { GetUrlParameterFromVisualizationIdFunction } from '@/components/customs/visualizations/visualization-header';
import { StudyCountOverTimeBySampleFrame } from '../dashboard/(visualizations)/study-count-over-time-by-sample-frame';
import { EstimateCountByArbovirusAndAntibodyTypeGraph } from '../dashboard/(visualizations)/estimate-count-by-arbovirus-and-antibody-type-graph';

export enum ArbovirusVisualizationId {
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

export const isArbovirusVisualizationId = (
  visualizationId: string
): visualizationId is ArbovirusVisualizationId =>
  Object.values(ArbovirusVisualizationId).some((element) => element === visualizationId);

export enum ArbovirusVisualizationUrlParameter {
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

export type ArbovirusVisualizationInformation<TDropdownOption extends string> = VisualizationInformation<
  ArbovirusVisualizationId,
  ArbovirusVisualizationUrlParameter,
  ArbovirusEstimate,
  TDropdownOption
>;

export const isArbovirusVisualizationUrlParameter = (
  visualizationUrlParameter: string
): visualizationUrlParameter is ArbovirusVisualizationUrlParameter =>
  Object.values(ArbovirusVisualizationUrlParameter).some((element) => element === visualizationUrlParameter);

export const arbovirusVisualizationInformation: Record<ArbovirusVisualizationId, ArbovirusVisualizationInformation<string>> = {
  [ArbovirusVisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_ARBOVIRUS]: {
    id: ArbovirusVisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_ARBOVIRUS,
    urlParameter:
      ArbovirusVisualizationUrlParameter[
        "cumulative-estimate-count-over-time-by-arbovirus"
      ],
    getDisplayName: () => "Cumulative estimate count over time by arbovirus",
    renderVisualization: StudyCountOverTime
  },
  [ArbovirusVisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME]: {
    id: ArbovirusVisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME,
    urlParameter:
      ArbovirusVisualizationUrlParameter[
        "cumulative-estimate-count-over-time-by-sample-frame"
      ],
    getDisplayName: () => "Cumulative estimate count over time by sample frame",
    renderVisualization: StudyCountOverTimeBySampleFrame
  },
  [ArbovirusVisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE]: {
    id: ArbovirusVisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE,
    urlParameter:
      ArbovirusVisualizationUrlParameter[
        "estimate-count-by-arbovirus-and-antibody-type"
      ],
    getDisplayName: () => "Estimate count by arbovirus & antibody type",
    renderVisualization: () => EstimateCountByArbovirusAndAntibodyTypeGraph({ legendConfiguration: LegendConfiguration.RIGHT_ALIGNED })
  },
  [ArbovirusVisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS]: {
    id: ArbovirusVisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS,
    urlParameter:
      ArbovirusVisualizationUrlParameter["estimate-count-by-who-region-and-arbovirus"],
    getDisplayName: () => "Estimate count by WHO region and arbovirus",
    renderVisualization: () => EstimateCountByWHORegionAndArbovirusGraph({ legendConfiguration: LegendConfiguration.RIGHT_ALIGNED })
  },
  [ArbovirusVisualizationId.ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS]: {
    id: ArbovirusVisualizationId.ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS,
    urlParameter:
      ArbovirusVisualizationUrlParameter["estimate-count-by-un-region-and-arbovirus"],
    getDisplayName: () => "Estimate count by UN region and arbovirus",
    renderVisualization: () => EstimateCountByUnRegionAndArbovirusGraph({ legendConfiguration: LegendConfiguration.RIGHT_ALIGNED })
  },
  [ArbovirusVisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION]: {
    id: ArbovirusVisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION,
    urlParameter:
      ArbovirusVisualizationUrlParameter["median-seroprevalence-by-who-region"],
    getDisplayName: () => "Median seroprevalence of arboviruses by WHO Region",
    renderVisualization: MedianSeroprevalenceByWHORegionAndArbovirusGraph
  },
  [ArbovirusVisualizationId.MEDIAN_SEROPREVALENCE_BY_UN_REGION]: {
    id: ArbovirusVisualizationId.MEDIAN_SEROPREVALENCE_BY_UN_REGION,
    urlParameter:
      ArbovirusVisualizationUrlParameter["median-seroprevalence-by-un-region"],
    getDisplayName: () => "Median seroprevalence of arboviruses by UN Region",
    renderVisualization: MedianSeroprevalenceByUnRegionAndArbovirusGraph
  },
  [ArbovirusVisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP]: {
    id: ArbovirusVisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP,
    urlParameter:
      ArbovirusVisualizationUrlParameter[
        "median-seroprevalence-by-who-region-and-age-group"
      ],
    getDisplayName: () => "Median seroprevalence by WHO region and age group",
    renderVisualization: MedianSeroprevalenceByWhoRegionAndAgeGroupTable
  },
  [ArbovirusVisualizationId.TOP_TEN_COUNTRIES_REPORTING_ESTIMATES_BY_ARBOVIRUS]: {
    id: ArbovirusVisualizationId.TOP_TEN_COUNTRIES_REPORTING_ESTIMATES_BY_ARBOVIRUS,
    urlParameter:
      ArbovirusVisualizationUrlParameter[
        "top-ten-countries-reporting-estimates-by-arbovirus"
      ],
    getDisplayName: () => "Top ten countries reporting estimates by arbovirus",
    renderVisualization: Top10CountriesByPathogenStudyCount
  },
  [ArbovirusVisualizationId.CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME]: {
    id: ArbovirusVisualizationId.CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME,
    urlParameter:
      ArbovirusVisualizationUrlParameter[
        "change-in-median-seroprevalence-over-time"
      ],
    getDisplayName: () => "Change in median seroprevalence over time",
    renderVisualization: ChangeInMedianSeroprevalenceOverTimeGraph
  },
  [ArbovirusVisualizationId.COUNTRY_SEROPREVALENCE_COMPARISON_SCATTER_PLOT]: {
    id: ArbovirusVisualizationId.COUNTRY_SEROPREVALENCE_COMPARISON_SCATTER_PLOT,
    urlParameter:
      ArbovirusVisualizationUrlParameter['country-seroprevalence-comparison-scatter-plot'],
    getDisplayName: (input) => {
      const allPathogensInData = uniq(input.data.map((dataPoint) => dataPoint.pathogen));

      if(allPathogensInData.length !== 1) {
        return "Estimates with 95% CIs";
      }

      const selectedPathogen = allPathogensInData[0];

      return `${convertArboSFtoArbo(selectedPathogen)} study estimates with 95% CIs`;
    },
    titleTooltipText: '95% confidence intervals were calculated using the Clopper-Pearson method if not reported in the source.',
    renderVisualization: ({ data, highlightedDataPoint, hideArbovirusDropdown }) => CountrySeroprevalenceComparisonScatterPlot({ data, highlightedDataPoint, hideArbovirusDropdown })
  },
}

export const arbovirusVisualizationInformationArray = typedObjectEntries(arbovirusVisualizationInformation).map(([_, value]) => value);
export const getUrlParameterFromVisualizationId: GetUrlParameterFromVisualizationIdFunction<
  ArbovirusVisualizationId,
  ArbovirusVisualizationUrlParameter
> = ({ visualizationId }) => ({urlParameter: arbovirusVisualizationInformation[visualizationId].urlParameter})