import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { VisualizationId, VisualizationInformation, addToVisualizationInformation } from "../visualizations/visualizations";
import { cn } from '@/lib/utils';
import { RechartsVisualization } from "../analyze/recharts/recharts-visualization";

export const VisualizationsSection = () => {
    const router = useRouter();
    const allVisualizationInformationWithClassnames = addToVisualizationInformation({
      [VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP]: { className: "h-full" },
      [VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS]: { className: "h-1/2" },
      [VisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE ]: { className: "h-1/2" },
      [VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION]: { className: "h-full" },
      [VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_ARBOVIRUS]: { className: "h-1/2" },
      [VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME]: { className: "h-full 2xl:h-3/4" },
      [VisualizationId.TOP_TEN_COUNTRIES_REPORTING_ESTIMATES_BY_ARBOVIRUS]: { className: "h-full" },
      [VisualizationId.CHANGE_IN_MEDIAN_SEROPREVALENCE_OVER_TIME]: { className: "h-full" },
    })

    const visualizationsOnLeftSide = allVisualizationInformationWithClassnames.filter((visualizationInfo) => [
      VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS,
      VisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE,
      VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME
    ].includes(visualizationInfo.id));
    const visualizationsOnRightSide = allVisualizationInformationWithClassnames.filter((visualizationInfo) => [
      VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION,
      VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP
    ].includes(visualizationInfo.id));

    const renderVisualizationList = useCallback((visualizationList: Array<VisualizationInformation & {className: string}>) => {
      return visualizationList.map((visualizationInformation, index) => (
        <div key={visualizationInformation.id} className={cn(visualizationInformation.className, index != 0 ? 'mt-14' : undefined)}>
          <RechartsVisualization visualizationInformation={visualizationInformation} />
        </div>
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