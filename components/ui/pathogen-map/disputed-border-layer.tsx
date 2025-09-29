import { useMemo } from "react";
import { Layer, Source } from "react-map-gl";
import { MapSymbology } from "@/app/pathogen/sarscov2/dashboard/(map)/map-config";

export interface DisputedBorderLayerProps {
  mapZoomLevel: number;
  positionedUnderLayerWithId: string | undefined;
}

const zoomLevelToLineDashArray: Record<number, [number, number] | undefined> = {
  2: [1, 1],
  3: [1, 1],
  4: [2, 2],
  5: [2, 2],
  6: [3, 3],
  7: [3, 3],
}

const zoomLevelToLineWidthArray: Record<number, number | undefined> = {
  2: 1,
  3: 1,
  4: 2,
  5: 2,
  6: 2,
  7: 2,
}

export const DisputedBorderLayer = (props: DisputedBorderLayerProps) => {
  const { mapZoomLevel } = props;

  const lineDashArray = useMemo(() => {
    return zoomLevelToLineDashArray[Math.round(mapZoomLevel)] ?? [5, 5];
  }, [ mapZoomLevel ]);

  const lineWidth = useMemo(() => {
    return zoomLevelToLineWidthArray[Math.round(mapZoomLevel)] ?? 3;
  }, [ mapZoomLevel ]);

  console.log('mapZoomLevel', mapZoomLevel);
  console.log('lineDashArray', lineDashArray);

  return (
    <>
      <Source
        id='abyei-polygon-source'
        type='geojson'
        data='https://raw.githubusercontent.com/serotracker/iit-backend-v2/refs/heads/main/geojson/abyei-polygon.geojson'
      >
        <Layer
          id='abyei-polygon-layer'
          source='abyei-polygon-source'
          type='fill'
          paint={{
            'fill-color': MapSymbology.CountryFeature.Disputed.Color,
            'fill-opacity': MapSymbology.CountryFeature.Disputed.Opacity
          }}
          beforeId='abyei-line-layer'
        />
      </Source>
      <Source
        id='abyei-line-source'
        type='geojson'
        data='https://raw.githubusercontent.com/serotracker/iit-backend-v2/refs/heads/main/geojson/abyei-line.geojson'
      >
        <Layer
          id='abyei-line-layer'
          source='abyei-line-source'
          type='line'
          paint={{
            'line-color': '#AEAEAE',
            'line-dasharray': lineDashArray,
            'line-width': lineWidth
          }}
          beforeId={props.positionedUnderLayerWithId}
        />
      </Source>
    </>
  )
}