import { useState } from "react";
import {
  ButtonConfig,
  CloseButtonAdditionalButtonConfig,
  CustomizeButtonAdditionalButtonConfig,
  DownloadButtonAdditionalButtonConfig,
  GetUrlParameterFromVisualizationIdFunction,
  VisualizationHeader,
  ZoomInButtonAdditionalButtonConfig
} from "./visualization-header";
import { useDownloadVisualization } from "./use-download-visualization";
import { cn } from "@/lib/utils";
import { VisualizationInformation } from "@/app/pathogen/generic-pathogen-visualizations-page";
import { X } from "lucide-react";

interface RechartsVisualizationButtonConfig {
  zoomInButton: ButtonConfig<ZoomInButtonAdditionalButtonConfig>;
  downloadButton: ButtonConfig<DownloadButtonAdditionalButtonConfig>;
  closeButton: ButtonConfig<CloseButtonAdditionalButtonConfig>;
  customizeButton: ButtonConfig<CustomizeButtonAdditionalButtonConfig>;
}

interface RechartsVisualizationProps<
  TVisualizationId extends string,
  TVisualizationUrlParameter extends string,
  TEstimate extends Record<string, unknown>
> {
  visualizationInformation: VisualizationInformation<
    TVisualizationId,
    TVisualizationUrlParameter,
    TEstimate
  >;
  data: TEstimate[];
  buttonConfig: Omit<RechartsVisualizationButtonConfig, 'customizeButton'>;
  className?: string;
  getUrlParameterFromVisualizationId: GetUrlParameterFromVisualizationIdFunction<TVisualizationId, TVisualizationUrlParameter>;
}

export const RechartsVisualization = <
  TVisualizationId extends string,
  TVisualizationUrlParameter extends string,
  TEstimate extends Record<string, unknown>
>(
  props: RechartsVisualizationProps<
    TVisualizationId,
    TVisualizationUrlParameter,
    TEstimate
  >
) => {
  const { ref, downloadVisualization } = useDownloadVisualization({
    visualizationId: props.visualizationInformation.id
  });

  const [
    customizationModalOpen,
    setCustomizationModalOpen
  ] = useState<boolean>(false);

  const downloadButtonId = `${props.visualizationInformation.id}-download-icon`
  const zoomInButtonId = `${props.visualizationInformation.id}-zoom-in-icon`
  const closeButtonId = `${props.visualizationInformation.id}-close-icon`
  const customizeButtonId = `${props.visualizationInformation.id}-customize-icon`

  return (
    <div className={cn(props.className, 'flex flex-col rounded-md border border-background my-4 p-2 relative')} ref={ref}>
      <VisualizationHeader
        visualizationInformation={props.visualizationInformation}
        data={props.data}
        downloadVisualization={() => downloadVisualization({
          elementIdsToIgnore: [downloadButtonId, zoomInButtonId, closeButtonId]
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
          customizeButton: props.visualizationInformation.renderCustomizationModalContent ? {
            enabled: true,
            onClick: () => setCustomizationModalOpen(true),
            id: customizeButtonId
          } : {
            enabled: false,
            id: customizeButtonId
          }
        }}
      />
      <div className="flex-1 overflow-y-hidden">
        {props.visualizationInformation.renderVisualization()}
      </div>
      {(customizationModalOpen && props.visualizationInformation.renderCustomizationModalContent) && (
        <div className="absolute w-full h-full top-0 left-0 p-4 flex items-center justify-center bg-modal-background">
          <div className="w-full lg:w-1/2 bg-white">
            <div className="w-full flex justify-between p-2">
              <div/>
              <button
                className="mr-2 p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setCustomizationModalOpen(false)}
                aria-label="Close Customization Modal"
                title="Close Customization Modal"
              >
                <X />
              </button>
            </div>
            <props.visualizationInformation.renderCustomizationModalContent/>
          </div>
        </div>
      )}
    </div>
  );
};
