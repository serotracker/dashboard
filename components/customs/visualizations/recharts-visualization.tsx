import { useState } from "react";
import { cn } from "@/lib/utils";
import { VisualizationInformation } from "@/app/pathogen/generic-pathogen-visualizations-page";
import {
  ButtonConfig,
  CloseButtonAdditionalButtonConfig,
  DownloadButtonAdditionalButtonConfig,
  GetUrlParameterFromVisualizationIdFunction,
  VisualizationHeader,
  ZoomInButtonAdditionalButtonConfig
} from "./visualization-header";
import { useDownloadVisualization } from "./use-download-visualization";
import { ModalState, useModal } from "@/components/ui/modal/modal";

interface RechartsVisualizationButtonConfig {
  zoomInButton: ButtonConfig<ZoomInButtonAdditionalButtonConfig>;
  downloadButton: ButtonConfig<DownloadButtonAdditionalButtonConfig>;
  closeButton: ButtonConfig<CloseButtonAdditionalButtonConfig>;
}

interface RechartsVisualizationProps<
  TVisualizationId extends string,
  TVisualizationUrlParameter extends string,
  TEstimate extends Record<string, unknown>,
  TDropdownOption extends string
> {
  visualizationInformation: VisualizationInformation<
    TVisualizationId,
    TVisualizationUrlParameter,
    TEstimate,
    TDropdownOption
  >;
  data: TEstimate[];
  highlightedDataPoint: TEstimate | undefined;
  hideArbovirusDropdown: boolean | undefined;
  buttonConfig: RechartsVisualizationButtonConfig;
  className?: string;
  getUrlParameterFromVisualizationId: GetUrlParameterFromVisualizationIdFunction<TVisualizationId, TVisualizationUrlParameter>;
}

export const RechartsVisualization = <
  TVisualizationId extends string,
  TVisualizationUrlParameter extends string,
  TEstimate extends Record<string, unknown>,
  TDropdownOption extends string
>(
  props: RechartsVisualizationProps<
    TVisualizationId,
    TVisualizationUrlParameter,
    TEstimate,
    TDropdownOption
  >
) => {
  const { ref, downloadVisualization } = useDownloadVisualization({
    visualizationId: props.visualizationInformation.id
  });

  const customizationModal = useModal(props.visualizationInformation.customizationModalConfiguration ?? {
    initialModalState: ModalState.CLOSED,
    headerText: 'Customize Visualization',
    disabled: true as const,
    modalType: undefined
  });

  const downloadButtonId = `${props.visualizationInformation.id}-download-icon`
  const zoomInButtonId = `${props.visualizationInformation.id}-zoom-in-icon`
  const closeButtonId = `${props.visualizationInformation.id}-close-icon`
  const customizeButtonId = `${props.visualizationInformation.id}-customize-icon`

  return (
    <div className={cn(props.className, 'flex flex-col rounded-md border border-background my-4 p-2')} ref={ref}>
      <VisualizationHeader
        visualizationInformation={props.visualizationInformation}
        data={props.data}
        downloadVisualization={() => downloadVisualization({
          elementIdsToIgnore: [downloadButtonId, zoomInButtonId, closeButtonId, customizeButtonId]
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
            onClick: () => customizationModal.setModalState(ModalState.OPENED),
            id: customizeButtonId
          } : {
            enabled: false,
            id: customizeButtonId
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
      <customizationModal.modal />
    </div>
  );
};
