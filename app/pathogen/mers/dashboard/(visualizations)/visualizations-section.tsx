import { useCallback, useContext } from "react";
import { cn } from '@/lib/utils';
import { RechartsVisualization } from "../../../../../components/customs/visualizations/recharts-visualization";
import { DashboardSectionId } from "@/app/pathogen/generic-pathogen-dashboard-page";
import { addToVisualizationInformation } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { MersVisualizationId, MersVisualizationInformation, getUrlParameterFromVisualizationId, mersVisualizationInformation } from "../../visualizations/visualization-page-config";
import { MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";

export const MersVisualizationsSection = () => {
  const allVisualizationInformationWithClassnames = addToVisualizationInformation({
    additionalInformation: {
      [MersVisualizationId.PLACEHOLDER]: { className: "h-full-screen" },
    },
    allVisualizationInformation: mersVisualizationInformation
  })

  const visualizations = allVisualizationInformationWithClassnames.filter((visualizationInfo) => [
    MersVisualizationId.PLACEHOLDER
  ].includes(visualizationInfo.id));

  const { filteredData } = useContext(MersContext);

  const renderVisualizationList = useCallback((visualizationList: Array<MersVisualizationInformation & {className: string}>) => {
    return visualizationList.map((visualizationInformation) => (
      <RechartsVisualization
        key={visualizationInformation.id}
        data={filteredData}
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
            referrerRoute: `/pathogen/mers/dashboard#${DashboardSectionId.VISUALIZATIONS}`
          },
          closeButton: {
            enabled: false
          }
        }}
        getUrlParameterFromVisualizationId={getUrlParameterFromVisualizationId}
      />
    ));
  }, [filteredData]);

  return (
    <>
      <div className="col-start-1 col-end-3 row-span-1">
        {renderVisualizationList(visualizations)}
      </div>
    </>
  );
}