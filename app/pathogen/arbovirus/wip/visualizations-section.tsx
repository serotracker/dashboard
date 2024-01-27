import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { VisualizationId, addToVisualizationInformation } from "../visualizations/visualizations";
import { ZoomIn } from "lucide-react";

export const VisualizationsSection = () => {
    const router = useRouter();
    const allVisualizationInformationWithHeights = addToVisualizationInformation({
      [VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP]: { height: "h-full" },
      [VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS]: { height: undefined },
      [VisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE ]: { height: undefined },
      [VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION]: { height: "h-full" },
      [VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_ARBOVIRUS]: { height: undefined },
      [VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME]: { height: "h-full 2xl:h-3/4" },
      [VisualizationId.TOP_TEN_COUNTRIES_REPORTING_ESTIMATES_BY_ARBOVIRUS]: { height: "h-full" },
    })

    const visualizationsOnLeftSide = allVisualizationInformationWithHeights.filter((visualizationInfo) => [
      VisualizationId.ESTIMATE_COUNT_BY_WHO_REGION_AND_ARBOVIRUS,
      VisualizationId.ESTIMATE_COUNT_BY_ARBOVIRUS_AND_ANTIBODY_TYPE,
      VisualizationId.CUMULATIVE_ESTIMATE_COUNT_OVER_TIME_BY_SAMPLE_FRAME
    ].includes(visualizationInfo.id));
    const visualizationsOnRightSide = allVisualizationInformationWithHeights.filter((visualizationInfo) => [
      VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION,
      VisualizationId.MEDIAN_SEROPREVALENCE_BY_WHO_REGION_AND_AGE_GROUP
    ].includes(visualizationInfo.id));

    return (
      <>
        <div className="col-start-1 col-end-1 row-span-1">
          {visualizationsOnLeftSide.map((visualization) => (
            <div key={visualization.id}>
              <div className="flex py-4">
                <h3 className="w-full text-center text-lg">{visualization.displayName}</h3>
                <button
                  onClick={() => router.push(`visualizations?visualization=${visualization.urlParameter}&referrerRoute=/pathogen/arbovirus/analyze`)}
                  aria-label="See visualization in fullscreen"
                >
                  <ZoomIn />
                </button>
              </div>
              {visualization.renderVisualization()}
            </div>
          ))}
        </div>
        <div className="col-start-2 col-end-2 row-span-1">
          {visualizationsOnRightSide.map((visualization) => (
            <div key={visualization.id}>
              <div className="flex py-4">
                <h3 className="w-full text-center text-lg">{visualization.displayName}</h3>
                <button
                  onClick={() => router.push(`visualizations?visualization=${visualization.urlParameter}&referrerRoute=/pathogen/arbovirus/analyze`)}
                  aria-label="See visualization in fullscreen"
                >
                  <ZoomIn />
                </button>
              </div>
              {visualization.renderVisualization()}
            </div>
          ))}
        </div>
      </>
    );
}