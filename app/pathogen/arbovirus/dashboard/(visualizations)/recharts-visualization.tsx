import { VisualizationInformation } from "../../visualizations/visualizations";
import { ButtonConfig, CloseButtonAdditionalButtonConfig, DownloadButtonAdditionalButtonConfig, VisualizationHeader, ZoomInButtonAdditionalButtonConfig } from "./visualization-header";
import { useDownloadVisualization } from "./use-download-visualization";
import { cn } from "@/lib/utils";

interface RechartsVisualizationButtonConfig {
  zoomInButton: ButtonConfig<ZoomInButtonAdditionalButtonConfig>;
  downloadButton: ButtonConfig<DownloadButtonAdditionalButtonConfig>;
  closeButton: ButtonConfig<CloseButtonAdditionalButtonConfig>;
}

interface RechartsVisualizationProps {
  visualizationInformation: VisualizationInformation;
  buttonConfig: RechartsVisualizationButtonConfig;
  className?: string;
}

export const RechartsVisualization = (props: RechartsVisualizationProps) => {
  const { ref, downloadVisualization } = useDownloadVisualization({
    visualizationId: props.visualizationInformation.id
  });

  const downloadButtonId = `${props.visualizationInformation.id}-download-icon`
  const zoomInButtonId = `${props.visualizationInformation.id}-zoom-in-icon`
  const closeButtonId = `${props.visualizationInformation.id}-close-icon`

  return (
    <div className={cn(props.className, 'flex flex-col rounded-md border mx-2 my-4 p-2')} ref={ref}>
      <VisualizationHeader
        visualizationInformation={props.visualizationInformation}
        downloadVisualization={() => downloadVisualization({
          elementIdsToIgnore: [downloadButtonId, zoomInButtonId, closeButtonId]
        })}
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
        {props.visualizationInformation.renderVisualization()}
      </div>
    </div>
  );
};
