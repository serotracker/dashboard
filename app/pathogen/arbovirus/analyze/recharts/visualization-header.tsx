import { ZoomIn, DownloadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  VisualizationInformation,
  getVisualizationInformationFromVisualizationId,
} from "../../visualizations/visualizations";

interface VisualizationHeaderProps {
  visualizationInformation: VisualizationInformation;
  downloadVisualization: () => void;
}

export const VisualizationHeader = (props: VisualizationHeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex py-4">
      <h3 className="w-full text-center text-lg">
        {props.visualizationInformation.displayName}
      </h3>
      <button
        className="mr-4"
        onClick={() => props.downloadVisualization()}
        aria-label="Download visualization"
      >
        <DownloadCloud />
      </button>
      <button
        onClick={() =>
          router.push(`visualizations?visualization=${getVisualizationInformationFromVisualizationId({ visualizationId: props.visualizationInformation.id }).urlParameter}&referrerRoute=/pathogen/arbovirus/dashboard`)
        }
        aria-label="See visualization in fullscreen"
      >
        <ZoomIn />
      </button>
    </div>
  );
};
