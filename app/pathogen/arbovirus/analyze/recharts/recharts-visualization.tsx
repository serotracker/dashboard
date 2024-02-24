import { VisualizationInformation } from "../../visualizations/visualizations";
import { VisualizationHeader } from "./visualization-header";
import { useDownloadVisualization } from "./use-download-visualization";

interface RechartsVisualizationProps {
  visualizationInformation: VisualizationInformation;
  className?: string;
}

export const RechartsVisualization = (props: RechartsVisualizationProps) => {
  const { ref, downloadVisualization } = useDownloadVisualization({
    visualizationId: props.visualizationInformation.id
  });

  const downloadButtonId = `${props.visualizationInformation.id}-download-icon`
  const zoomInButtonId = `${props.visualizationInformation.id}-zoom-in-icon`

  return (
    <div className={props.className} ref={ref}>
      <VisualizationHeader
        visualizationInformation={props.visualizationInformation}
        downloadVisualization={() => downloadVisualization({
          elementIdsToIgnore: [downloadButtonId, zoomInButtonId]
        })}
        zoomInButtonId={zoomInButtonId}
        downloadButtonId={downloadButtonId}
      />
      {props.visualizationInformation.renderVisualization()}
    </div>
  );
};
