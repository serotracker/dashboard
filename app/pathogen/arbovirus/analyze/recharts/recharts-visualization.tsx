import { VisualizationInformation } from "../../visualizations/visualizations";
import { VisualizationHeader } from "./visualization-header";
import { useDownloadVisualization } from "./use-download-visualization";

interface RechartsVisualizationProps {
  visualizationInformation: VisualizationInformation;
}

export const RechartsVisualization = (props: RechartsVisualizationProps) => {
  const { ref, downloadVisualization } = useDownloadVisualization({
    visualizationId: props.visualizationInformation.id
  });

  return (
    <div className='h-full' ref={ref}>
      <VisualizationHeader
        visualizationInformation={props.visualizationInformation}
        downloadVisualization={() => downloadVisualization()}
      />
      {props.visualizationInformation.renderVisualization()}
    </div>
  );
};
