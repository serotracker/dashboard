import { ButtonConfig, CloseButtonAdditionalButtonConfig, DownloadButtonAdditionalButtonConfig, GetUrlParameterFromVisualizationIdFunction, VisualizationHeader, ZoomInButtonAdditionalButtonConfig } from "./visualization-header";
import { useDownloadVisualization } from "./use-download-visualization";
import { cn } from "@/lib/utils";
import { VisualizationInformation } from "@/app/pathogen/generic-pathogen-visualizations-page";

interface RechartsVisualizationButtonConfig {
  zoomInButton: ButtonConfig<ZoomInButtonAdditionalButtonConfig>;
  downloadButton: ButtonConfig<DownloadButtonAdditionalButtonConfig>;
  closeButton: ButtonConfig<CloseButtonAdditionalButtonConfig>;
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
  highlightedDataPoint: TEstimate | undefined;
  hideArbovirusDropdown: boolean | undefined;
  buttonConfig: RechartsVisualizationButtonConfig;
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

  const downloadButtonId = `${props.visualizationInformation.id}-download-icon`
  const zoomInButtonId = `${props.visualizationInformation.id}-zoom-in-icon`
  const closeButtonId = `${props.visualizationInformation.id}-close-icon`

  return (
    <div className={cn(props.className, 'flex flex-col rounded-md border border-background my-4 p-2')} ref={ref}>
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
          }
        }}
      />
      <div className="flex-1">
        {props.visualizationInformation.renderVisualization({
          data: props.data,
          highlightedDataPoint: props.highlightedDataPoint,
          hideArbovirusDropdown: props.hideArbovirusDropdown
        })}
      </div>
    </div>
  );
};
