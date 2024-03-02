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

  const router = useRouter();
  const allVisualizationInformationWithClassnames = addToVisualizationInformation({
    [VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP]: { className: "h-full" },
    [VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS]: { className: "h-1/2" },
    [VisualizationId.ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS]: { className: "h-1/2" },
    [VisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE ]: { className: "h-1/2" },
    [VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION]: { className: "h-full" },
    [VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_ARBOVIRUS]: { className: "h-1/2" },
    [VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME]: { className: "h-full 2xl:h-3/4" },
    [VisualizationId.TOP_TEN_COUNTRIES_REPORTING_ESTIMATES_BY_ARBOVIRUS]: { className: "h-full" },
    [VisualizationId.CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME]: { className: "h-full" },
  })

  const visualizationsOnLeftSide = allVisualizationInformationWithClassnames.filter((visualizationInfo) => [
    areLessThanTwoWHORegionsPresentInData ? VisualizationId.ESTIMATE_COUNT_BY_UN_REGION_AND_ARBOVIRUS : VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS,
    VisualizationId.CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME,
    VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME
  ].includes(visualizationInfo.id));
  const visualizationsOnRightSide = allVisualizationInformationWithClassnames.filter((visualizationInfo) => [
    VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION,
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
            referrerRoute: `/pathogen/arbovirus/wip#${ArbovirusPageSectionId.VISUALIZATIONS}`
          },
          closeButton: {
            enabled: false
          }
        }}
      />
    ));
  }, [ router ]);

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