import { useCallback } from "react";
import { cn } from '@/lib/utils';
import { useArboDataInsights } from "@/hooks/arbovirus/useArboDataInsights";
import { RechartsVisualization } from "../../../../../components/customs/visualizations/recharts-visualization";
import { addToVisualizationInformation } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { ArbovirusVisualizationId, ArbovirusVisualizationInformation, getUrlParameterFromVisualizationId, useVisualizationPageConfiguration } from "../../visualizations/visualization-page-config";
import { useGroupedArbovirusEstimateData } from "../../use-arbo-primary-estimate-data";
import { DashboardSectionId } from "@/app/pathogen/dashboard-enums";

export const ArbovirusVisualizationsSection = () => {
  const { filteredData } = useGroupedArbovirusEstimateData().primaryEstimateData;
  const { filteredData: filteredAgeGroupEstimateData } = useGroupedArbovirusEstimateData().ageGroupEstimateData;
  const { getNumberOfUniqueValuesForField } = useArboDataInsights();
  const { arbovirusVisualizationInformation } = useVisualizationPageConfiguration();

  const areLessThanTwoWHORegionsPresentInData = getNumberOfUniqueValuesForField({
    filteredData: filteredData.filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'whoRegion'> & {whoRegion: NonNullable<typeof dataPoint['whoRegion']>} => !!dataPoint.whoRegion),
    fieldName: 'whoRegion'
  }) < 2;

  const allVisualizationInformationWithClassnames = addToVisualizationInformation({
    additionalInformation: {
      [ArbovirusVisualizationId.CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME]: { className: "h-full-screen" },
      [ArbovirusVisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION]: { className: "h-full-screen" },
      [ArbovirusVisualizationId.MEDIAN_SEROPREVALENCE_BY_UN_REGION]: { className: "h-full-screen" },
      [ArbovirusVisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS]: { className: "h-half-screen" },
      [ArbovirusVisualizationId.ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS]: { className: "h-half-screen" },
      [ArbovirusVisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE ]: { className: "h-half-screen" },
      [ArbovirusVisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_ARBOVIRUS]: { className: "h-half-screen" },
      [ArbovirusVisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME]: { className: "h-full-screen 2xl:h-3/4-screen" },
      [ArbovirusVisualizationId.TOP_TEN_COUNTRIES_REPORTING_ESTIMATES_BY_ARBOVIRUS]: { className: "h-full-screen" },
      [ArbovirusVisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP]: { className: "" },
      [ArbovirusVisualizationId.COUNTRY_SEROPREVALENCE_COMPARISON_SCATTER_PLOT]: {className: "h-full-screen"}
    },
    allVisualizationInformation: arbovirusVisualizationInformation
  })

  const visualizationsOnLeftSide = allVisualizationInformationWithClassnames.filter((visualizationInfo) => [
    areLessThanTwoWHORegionsPresentInData ? ArbovirusVisualizationId.ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS : ArbovirusVisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS,
    ArbovirusVisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME
  ].includes(visualizationInfo.id));
  const visualizationsOnRightSide = allVisualizationInformationWithClassnames.filter((visualizationInfo) => [
    ArbovirusVisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE,
    ArbovirusVisualizationId.COUNTRY_SEROPREVALENCE_COMPARISON_SCATTER_PLOT
  ].includes(visualizationInfo.id));
  const fullscreenVisualizationsAtTheBottom = allVisualizationInformationWithClassnames.filter((visualizationInfo) => [
    areLessThanTwoWHORegionsPresentInData ? ArbovirusVisualizationId.MEDIAN_SEROPREVALENCE_BY_UN_REGION : ArbovirusVisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION,
    ArbovirusVisualizationId.CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME,
    ArbovirusVisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP
  ].includes(visualizationInfo.id));

  const renderVisualizationList = useCallback(<
    TCustomizationModalDropdownOption extends string,
    TVisualizationDisplayNameDropdownOption extends string,
    TSecondVisualizationDisplayNameDropdownOption extends string,
    TThirdVisualizationDisplayNameDropdownOption extends string,
    TFourthVisualizationDisplayNameDropdownOption extends string
  >(visualizationList: Array<ArbovirusVisualizationInformation<TCustomizationModalDropdownOption, TVisualizationDisplayNameDropdownOption, TSecondVisualizationDisplayNameDropdownOption, TThirdVisualizationDisplayNameDropdownOption, TFourthVisualizationDisplayNameDropdownOption> & {className: string}>) => {
    return visualizationList.map((visualizationInformation) => (
      <RechartsVisualization
        key={visualizationInformation.id}
        data={ visualizationInformation.id !== ArbovirusVisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP ? filteredData : filteredAgeGroupEstimateData}
        highlightedDataPoint={undefined}
        hideArbovirusDropdown={undefined}
        visualizationInformation={visualizationInformation}
        className={cn(visualizationInformation.className, 'pb-14')}
        buttonConfig={{
          downloadButton: {
            enabled: true,
          },
          zoomInButton: {
            enabled: true,
            referrerRoute: `/pathogen/arbovirus/dashboard#${DashboardSectionId.VISUALIZATIONS}`
          },
          closeButton: {
            enabled: false
          }
        }}
        getUrlParameterFromVisualizationId={getUrlParameterFromVisualizationId}
      />
    ));
  }, [filteredData, filteredAgeGroupEstimateData ]);

  return (
    <>
      <div className="col-span-2 lg:col-span-1 lg:col-start-1 lg:col-end-1 row-span-2 lg:row-span-1">
        {renderVisualizationList(visualizationsOnLeftSide)}
      </div>
      <div className="col-span-2 lg:col-span-1 lg:col-start-2 lg:col-end-2 row-span-2 lg:row-span-1">
        {renderVisualizationList(visualizationsOnRightSide)}
      </div>
      <div className="col-start-1 col-end-3 row-span-1">
        {renderVisualizationList(fullscreenVisualizationsAtTheBottom)}
      </div>
    </>
  );
}