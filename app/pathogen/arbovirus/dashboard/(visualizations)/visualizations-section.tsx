import { useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import { VisualizationId, VisualizationInformation, addToVisualizationInformation } from "../../visualizations/visualizations";
import { ZoomIn } from "lucide-react";
import { cn } from '@/lib/utils';
import { ArbovirusPageSectionId } from "../../../../constants";
import { useArboDataInsights } from "@/hooks/useArboDataInsights";
import { RechartsVisualization } from "./recharts-visualization";
import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";

export const VisualizationsSection = () => {
  const { filteredData } = useContext(ArboContext);
  const { getNumberOfUniqueValuesForField } = useArboDataInsights();

  const areLessThanTwoWHORegionsPresentInData = getNumberOfUniqueValuesForField({
    filteredData: filteredData.filter((dataPoint) => !!dataPoint.whoRegion),
    fieldName: 'whoRegion'
  }) < 2;

  const allVisualizationInformationWithClassnames = addToVisualizationInformation({
    [VisualizationId.CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME]: { className: "h-full-screen" },
    [VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION]: { className: "h-full-screen" },
    [VisualizationId.MEDIAN_SEROPREVALENCE_BY_UN_REGION]: { className: "h-full-screen" },
    [VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS]: { className: "h-half-screen" },
    [VisualizationId.ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS]: { className: "h-half-screen" },
    [VisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE ]: { className: "h-half-screen" },
    [VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_ARBOVIRUS]: { className: "h-half-screen" },
    [VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME]: { className: "h-full-screen 2xl:h-3/4-screen" },
    [VisualizationId.TOP_TEN_COUNTRIES_REPORTING_ESTIMATES_BY_ARBOVIRUS]: { className: "h-full-screen" },
    [VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP]: { className: "" },
    [VisualizationId.COUNTRY_SEROPREVALENCE_COMPARISON_SCATTER_PLOT]: {className: "h-full-screen"}
  })

  const visualizationsOnLeftSide = allVisualizationInformationWithClassnames.filter((visualizationInfo) => [
    areLessThanTwoWHORegionsPresentInData ? VisualizationId.ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS : VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS,
    VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME
  ].includes(visualizationInfo.id));
  const visualizationsOnRightSide = allVisualizationInformationWithClassnames.filter((visualizationInfo) => [
    VisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE,
    VisualizationId.COUNTRY_SEROPREVALENCE_COMPARISON_SCATTER_PLOT
  ].includes(visualizationInfo.id));
  const fullscreenVisualizationsAtTheBottom = allVisualizationInformationWithClassnames.filter((visualizationInfo) => [
    areLessThanTwoWHORegionsPresentInData ? VisualizationId.MEDIAN_SEROPREVALENCE_BY_UN_REGION : VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION,
    VisualizationId.CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME,
    VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP
  ].includes(visualizationInfo.id));

  const renderVisualizationList = useCallback((visualizationList: Array<VisualizationInformation & {className: string}>) => {
    return visualizationList.map((visualizationInformation) => (
      <RechartsVisualization
        key={visualizationInformation.id}
        visualizationInformation={visualizationInformation}
        className={cn(visualizationInformation.className, 'pb-14')}
        buttonConfig={{
          downloadButton: {
            enabled: true,
          },
          zoomInButton: {
            enabled: true,
            referrerRoute: `/pathogen/arbovirus/dashboard#${ArbovirusPageSectionId.VISUALIZATIONS}`
          },
          closeButton: {
            enabled: false
          }
        }}
      />
    ));
  }, []);

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