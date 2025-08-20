import { useCallback, useContext } from "react";
import { cn } from '@/lib/utils';
import { RechartsVisualization } from "../../../../../components/customs/visualizations/recharts-visualization";
import { MersVisualizationId, MersVisualizationInformation, getUrlParameterFromVisualizationId, useVisualizationPageConfiguration } from "../../visualizations/visualization-page-config";
import { MersContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { CamelPopulationDataContext } from "@/contexts/pathogen-context/pathogen-contexts/mers/camel-population-data-context";
import { DashboardSectionId } from "@/app/pathogen/dashboard-enums";

export const MersVisualizationsSection = () => {
  const { mersVisualizationInformation } = useVisualizationPageConfiguration();

  const allVisualizationInformationWithClassnames = [{
    ...mersVisualizationInformation[MersVisualizationId.ESTIMATE_BREAKDOWN_TABLE],
     className: "h-fit"
  }, {
    ...mersVisualizationInformation[MersVisualizationId.REPORTED_EVENT_SUMMARY_OVER_TIME],
     className: "h-full-screen"
  }, {
    ...mersVisualizationInformation[MersVisualizationId.CAMEL_POPULATION_OVER_TIME],
     className: "h-full-screen"
  }, {
    ...mersVisualizationInformation[MersVisualizationId.MEDIAN_SEROPREVALENCE_OVER_TIME],
     className: "h-full-screen"
  }, {
    ...mersVisualizationInformation[MersVisualizationId.ESTIMATES_BY_REGION],
     className: "h-full-screen"
  }, {
    ...mersVisualizationInformation[MersVisualizationId.SUMMARY_BY_REGION],
     className: "h-full-screen"
  }];

  const visualizations = allVisualizationInformationWithClassnames.filter((visualizationInfo) => [
    MersVisualizationId.ESTIMATES_BY_REGION,
    // MersVisualizationId.ESTIMATE_BREAKDOWN_TABLE,
    MersVisualizationId.SUMMARY_BY_REGION,
  ].includes(visualizationInfo.id));

  const { filteredData, faoMersEventData } = useContext(MersContext);
  const { yearlyFaoCamelPopulationData } = useContext(CamelPopulationDataContext);

  const renderVisualizationList = useCallback(<
    TCustomizationModalDropdownOption extends string,
  >(visualizationList: Array<MersVisualizationInformation<TCustomizationModalDropdownOption, any, any, any, any> & {className: string}>) => {
    return visualizationList.map((visualizationInformation) => (
      <RechartsVisualization
        key={visualizationInformation.id}
        data={[
          ...filteredData,
          ...faoMersEventData,
          ...(yearlyFaoCamelPopulationData ?? [])
        ]}
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
  }, [ filteredData, faoMersEventData, yearlyFaoCamelPopulationData ]);

  return (
    <>
      <div className="col-start-1 col-end-3 row-span-1">
        {renderVisualizationList(visualizations)}
      </div>
    </>
  );
}