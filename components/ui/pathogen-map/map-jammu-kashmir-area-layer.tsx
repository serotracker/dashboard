import { useEffect, useState } from "react";
import { MapResources } from "@/app/pathogen/sarscov2/dashboard/(map)/map-config";
import { getEsriVectorSourceStyle } from "@/utils/mapping-util";
import { Source, Layer, LayerProps } from "react-map-gl";

export interface MapJammuKashmirAreaLayerProps {
  positionedUnderLayerWithId: string | undefined;
}

export const MapJammuKashmirAreaLayer = (
  props: MapJammuKashmirAreaLayerProps
) => {
  const { positionedUnderLayerWithId } = props;

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
      <Layer {...jammuKashmirLayer} id='jammu-kashmir-layer' beforeId={lineLayers.at(0)?.id} />
      {lineLayers.map((layer, index, layers) => (
        <Layer
          key={layer.id}
          {...layer}
          beforeId={index !== layers.length - 1 ? layers.at(index + 1)?.id : props.positionedUnderLayerWithId}
        />
      ))}
    </Source>
  );
}
