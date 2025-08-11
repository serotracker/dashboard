"use client"
import { createContext, useState, useEffect } from "react";
import { StyleSpecification } from "mapbox-gl";
import { getEsriVectorSourceStyle } from "@/utils/mapping-util";
import { MapResources } from "@/app/pathogen/sarscov2/dashboard/(map)/map-config";

interface MapStyleContextType {
  mapStyle: StyleSpecification | null;
}

const initialMapStyleContext = {
  mapStyle: null
}

export const MapStyleContext = createContext<MapStyleContextType>(initialMapStyleContext);

const adjustMapStyle = (mapStyle: StyleSpecification): StyleSpecification => {
  return {
    ...mapStyle,
    layers: mapStyle.layers.map((layer) => {
      if(layer.id === 'GLOBAL/1') {
        return {
          ...layer,
          paint: (layer.paint ? {
            ...layer.paint,
            "fill-color": "#FFFFFF"
          } : layer.paint) as any
        }
      }

      return layer
    })
  }
}

export const MapStyleProvider = (props: { children: React.ReactNode }) => {
  const [mapStyle, setMapStyle] = useState<StyleSpecification | null>(null);

  useEffect(() => {
    getEsriVectorSourceStyle(MapResources.WHO_BASEMAP_BB).then((mapStyle) => {
      setMapStyle(adjustMapStyle(mapStyle))
    });
  }, []);

  return (
    <MapStyleContext.Provider value={{ mapStyle }}>
      {props.children}
    </MapStyleContext.Provider>
  );
}