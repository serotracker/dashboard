import { useState } from "react";

import { PathogenDataPointPropertiesBase } from "./pathogen-map";
import { PopupInfo } from "./pathogen-map-popup";
import { PathogenMapLayerInfo } from "./pathogen-map-layer";

export type PathogenMapCursor = "" | "pointer";

interface UsePathogenMapMouseProps<TPathogenDataPointProperties extends PathogenDataPointPropertiesBase> {
  baseCursor: PathogenMapCursor;
  layers: PathogenMapLayerInfo[];
  setPopUpInfo: (input: PopupInfo<TPathogenDataPointProperties>) => void
}

export const usePathogenMapMouse = <TPathogenDataPointProperties extends PathogenDataPointPropertiesBase>({ baseCursor, layers, setPopUpInfo }: UsePathogenMapMouseProps<TPathogenDataPointProperties>) => {
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

    const enteredLayerId = event.features[0].layer?.id;

    if(!enteredLayerId) {
      return;
    }

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

    const clickedLayerId = event.features[0].layer?.id;

    if(!clickedLayerId) {
      return;
    }

    const clickedLayer = layers.find((layer) => layer.id === clickedLayerId);

    if (!clickedLayer && clickedLayerId !== 'country-highlight-layer') {
      return;
    }

    setPopUpInfo({
      visible: true,
      layerId: clickedLayerId,
      properties: event.features[0].properties as TPathogenDataPointProperties,
    });
  };

  return {
    cursor,
    onMouseLeave,
    onMouseEnter,
    onMouseDown
  }
};
