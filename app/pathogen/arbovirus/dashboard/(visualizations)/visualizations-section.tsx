import { useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import { VisualizationId, VisualizationInformation, addToVisualizationInformation } from "../../visualizations/visualizations";
import { ZoomIn } from "lucide-react";
import { cn } from '@/lib/utils';
import { ArbovirusPageSectionId } from "../../../../constants";
import { ArboContext } from "@/contexts/arbo-context/arbo-context";
import { useArboDataInsights } from "@/hooks/useArboDataInsights";
import { RechartsVisualization } from "./recharts-visualization";

export const VisualizationsSection = () => {
  const { filteredData } = useContext(ArboContext);
  const { getNumberOfUniqueValuesForField } = useArboDataInsights();

  const areLessThanTwoWHORegionsPresentInData = getNumberOfUniqueValuesForField({
    filteredData: filteredData.filter((dataPoint) => !!dataPoint.whoRegion),
    fieldName: 'whoRegion'
  }) < 2;

  const allVisualizationInformationWithClassnames = addToVisualizationInformation({
<<<<<<< HEAD
    [VisualizationId.CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME]: { className: "h-full-screen" },
    [VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION]: { className: "h-full-screen" },
    [VisualizationId.MEDIAN_SEROPREVALENCE_BY_UN_REGION]: { className: "h-full-screen" },
=======
>>>>>>> 90b856e (Improved UI for dashboard)
    [VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS]: { className: "h-half-screen" },
    [VisualizationId.ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS]: { className: "h-half-screen" },
    [VisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE ]: { className: "h-half-screen" },
    [VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_ARBOVIRUS]: { className: "h-half-screen" },
    [VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME]: { className: "h-full-screen 2xl:h-3/4-screen" },
    [VisualizationId.TOP_TEN_COUNTRIES_REPORTING_ESTIMATES_BY_ARBOVIRUS]: { className: "h-full-screen" },
<<<<<<< HEAD
=======
    [VisualizationId.CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME]: { className: "h-full-screen" },
>>>>>>> 90b856e (Improved UI for dashboard)
    [VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP]: { className: "h-full-screen" },
  })

  const visualizationsOnLeftSide = allVisualizationInformationWithClassnames.filter((visualizationInfo) => [
    areLessThanTwoWHORegionsPresentInData ? VisualizationId.ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS : VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS,
    VisualizationId.CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME,
    VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME
  ].includes(visualizationInfo.id));
  const visualizationsOnRightSide = allVisualizationInformationWithClassnames.filter((visualizationInfo) => [
    areLessThanTwoWHORegionsPresentInData ? VisualizationId.MEDIAN_SEROPREVALENCE_BY_UN_REGION : VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION,
    VisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE,
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
      <div className="col-start-1 col-end-1 row-span-1">
        {renderVisualizationList(visualizationsOnLeftSide)}
      </div>
      <div className="col-start-2 col-end-2 row-span-1">
        {renderVisualizationList(visualizationsOnRightSide)}
      </div>
    </>
  );
}