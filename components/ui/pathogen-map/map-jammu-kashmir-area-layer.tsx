import { useEffect, useState } from "react";
import { MapResources } from "@/app/pathogen/sarscov2/dashboard/(map)/map-config";
import { getEsriVectorSourceStyle } from "@/utils/mapping-util";
import { Source, Layer, LayerProps } from "react-map-gl/mapbox";

export interface MapJammuKashmirAreaLayerProps {
  positionedUnderLayerWithId: string | undefined;
}

export const MapJammuKashmirAreaLayer = (
  props: MapJammuKashmirAreaLayerProps
) => {
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

  if (!jammuKashmirLayer) {
    return;
  }

  return (
    <Source {...whoBasemapVectors.sources[jammuKashmirLayer.source]}>
      <Layer {...jammuKashmirLayer} id='jammu-kashmir-layer' beforeId={props.positionedUnderLayerWithId} />
    </Source>
  );
}
