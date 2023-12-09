import { MapResources } from "@/app/pathogen/arbovirus/dashboard/(map)/map-config";
import { getEsriVectorSourceStyle } from "@/utils/mapping-util";
import { useState, useEffect } from "react";
import {
  Map,
  NavigationControl,
} from "react-map-gl";
import {
  PathogenMapCursor,
  usePathogenMapMouse,
} from "./use-pathogen-map-mouse";
import {
  PathogenMapPopup,
  PopupContentGenerator,
  PopupInfo,
} from "./pathogen-map-popup";
import {
  PathogenMapLayer,
  PathogenMapLayerInfo,
  PathogenMapLayerInfoWithCountryHighlighting,
  shouldLayerBeUsedForCountryHighlighting,
} from "./pathogen-map-layer";
import { PathogenCountryHighlightLayer } from "./pathogen-country-highlight-layer";

export interface PathogenDataPointPropertiesBase {
  id: string;
  latitude: number | undefined;
  longitude: number | undefined;
}

interface PathogenMapProps<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> {
  id: string;
  baseCursor: PathogenMapCursor;
  layers: PathogenMapLayerInfo<TPathogenDataPointProperties>[];
  generatePopupContent: PopupContentGenerator<TPathogenDataPointProperties>;
}

export function PathogenMap<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
>({
  id,
  baseCursor,
  generatePopupContent,
  layers,
}: PathogenMapProps<TPathogenDataPointProperties>) {
  const [popUpInfo, setPopUpInfo] = useState<
    PopupInfo<TPathogenDataPointProperties>
  >({ visible: false, properties: null });

  const { cursor, onMouseLeave, onMouseEnter, onMouseDown } =
    usePathogenMapMouse({
      baseCursor,
      layers,
      setPopUpInfo,
    });

  const [mapStyle, setMapStyle] = useState<any>(null);

  useEffect(() => {
    getEsriVectorSourceStyle(MapResources.WHO_BASEMAP).then((mapStyle) =>
      setMapStyle(mapStyle)
    );
  }, []);

  if (!mapStyle) {
    return;
  }

  const layerForCountryHighlighting = layers.find((layer):
          layer is PathogenMapLayerInfoWithCountryHighlighting<TPathogenDataPointProperties> =>
            shouldLayerBeUsedForCountryHighlighting(layer)
        )

  return (
    <Map
      id={id}
      cursor={cursor}
      mapStyle={mapStyle}
      initialViewState={{
        latitude: 10,
        longitude: 30,
        zoom: 2,
      }}
      attributionControl={false}
      scrollZoom={false}
      minZoom={2}
      maxZoom={14}
      interactiveLayerIds={layers.map((layer) => layer.id)}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string}
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
    >
      <NavigationControl />
      <PathogenCountryHighlightLayer
        layer={layerForCountryHighlighting}
        positionedUnderLayerWithId={layerForCountryHighlighting?.id}
      />
      {layers.map((layer) => (
        <PathogenMapLayer key={layer.id} layer={layer} />
      ))}
      <PathogenMapPopup
        mapId={id}
        popUpInfo={popUpInfo}
        generatePopupContent={generatePopupContent}
      />
    </Map>
  );
}
