import { useCallback, useContext } from "react";
import { cn } from '@/lib/utils';
import { RechartsVisualization } from "../../../../../components/customs/visualizations/recharts-visualization";
import { DashboardSectionId } from "@/app/pathogen/generic-pathogen-dashboard-page";
import { addToVisualizationInformation } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { SarsCov2VisualizationId, SarsCov2VisualizationInformation, getUrlParameterFromVisualizationId, sarsCov2VisualizationInformation } from "../../visualizations/visualization-page-config";

export const SarsCov2VisualizationsSection = () => {
  const allVisualizationInformationWithClassnames = addToVisualizationInformation({
    additionalInformation: {
      [SarsCov2VisualizationId.PUBLISHED_STUDY_COUNT_BY_GBD_REGION]: { className: "h-full-screen" },
    },
    allVisualizationInformation: sarsCov2VisualizationInformation
  })

  const visualizationsOnLeftSide = allVisualizationInformationWithClassnames.filter((visualizationInfo) => [
    SarsCov2VisualizationId.PUBLISHED_STUDY_COUNT_BY_GBD_REGION
  ].includes(visualizationInfo.id));

  const renderVisualizationList = useCallback((visualizationList: Array<SarsCov2VisualizationInformation & {className: string}>) => {
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
            referrerRoute: `/pathogen/sarscov2/dashboard#${DashboardSectionId.VISUALIZATIONS}`
          },
          closeButton: {
            enabled: false
          }
        }}
        getUrlParameterFromVisualizationId={getUrlParameterFromVisualizationId}
      />
    ));
  }, []);

  return (
    <>
      <div className="col-span-2 lg:col-span-1 lg:col-start-1 lg:col-end-1 row-span-2 lg:row-span-1">
        {renderVisualizationList(visualizationsOnLeftSide)}
      </div>
    </>
  );
}