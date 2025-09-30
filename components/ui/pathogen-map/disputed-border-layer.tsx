import { useMemo } from "react";
import { Layer, Source } from "react-map-gl";
import { MapSymbology } from "@/app/pathogen/sarscov2/dashboard/(map)/map-config";
import { PaintForCountries } from "./pathogen-map";

export interface DisputedBorderLayerProps {
  mapZoomLevel: number;
  paint: PaintForCountries;
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
  const { mapZoomLevel, paint } = props;

  const lineDashArray = useMemo(() => {
    return zoomLevelToLineDashArray[Math.round(mapZoomLevel)] ?? [5, 5];
  }, [ mapZoomLevel ]);

  const lineWidth = useMemo(() => {
    return zoomLevelToLineWidthArray[Math.round(mapZoomLevel)] ?? 3;
  }, [ mapZoomLevel ]);

  const fillForChina = useMemo(() => {
    return paint.countryData.find((dataPoint) => dataPoint.countryAlphaThreeCode === 'CHN')?.fill;
  }, [ paint ]);

  const opacityForChina = useMemo(() => {
    return paint.countryData.find((dataPoint) => dataPoint.countryAlphaThreeCode === 'CHN')?.opacity;
  }, [ paint ]);

  console.log('paint', paint);

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
          beforeId='aksai-chin-bandaid-layer'
        />
      </Source>
      <Source
        id='aksai-chin-bandaid-source'
        type='geojson'
        data='https://raw.githubusercontent.com/serotracker/iit-backend-v2/refs/heads/main/geojson/aksai-chin-bandaid-polygon.geojson'
      >
        <Layer
          id='aksai-chin-bandaid-layer'
          source='aksai-chin-bandaid-source'
          type='fill'
          paint={{
            'fill-color': MapSymbology.CountryFeature.Disputed.Color,
            'fill-opacity': 1
          }}
          beforeId='aksai-chin-polygon-background-layer'
        />
      </Source>
      <Source
        id='aksai-chin-polygon-source'
        type='geojson'
        data='https://raw.githubusercontent.com/serotracker/iit-backend-v2/refs/heads/main/geojson/aksai-chin-polygon.geojson'
      >
        <Layer
          id='aksai-chin-polygon-background-layer'
          source='aksai-chin-polygon-source'
          type='fill'
          paint={{
            'fill-color': MapSymbology.CountryFeature.Default.Color,
            'fill-opacity': 1
          }}
          beforeId='aksai-chin-polygon-layer'
        />
        <Layer
          id='aksai-chin-polygon-layer'
          source='aksai-chin-polygon-source'
          type='fill'
          paint={{
            'fill-color': [
              'match',
              ['get', 'zone'],
              "zone-one",
              fillForChina ?? MapSymbology.CountryFeature.Default.Color,
              "zone-two",
              MapSymbology.CountryFeature.Disputed.Color,
              MapSymbology.CountryFeature.Default.Color,
            ],
            'fill-opacity': [
              'match',
              ['get', 'zone'],
              "zone-one",
              opacityForChina ?? MapSymbology.CountryFeature.Default.Opacity,
              "zone-two",
              MapSymbology.CountryFeature.Disputed.Opacity,
              MapSymbology.CountryFeature.Default.Opacity,
            ]
          }}
          beforeId='aksai-chin-border-line-layer'
        />
      </Source>
      <Source
        id='aksai-chin-border-line-source'
        type='geojson'
        data='https://raw.githubusercontent.com/serotracker/iit-backend-v2/refs/heads/main/geojson/aksai-chin-border-line.geojson'
      >
        <Layer
          id='aksai-chin-border-line-layer'
          source='aksai-chin-border-line-source'
          type='line'
          paint={{
            'line-color': '#AEAEAE',
            'line-width': 1
          }}
          beforeId={props.positionedUnderLayerWithId}
        />
      </Source>
    </>
  )
}