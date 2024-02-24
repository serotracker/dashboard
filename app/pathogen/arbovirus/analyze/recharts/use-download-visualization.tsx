import { MutableRefObject, useRef } from 'react';
import domtoimage from "dom-to-image";
import fileDownload from "js-file-download";
import { VisualizationId } from '../../visualizations/visualizations';

interface UseDownloadVisualizationInput {
  visualizationId: VisualizationId;
}

interface UseDownloadVisualizationOutput {
  ref: MutableRefObject<HTMLDivElement | null>;
  downloadVisualization: () => void;
}

export const useDownloadVisualization = (input: UseDownloadVisualizationInput): UseDownloadVisualizationOutput => {
  const ref = useRef<HTMLDivElement>(null);

  const downloadVisualization = () => {
    if(!ref.current) {
      throw Error("Unable to generate image for visualization.")
    }

    domtoimage
      .toBlob(ref.current, {
        bgcolor: "#FFFFFF",
        filter: () => true
      })
      .then(function (blob) {
        fileDownload(blob, `${input.visualizationId.toLowerCase().replaceAll('_', '-')}.png`);
      });
  }

  return {
    ref,
    downloadVisualization
  }
}