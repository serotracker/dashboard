import { useState } from "react";
import { ButtonConfig, CloseButtonAdditionalButtonConfig, DownloadButtonAdditionalButtonConfig, GetUrlParameterFromVisualizationIdFunction, VisualizationHeader, ZoomInButtonAdditionalButtonConfig } from "./visualization-header";
import { useDownloadVisualization } from "./use-download-visualization";
import { cn } from "@/lib/utils";
import { PaginationConfiguration, VisualizationInformation } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { ModalState, ModalWrapper } from "@/components/ui/modal/modal";

interface RechartsVisualizationButtonConfig {
  zoomInButton: ButtonConfig<ZoomInButtonAdditionalButtonConfig>;
  downloadButton: ButtonConfig<DownloadButtonAdditionalButtonConfig>;
  closeButton: ButtonConfig<CloseButtonAdditionalButtonConfig>;
}

interface RechartsVisualizationProps<
  TVisualizationId extends string,
  TVisualizationUrlParameter extends string,
  TEstimate extends Record<string, unknown>,
  TCustomizationModalDropdownOption extends string,
  TVisualizationDisplayNameDropdownOption extends string,
  TSecondVisualizationDisplayNameDropdownOption extends string,
  TThirdVisualizationDisplayNameDropdownOption extends string
> {
  visualizationInformation: VisualizationInformation<
    TVisualizationId,
    TVisualizationUrlParameter,
    TEstimate,
    TCustomizationModalDropdownOption,
    TVisualizationDisplayNameDropdownOption,
    TSecondVisualizationDisplayNameDropdownOption,
    TThirdVisualizationDisplayNameDropdownOption
  >;
  data: TEstimate[];
  highlightedDataPoint: TEstimate | undefined;
  hideArbovirusDropdown: boolean | undefined;
  buttonConfig: RechartsVisualizationButtonConfig;
  paginationConfiguration?: PaginationConfiguration;
  className?: string;
  getUrlParameterFromVisualizationId: GetUrlParameterFromVisualizationIdFunction<TVisualizationId, TVisualizationUrlParameter>;
}

export const RechartsVisualization = <
  TVisualizationId extends string,
  TVisualizationUrlParameter extends string,
  TEstimate extends Record<string, unknown>,
  TCustomizationModalDropdownOption extends string,
  TVisualizationDisplayNameDropdownOption extends string,
  TSecondVisualizationDisplayNameDropdownOption extends string,
  TThirdVisualizationDisplayNameDropdownOption extends string
>(
  props: RechartsVisualizationProps<
    TVisualizationId,
    TVisualizationUrlParameter,
    TEstimate,
    TCustomizationModalDropdownOption,
    TVisualizationDisplayNameDropdownOption,
    TSecondVisualizationDisplayNameDropdownOption,
    TThirdVisualizationDisplayNameDropdownOption
  >
) => {
  const { ref, downloadVisualization } = useDownloadVisualization({
    visualizationId: props.visualizationInformation.id
  });

  const { paginationConfiguration } = props.visualizationInformation;

  const [ customizationModalState, setCustomizationModalState ] = useState<ModalState>(
    props.visualizationInformation.customizationModalConfiguration?.initialModalState ?? ModalState.CLOSED
  );

  const downloadButtonId = `${props.visualizationInformation.id}-download-icon`
  const zoomInButtonId = `${props.visualizationInformation.id}-zoom-in-icon`
  const closeButtonId = `${props.visualizationInformation.id}-close-icon`
  const customizeButtonId = `${props.visualizationInformation.id}-customize-icon`
  const leftArrowButtonId = `${props.visualizationInformation.id}-left-arrow-button-icon`
  const rightArrowButtonId = `${props.visualizationInformation.id}-right-arrow-button-icon`

  return (
    <div className={cn(props.className, 'flex flex-col rounded-md border border-background mb-4 p-2')} ref={ref}>
      <VisualizationHeader
        visualizationInformation={props.visualizationInformation}
        data={props.data}
        downloadVisualization={() => downloadVisualization({
          elementIdsToIgnore: [downloadButtonId, zoomInButtonId, closeButtonId, customizeButtonId, leftArrowButtonId, rightArrowButtonId]
        })}
        getUrlParameterFromVisualizationId={props.getUrlParameterFromVisualizationId}
        buttonConfiguration={{
          zoomInButton: {
            ...props.buttonConfig.zoomInButton,
            id: zoomInButtonId
          },
          downloadButton: {
            ...props.buttonConfig.downloadButton,
            id: downloadButtonId
          },
          closeButton: {
            ...props.buttonConfig.closeButton,
            id: closeButtonId
          },
          customizeButton: props.visualizationInformation.customizationModalConfiguration ? {
            enabled: true,
            onClick: () => setCustomizationModalState(ModalState.OPENED),
            id: customizeButtonId
          } : {
            enabled: false,
            id: customizeButtonId
          },
          leftArrowButton: paginationConfiguration && paginationConfiguration.numberOfPagesAvailable > 1 ? {
            enabled: true,
            onClick: () => {
              paginationConfiguration.setCurrentPageIndex(paginationConfiguration.currentPageIndex - 1);
            },
            disabledButVisible: paginationConfiguration.currentPageIndex === 0,
            id: leftArrowButtonId
          } : {
            enabled: false,
            id: leftArrowButtonId
          },
          rightArrowButton: paginationConfiguration && paginationConfiguration.numberOfPagesAvailable > 1 ? {
            enabled: true,
            onClick: () => {
              paginationConfiguration.setCurrentPageIndex(paginationConfiguration.currentPageIndex + 1);
            },
            disabledButVisible: paginationConfiguration.currentPageIndex >= (paginationConfiguration.numberOfPagesAvailable - 1),
            id: rightArrowButtonId
          } : {
            enabled: false,
            id: rightArrowButtonId
          }
        }}
      />
      <div className="flex-1 overflow-y-hidden">
        {props.visualizationInformation.renderVisualization({
          data: props.data,
          highlightedDataPoint: props.highlightedDataPoint,
          hideArbovirusDropdown: props.hideArbovirusDropdown
        })}
      </div>
      <ModalWrapper
        modalState={customizationModalState}
        setModalState={setCustomizationModalState}
        {...props.visualizationInformation.customizationModalConfiguration ?? {
          initialModalState: ModalState.CLOSED,
          disabled: true as const,
          modalType: undefined
        }}
      />
    </div>
  );
};
