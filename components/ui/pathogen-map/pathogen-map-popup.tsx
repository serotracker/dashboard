import validator from "validator";
import { MapRef, Popup, useMap } from "react-map-gl/mapbox";
import { PathogenDataPointPropertiesBase } from "./pathogen-map";
import { Browser, detectBrowser } from "@/lib/detect-browser";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

type PopupEstimateLayerContentGeneratorInput<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> = {
  layerId: Exclude<string, 'country-highlight-layer'>;
  data: TPathogenDataPointProperties;
}

export const isPopupEstimateLayerContentGeneratorInput = <
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
>(input: PopupContentGeneratorInput<TPathogenDataPointProperties>):
  input is PopupEstimateLayerContentGeneratorInput<TPathogenDataPointProperties> => input.layerId !== 'country-highlight-layer';

type PopupCountryHighlightLayerContentGeneratorInput<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> = {
  layerId: 'country-highlight-layer';
  data: {
    id: string;
    alpha3CountryCode: string;
    countryName: string;
    latitude: string;
    longitude: string;
    dataPoints: TPathogenDataPointProperties[];
  }
}

export const isPopupCountryHighlightLayerContentGeneratorInput = <
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
>(input: PopupContentGeneratorInput<TPathogenDataPointProperties>):
  input is PopupCountryHighlightLayerContentGeneratorInput<TPathogenDataPointProperties> => input.layerId === 'country-highlight-layer';

type PopupContentGeneratorInput<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> = 
  | PopupEstimateLayerContentGeneratorInput<TPathogenDataPointProperties>
  | PopupCountryHighlightLayerContentGeneratorInput<TPathogenDataPointProperties>;

export type PopupContentGenerator<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> = (input: PopupContentGeneratorInput<TPathogenDataPointProperties>) => React.ReactNode;

export type VisiblePopupInfo<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> = {
  visible: true;
  properties: TPathogenDataPointProperties;
  layerId: string;
  disableMapPanEffect?: boolean | undefined;
};
type HiddenPopupInfo = { visible: false; properties: null, layerId: null };

export type PopupInfo<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> =
  | VisiblePopupInfo<TPathogenDataPointProperties>
  | HiddenPopupInfo;

interface PathogenMapPopupProps<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> {
  mapId: string;
  popUpInfo: PopupInfo<TPathogenDataPointProperties>;
  generatePopupContent: PopupContentGenerator<TPathogenDataPointProperties>;
}

export function PathogenMapPopup<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
>({
  mapId,
  popUpInfo,
  generatePopupContent,
}: PathogenMapPopupProps<TPathogenDataPointProperties>) {
  const allMaps = useMap();
  const map = allMaps[mapId];

  const getMapboxLatitudeOffset = (map: MapRef) => {
    // Map seems to zoom in in powers of 2, so reducing offset by powers of 2 keeps the modal apprximately
    // in the same center everytime
    // offset needs to reduce exponentially with zoom -- higher zoom x smaller offset
    let mapZoom = map.getZoom();

    return 120 / Math.pow(2, mapZoom);
  };

  const transformedProperties = useMemo(() => popUpInfo.visible === true ? Object.fromEntries(
    Object.entries(popUpInfo.properties).map(([key, value]) => {
      // Arrays in popUpInfo.properties that reach this point have been converted from
      // ["ABC", "DEF"] to '["ABC", "DEF"]'
      // In order to proceed further, they need to be converted back to arrays.
      if (/^\[("[^\[\]\"]*",?)+\]$/.test(value)) {
        return [
          key,
          value
            .slice(1, -1)
            .split(",")
            .map((innerString: string) => innerString.slice(1, -1)),
        ];
      }

      if(typeof value === 'string' && validator.isJSON(value)) {
        return [key, JSON.parse(value)];
      }

      return [key, value];
    })
  ) as VisiblePopupInfo<TPathogenDataPointProperties>["properties"] : undefined, [ popUpInfo ]);

  const popupContent = useMemo(() => {
    return (popUpInfo.visible === true && transformedProperties !== undefined) ? generatePopupContent({
      layerId: popUpInfo.layerId,
      data: transformedProperties
    }) : undefined;
  }, [ transformedProperties, generatePopupContent, popUpInfo ]);

  if (popUpInfo.visible === false || transformedProperties === undefined) {
    return null;
  }

  const latitude = popUpInfo.properties.latitude ?? 0;
  const longitude = popUpInfo.properties.longitude ?? 0;

  return (
    <Popup
      // Important, without this key, clicking from one popup to another does not trigger the onOpen since react thinks the component data
      // has changed instead of a new pop up being opened. If you choose to change this, please ensure that in your solution the map flys to
      // the correct location when clicking on one data point while having the popup already open.
      key={transformedProperties.id}
      closeOnClick={false}
      maxWidth="660px"
      anchor="top"
      latitude={latitude}
      longitude={longitude}
      className={cn([
        'z-30',
        detectBrowser() === Browser.CHROME ? "[&>*]:!bg-transparent" : ""
      ])}
      onOpen={() => {
        if(popUpInfo.disableMapPanEffect === true) {
          map?.flyTo({
            center: {
              lat: latitude - getMapboxLatitudeOffset(map),
              lon: longitude,
            },
            speed: 0.5,
            curve: 0.5,
          });
        }
      }}
    >
      {popupContent}
    </Popup>
  );
}
