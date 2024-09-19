import { useState, useCallback } from "react";

import { PathogenDataPointPropertiesBase } from "./pathogen-map";
import { PopupInfo } from "./pathogen-map-popup";
import { PathogenMapLayerInfo } from "./pathogen-map-layer";
import { eventHasValidPoint } from "./event-point";

export type PathogenMapCursor = "" | "pointer";

interface UsePathogenMapMouseProps<TPathogenDataPointProperties extends PathogenDataPointPropertiesBase> {
  countryPopUpOnHoverEnabled: boolean;
  baseCursor: PathogenMapCursor;
  layers: PathogenMapLayerInfo[];
  setPopUpInfo: (input: PopupInfo<TPathogenDataPointProperties>) => void
}

export const usePathogenMapMouse = <TPathogenDataPointProperties extends PathogenDataPointPropertiesBase>({ baseCursor, layers, setPopUpInfo, countryPopUpOnHoverEnabled }: UsePathogenMapMouseProps<TPathogenDataPointProperties>) => {
  const [cursor, setCursor] = useState<string>(baseCursor);

  const onMouseLeave = (event: mapboxgl.MapLayerMouseEvent) => {
    if (!event.features || event.features.length === 0) {
      return;
    }

    setCursor(baseCursor);
  };


  const onMouseEnter = (event: mapboxgl.MapLayerMouseEvent) => {
    if (!event.features || event.features.length === 0) {
      return;
    }

    const enteredLayerId = event.features.at(0)?.layer?.id;
    const enteredLayer = layers.find((layer) => layer.id === enteredLayerId);

    if (!enteredLayer) {
      return;
    }

    setCursor(enteredLayer?.cursor || baseCursor);
  };

  const onMouseDown = (event: mapboxgl.MapLayerMouseEvent) => {
    if (!event.features || event.features.length === 0) {
      setPopUpInfo({ visible: false, properties: null, layerId: null });

      return;
    }

    const clickedLayerId = event.features.at(0)?.layer?.id;
    const clickedLayer = layers.find((layer) => layer.id === clickedLayerId);

    if(!clickedLayerId) {
      return;
    }

    if (!clickedLayer && clickedLayerId !== 'country-highlight-layer') {
      return;
    }

    setPopUpInfo({
      visible: true,
      layerId: clickedLayerId,
      properties: event.features[0].properties as TPathogenDataPointProperties,
    });
  };

  const onMouseMove = useCallback((event: mapboxgl.Event) => {
    if(countryPopUpOnHoverEnabled === false) {
      return;
    }

    const map = event.target as mapboxgl.Map;

    if(!eventHasValidPoint(event)) {
      return;
    }

    const features = map
      .queryRenderedFeatures([event.point.x, event.point.y])
      .filter((feature) => feature.layer?.id === 'country-highlight-layer')

    if(features.length > 0) {
      setPopUpInfo({
        visible: true,
        layerId: 'country-highlight-layer',
        properties: features[0].properties as TPathogenDataPointProperties,
        disableMapPanEffect: true
      });
    } else {
      setPopUpInfo({ visible: false, properties: null, layerId: null });
    }
  }, [ setPopUpInfo, countryPopUpOnHoverEnabled ])


  return {
    cursor,
    onMouseLeave,
    onMouseEnter,
    onMouseDown,
    onMouseMove
  }
};
