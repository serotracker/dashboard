import { MapResources } from "@/app/pathogen/arbovirus/dashboard/(map)/map-config";
import { getEsriVectorSourceStyle } from "@/utils/mapping-util";
import { useState, useEffect, MutableRefObject, useRef, useMemo } from "react";
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
  PathogenMapSourceAndLayer,
  PathogenMapLayerInfo,
  shouldLayerBeUsedForCountryHighlighting,
} from "./pathogen-map-layer";
import { PathogenCountryHighlightLayer } from "./pathogen-country-highlight-layer";
import { useCountryHighlightLayer } from "./use-country-highlight-layer";
import isEqual from "lodash/isEqual";
import { EsmMapSourceAndLayer } from "./esm-maps";
import { WeekNumberLabel } from "react-day-picker";

export interface MarkerCollection<TMarkerProperties extends Record<string, unknown>> {
  [key: string]: {
    properties: TMarkerProperties;
    element: JSX.Element;
  }
}

export interface PathogenDataPointPropertiesBase {
  id: string;
  latitude: number | undefined;
  longitude: number | undefined;
}

interface ClusteringEnabledSettings<TMarkerProperties extends Record<string, unknown>> {
  clusteringEnabled: true,
  computeClusterMarkers: (props: {
    features: mapboxgl.MapboxGeoJSONFeature[];
    markers: MarkerCollection<TMarkerProperties>;
    map: mapboxgl.Map;
  }) => MarkerCollection<TMarkerProperties>;
  clusterProperties: { [key: string]: any };
}

interface ClusteringDisabledSettings {
  clusteringEnabled: false,
}

export type ClusteringSettings<TMarkerProperties extends Record<string, unknown>> = ClusteringEnabledSettings<TMarkerProperties> | ClusteringDisabledSettings;

interface PathogenMapProps<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase,
  TMarkerProperties extends Record<string, unknown>
> {
  id: string;
  baseCursor: PathogenMapCursor;
  layers: PathogenMapLayerInfo[];
  generatePopupContent: PopupContentGenerator<TPathogenDataPointProperties>;
  dataPoints: (TPathogenDataPointProperties & { country: string, countryAlphaThreeCode: string, countryAlphaTwoCode: string })[];
  clusteringSettings: ClusteringSettings<TMarkerProperties>;
  sourceId: string;
}



export function PathogenMap<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase,
  TMarkerProperties extends Record<string, unknown>
>({
  id,
  baseCursor,
  generatePopupContent,
  layers,
  dataPoints,
  clusteringSettings,
  sourceId,
}: PathogenMapProps<TPathogenDataPointProperties, TMarkerProperties>) {
  const [popUpInfo, _setPopUpInfo] = useState<
    PopupInfo<TPathogenDataPointProperties>
  >({ visible: false, properties: null, layerId: null });
  const { setPopUpInfoForCountryHighlightLayer } = useCountryHighlightLayer();

  // TODO: might be possible to get rid of this
  const layerForCountryHighlighting = layers.find(layer => shouldLayerBeUsedForCountryHighlighting(layer));

  const setPopUpInfo = (newPopUpInfo: PopupInfo<TPathogenDataPointProperties>) => {
    if(newPopUpInfo.layerId === 'country-highlight-layer') {
      setPopUpInfoForCountryHighlightLayer({
        newPopUpInfo,
        setPopUpInfo: _setPopUpInfo,
        dataPoints
      });

      return;
    }

    _setPopUpInfo(newPopUpInfo);
  }

  const [markersOnScreen, setMarkersOnScreen] = useState<MarkerCollection<TMarkerProperties>>({});

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

  const onRender = (event: mapboxgl.MapboxEvent) => {
    const map = event.target;
    if (map) {
      const features = map.querySourceFeatures(sourceId);

      if(clusteringSettings.clusteringEnabled === true) {
        // This needs to be standardized. How? Can we be type specific probable not? 
        const newMarkers = clusteringSettings.computeClusterMarkers({
          features,
          markers: markersOnScreen,
          map
        });

        console.log('newMarkers', newMarkers)
      
        // Only update the state if newMarkers is different from markersOnScreen
        if (!isEqual(newMarkers, markersOnScreen)) {
          setMarkersOnScreen(newMarkers);
        }
      }
    }
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
      onRender={onRender}
    >
      <NavigationControl showCompass={false} />
      <EsmMapSourceAndLayer popupLayerId={layerForCountryHighlighting?.id}/>
      <PathogenCountryHighlightLayer
        positionedUnderLayerWithId={layerForCountryHighlighting?.id}
        dataPoints={dataPoints}
      />
      <PathogenMapSourceAndLayer layers={layers} dataPoints={dataPoints} clusteringSettings={clusteringSettings} sourceId={sourceId}/>
      <PathogenMapPopup
        mapId={id}
        popUpInfo={popUpInfo}
        generatePopupContent={generatePopupContent}
      />
      {Object.keys(markersOnScreen).map(
      (id) => markersOnScreen[id]?.element
    )}
    </Map>
  );
}

