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

export const MapStyleProvider = (props: { children: React.ReactNode }) => {
  const [mapStyle, setMapStyle] = useState<StyleSpecification | null>(null);

  useEffect(() => {
    getEsriVectorSourceStyle(MapResources.WHO_BASEMAP).then((mapStyle) =>
      setMapStyle(mapStyle)
    );
  }, []);

  return (
    <MapStyleContext.Provider value={{ mapStyle }}>
      {props.children}
    </MapStyleContext.Provider>
  );
}