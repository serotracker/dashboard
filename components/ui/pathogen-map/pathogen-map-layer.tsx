import { Layer, Source } from "react-map-gl";
import { PathogenDataPointPropertiesBase } from "./pathogen-map";
import { PathogenMapCursor } from "./use-pathogen-map-mouse";
import cluster from "cluster";

export interface PathogenMapLayerInfo {
  id: string;
  type: "symbol" | "circle";
  cursor?: PathogenMapCursor;
  isDataUsedForCountryHighlighting: boolean;
  layerPaint?: mapboxgl.CirclePaint;
  filter?: any;
  layout?: mapboxgl.SymbolLayout;
}

export const shouldLayerBeUsedForCountryHighlighting = (
  layer: PathogenMapLayerInfo
): layer is PathogenMapLayerInfo => {
  return !!layer.isDataUsedForCountryHighlighting;
};

export interface PathogenMapLayerProps<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> {
  layers: PathogenMapLayerInfo[];
  dataPoints: (TPathogenDataPointProperties & { country: string })[];
  clusterProperties: { [key: string]: any };
  sourceId: string;
}

export function PathogenMapSourceAndLayer<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
>({ layers, dataPoints, clusterProperties, sourceId }: PathogenMapLayerProps<TPathogenDataPointProperties>) {
  const geojsonData = {
    type: "FeatureCollection" as const,
    features: dataPoints.map((dataPoint) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [dataPoint.longitude ?? 0, dataPoint.latitude ?? 0],
      },
      properties: dataPoint,
    })),
  };

  return (
    <Source
      id={sourceId}
      type="geojson"
      data={geojsonData}
      cluster
      clusterMaxZoom={6}
      clusterMinPoints={2}
      clusterRadius={100}
      clusterProperties={clusterProperties}
    >
      {layers.map((layer) => {
        return layer.type === "symbol" ? (
          <Layer
            key={layer.id}
            id={layer.id}
            type="symbol"
            source={sourceId}
            filter={layer.filter}
            layout={layer.layout}
            paint={{
              "text-color": "#ffff00",
              "text-halo-color": "#333333",
              "text-halo-width": 1,
            }}
          />
        ) : (
          <Layer
            key={layer.id}
            id={layer.id}
            type={layer.type}
            source={sourceId}
            paint={layer.layerPaint}
            filter={layer.filter}
          />
        );
      })}
    </Source>
  );
}
