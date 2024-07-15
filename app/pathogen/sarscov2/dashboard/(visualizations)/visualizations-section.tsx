import { useCallback, useContext } from "react";
import { cn } from '@/lib/utils';
import { RechartsVisualization } from "../../../../../components/customs/visualizations/recharts-visualization";
import { DashboardSectionId } from "@/app/pathogen/generic-pathogen-dashboard-page";
import { addToVisualizationInformation } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { SarsCov2VisualizationId, SarsCov2VisualizationInformation, getUrlParameterFromVisualizationId, useVisualizationPageConfiguration } from "../../visualizations/visualization-page-config";
import { SarsCov2Context } from "@/contexts/pathogen-context/pathogen-contexts/sarscov2/sc2-context";

export const SarsCov2VisualizationsSection = () => {
  const { sarsCov2VisualizationInformation } = useVisualizationPageConfiguration();

  const allVisualizationInformationWithClassnames = addToVisualizationInformation({
    additionalInformation: {
      [SarsCov2VisualizationId.PUBLISHED_STUDY_COUNT_BY_GBD_REGION]: { className: "h-full-screen" },
      [SarsCov2VisualizationId.CUMULATIVE_NUMBER_OF_SEROSURVEYS_PUBLISHED_OVER_TIME]: { className: "h-full-screen" },
      [SarsCov2VisualizationId.MODELLED_SEROPREVALENCE_BY_WHO_REGION]: { className: "h-full-screen" },
      [SarsCov2VisualizationId.MODELLED_SEROPREVALENCE_BY_COUNTRY]: { className: "h-full-screen" },
      [SarsCov2VisualizationId.COMPARING_SEROPREVALENCE_POSITIVE_CASES_AND_VACCINATIONS]: { className: "h-full-screen" },
      [SarsCov2VisualizationId.NUMBER_OF_INFECTIONS_AT_MIDPOINT_BY_GBD_REGION]: { className: "h-full-screen" }
    },
    allVisualizationInformation: sarsCov2VisualizationInformation
  })

  const visualizations = allVisualizationInformationWithClassnames.filter((visualizationInfo) => [
    SarsCov2VisualizationId.PUBLISHED_STUDY_COUNT_BY_GBD_REGION,
    SarsCov2VisualizationId.CUMULATIVE_NUMBER_OF_SEROSURVEYS_PUBLISHED_OVER_TIME,
    SarsCov2VisualizationId.MODELLED_SEROPREVALENCE_BY_WHO_REGION,
    SarsCov2VisualizationId.COMPARING_SEROPREVALENCE_POSITIVE_CASES_AND_VACCINATIONS,
    SarsCov2VisualizationId.NUMBER_OF_INFECTIONS_AT_MIDPOINT_BY_GBD_REGION
  ].includes(visualizationInfo.id));

  const { filteredData } = useContext(SarsCov2Context);

  const renderVisualizationList = useCallback(<
    TCustomizationModalDropdownOption extends string,
    TVisualizationDisplayNameDropdownOption extends string,
    TSecondVisualizationDisplayNameDropdownOption extends string
  >(visualizationList: Array<SarsCov2VisualizationInformation<TCustomizationModalDropdownOption, TVisualizationDisplayNameDropdownOption, TSecondVisualizationDisplayNameDropdownOption> & {className: string}>) => {
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
            referrerRoute: `/pathogen/sarscov2/dashboard#${DashboardSectionId.VISUALIZATIONS}`
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