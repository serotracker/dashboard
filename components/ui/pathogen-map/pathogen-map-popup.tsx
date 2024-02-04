import { MapRef, Popup, useMap } from "react-map-gl";

import { PathogenDataPointPropertiesBase } from "./pathogen-map";

interface PopupContentGeneratorInput<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> {
  layerId: string;
  data: TPathogenDataPointProperties;
}

export type PopupContentGenerator<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> = (input: PopupContentGeneratorInput<TPathogenDataPointProperties>) => React.ReactNode;

type VisiblePopupInfo<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> = { visible: true; properties: TPathogenDataPointProperties, layerId: string };
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

    return 80 / Math.pow(2, mapZoom);
  };

  if (popUpInfo.visible === false) {
    return null;
  }

  const latitude = popUpInfo.properties.latitude ?? 0;
  const longitude = popUpInfo.properties.longitude ?? 0;

  const transformedProperties = Object.fromEntries(
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

      return [key, value];
    })
  ) as VisiblePopupInfo<TPathogenDataPointProperties>["properties"];

  return (
    <Popup
      // Important, without this key, clicking from one popup to another does not trigger the onOpen since react thinks the component data
      // has changed instead of a new pop up being opened. If you choose to change this, please ensure that in your solution the map flys to
      // the correct location when clicking on one data point while having the popup already open.
      key={transformedProperties.id}
      closeOnClick={false}
      maxWidth="480px"
      anchor="top"
      latitude={latitude}
      longitude={longitude}
      onOpen={() => {
        map?.flyTo({
          center: {
            lat: latitude - getMapboxLatitudeOffset(map),
            lon: longitude,
          },
          speed: 0.5,
          curve: 0.5,
        });
      }}
    >
      {generatePopupContent({layerId: popUpInfo.layerId, data:transformedProperties})}
    </Popup>
  );
}
