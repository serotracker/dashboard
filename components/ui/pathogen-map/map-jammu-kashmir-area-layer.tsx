import { useEffect, useState } from "react";
import { MapResources } from "@/app/pathogen/sarscov2/dashboard/(map)/map-config";
import { getEsriVectorSourceStyle } from "@/utils/mapping-util";
import { Source, Layer, LayerProps } from "react-map-gl";

export const MapJammuKashmirAreaLayer = () => {
  const [whoBasemapVectors, setWhoBasemapVectors] = useState<{
    sources: {
      esri: any
    }
    layers: Array<LayerProps & {
      source: 'esri';
    }>;
  } | null>(null);

  useEffect(() => {
    getEsriVectorSourceStyle(MapResources.WHO_BASEMAP_BB).then(
      (mapCountryVectors) => {
        setWhoBasemapVectors(mapCountryVectors);
      }
    );
  }, []);
  
  if (!whoBasemapVectors) {
    return;
  }

  const jammuKashmirLayer = whoBasemapVectors.layers.find((layer) => layer.id === 'DISPUTED BORDERS AND AREAS/DISPUTED_AREAS_BB/Not applicable/1');
  const lineLayers = whoBasemapVectors.layers
    .filter((layer) => layer.type === 'line')
    .map((layer) => ({
      ...layer,
      paint: {
        ...layer.paint,
        "line-color": "#A9A9A9"
      }
    }));

  if (!jammuKashmirLayer) {
    return;
  }

  return (
    <Source {...whoBasemapVectors.sources[jammuKashmirLayer.source]}>
      <Layer {...jammuKashmirLayer} />
      {lineLayers.map((layer) => <Layer key={layer.id} {...layer} />)}
    </Source>
  );
}