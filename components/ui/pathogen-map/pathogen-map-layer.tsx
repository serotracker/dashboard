import { Layer, Source } from "react-map-gl";
import { PathogenDataPointPropertiesBase } from "./pathogen-map";
import { PathogenMapCursor } from "./use-pathogen-map-mouse";

export interface PathogenMapLayerInfoWithoutCountryHighlighting<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> {
  id: string;
  cursor: PathogenMapCursor;
  isDataUsedForCountryHighlighting: false;
  layerPaint: mapboxgl.CirclePaint;
  dataPoints: TPathogenDataPointProperties[];
}

export interface PathogenMapLayerInfoWithCountryHighlighting<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> {
  id: string;
  cursor: PathogenMapCursor;
  isDataUsedForCountryHighlighting: true;
  layerPaint: mapboxgl.CirclePaint;
  dataPoints: (TPathogenDataPointProperties & { country: string })[];
}

export type PathogenMapLayerInfo<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> =
  | PathogenMapLayerInfoWithoutCountryHighlighting<TPathogenDataPointProperties>
  | PathogenMapLayerInfoWithCountryHighlighting<TPathogenDataPointProperties>;

export const shouldLayerBeUsedForCountryHighlighting = <
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
>(
  layer: PathogenMapLayerInfo<TPathogenDataPointProperties>
): layer is PathogenMapLayerInfoWithCountryHighlighting<TPathogenDataPointProperties> => {
  return !!layer.isDataUsedForCountryHighlighting;
};

export interface PathogenMapLayerProps<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> {
  layer: PathogenMapLayerInfo<TPathogenDataPointProperties>;
}

export function PathogenMapLayer<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
>({ layer }: PathogenMapLayerProps<TPathogenDataPointProperties>) {
  const sourceId = `${layer.id}-[GENERATED-SOURCE-ID]`;
  const geojsonData = {
    type: "FeatureCollection" as const,
    features: layer.dataPoints.map((dataPoint) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [dataPoint.latitude ?? 0, dataPoint.longitude ?? 0],
      },
      properties: dataPoint,
    })),
  };

  return (
    <Source id={sourceId} type="geojson" data={geojsonData}>
      <Layer
        id={layer.id}
        type="circle"
        source={sourceId}
        paint={layer.layerPaint}
      />
    </Source>
  );
}
