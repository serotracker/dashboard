import { MutableRefObject, useRef, useState } from 'react';
import domtoimage from "dom-to-image";
import fileDownload from "js-file-download";
import { VisualizationId } from '../../visualizations/visualizations';

interface UseDownloadVisualizationInput {
  visualizationId: VisualizationId;
}

interface UseDownloadVisualizationOutput {
  ref: MutableRefObject<HTMLDivElement | null>;
  downloadVisualization: (input: DownloadVisualizationInput) => void;
}

interface DownloadVisualizationInput {
  elementIdsToIgnore: string[]
}

export const useDownloadVisualization = (input: UseDownloadVisualizationInput): UseDownloadVisualizationOutput => {
  const ref = useRef<HTMLDivElement>(null);

  const downloadVisualization = (functionInput: DownloadVisualizationInput) => {
    if(!ref.current) {
      throw Error("Unable to generate image for visualization.")
    }

    domtoimage
      .toBlob(ref.current, {
        bgcolor: "#FFFFFF",
        filter: (input) => {
          if(functionInput.elementIdsToIgnore.includes((input as HTMLElement)['id'])) {
            return false;
          }

          const elementClassnameString = (input as HTMLElement)['className'] ?? ''
          const elementClassnames = typeof elementClassnameString === 'string' && !!elementClassnameString ? elementClassnameString.split(" ") : []

          if(elementClassnames.includes('ignore-for-visualization-download')) {
            return false;
          }

          return true;
        }
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