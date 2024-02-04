import { MapResources } from "@/app/pathogen/arbovirus/dashboard/(map)/map-config";
import { getEsriVectorSourceStyle } from "@/utils/mapping-util";
import { useState, useEffect } from "react";
import { Map, NavigationControl } from "react-map-gl";
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
import { countryNameToIso31661Alpha3CodeMap, iso31661Alpha3CodeToCountryNameMap } from "@/lib/country-iso-3166-1-alpha-3-codes";
import { getBoundingBoxCenter, getBoundingBoxFromCountryName } from "@/lib/bounding-boxes";
import { typedGroupBy } from "@/lib/utils";

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
  const [popUpInfo, _setPopUpInfo] = useState<
    PopupInfo<TPathogenDataPointProperties>
  >({ visible: false, properties: null, layerId: null });

  const layerForCountryHighlighting = layers.find((layer): layer is PathogenMapLayerInfoWithCountryHighlighting<TPathogenDataPointProperties> =>
    shouldLayerBeUsedForCountryHighlighting(layer)
  );

  const setPopUpInfo = (newPopUpInfo: PopupInfo<TPathogenDataPointProperties>) => {
    if(newPopUpInfo.layerId !== 'country-highlight-layer') {
      _setPopUpInfo(newPopUpInfo);
      return;
    }

    if(!layerForCountryHighlighting) {
      return;
    }

    if('CODE' in newPopUpInfo.properties && !!newPopUpInfo.properties.CODE && typeof newPopUpInfo.properties.CODE === 'string') {
      const alpha3CountryCode = newPopUpInfo.properties['CODE'];
      const countryName = iso31661Alpha3CodeToCountryNameMap[alpha3CountryCode];
      const countryBoundingBox = getBoundingBoxFromCountryName(countryName);

      if(!countryBoundingBox) {
        return;
      }

      const dataForCountry = layerForCountryHighlighting.dataPoints
        .map((dataPoint) => ({...dataPoint, alpha3CountryCode: countryNameToIso31661Alpha3CodeMap[dataPoint.country]}))
        .filter((dataPoint) => dataPoint.alpha3CountryCode === alpha3CountryCode);

      if(dataForCountry.length === 0) {
        return;
      }

      const countryBoundingBoxCenter = getBoundingBoxCenter(countryBoundingBox);

      const popUpDataWithCountryInformation = {
        layerId: newPopUpInfo.layerId,
        visible: newPopUpInfo.visible,
        properties: {
          ...newPopUpInfo.properties,
          id: alpha3CountryCode,
          alpha3CountryCode,
          countryName: iso31661Alpha3CodeToCountryNameMap[alpha3CountryCode],
          latitude: countryBoundingBoxCenter.latitude,
          longitude: countryBoundingBoxCenter.longitude,
          dataPoints: dataForCountry
        }
      }

      _setPopUpInfo(popUpDataWithCountryInformation);
    }
  }

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
      interactiveLayerIds={[...layers.map((layer) => layer.id), 'country-highlight-layer']}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string}
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
    >
      <NavigationControl showCompass={false} />
      <PathogenCountryHighlightLayer
        dataLayer={layerForCountryHighlighting}
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
