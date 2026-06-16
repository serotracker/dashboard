import { Source, Layer, LayerProps } from "react-map-gl/mapbox";
import { PaintForCountries } from "./pathogen-map";
import { useEffect, useState } from "react";
import { getEsriVectorSourceStyle } from "@/utils/mapping-util";
import { MapResources, MapSymbology } from "@/app/pathogen/sarscov2/dashboard/(map)/map-config";

export interface MapAksaiChinAreaLayerProps {
  paint: PaintForCountries;
  positionedUnderLayerWithId: string | undefined;
}

export const MapAksaiChinAreaLayer = (props: MapAksaiChinAreaLayerProps) => {
  const { paint } = props;

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

  const aksaiChinLayer = whoBasemapVectors.layers.find((layer) => layer.id === 'DISPUTED BORDERS AND AREAS/DISPUTED_AREAS_BB/Aksai Chin/1');
  const lineLayers = whoBasemapVectors.layers
    .filter((layer) => layer.type === 'line')
    .map((layer) => ({
      ...layer,
      paint: {
        ...layer.paint,
        "line-color": "#A9A9A9"
      }
    }));

  if (!aksaiChinLayer) {
    return;
  }

  const fillForChina = paint.countryData.find((dataPoint) => dataPoint.countryAlphaThreeCode === 'CHN')?.fill;

  return (
    <>
      <Source {...whoBasemapVectors.sources[aksaiChinLayer.source]}>
        <Layer {...aksaiChinLayer} id='aksai-chin-layer' beforeId={lineLayers.at(0)?.id} />
        {lineLayers.map((layer, index, layers) => (
          <Layer
            key={layer.id}
            {...layer}
            beforeId={index !== layers.length - 1 ? layers.at(index + 1)?.id : props.positionedUnderLayerWithId}
          />
        ))}
      </Source>
    </>
  );
};