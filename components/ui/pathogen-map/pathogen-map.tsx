import { useState, useContext } from "react";
import { Map, MapProps, NavigationControl } from "react-map-gl";
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
import { computeClusterMarkers } from "@/components/ui/pathogen-map/pathogen-map-cluster-utils";
import { GenericMapPopUpWidth } from "./map-pop-up/generic-map-pop-up";
import { CountryHighlightLayerLegendEntry, FreeTextEntry, LinearLegendColourGradientConfiguration } from "./country-highlight-layers/country-highlight-layer-legend";
import { CountryDataContextType } from "@/contexts/pathogen-context/country-information-context";
import { MapStyleContext } from "@/contexts/map-style-provider";

export interface MarkerCollection<TClusterPropertyKey extends string> {
  [key: string]: {
    properties: Record<TClusterPropertyKey, number> & {
      latitude: number;
      longitude: number;
    };
    element: JSX.Element;
  }
}

export interface PathogenDataPointPropertiesBase {
  id: string;
  latitude: number | undefined;
  longitude: number | undefined;
}

interface ClusteringEnabledSettings<TClusterPropertyKey extends string> {
  clusteringEnabled: true;
  headerText: string;
  clusteringRadius: number;
  popUpWidth: GenericMapPopUpWidth;
  validClusterPropertyKeys: TClusterPropertyKey[];
  clusterPropertyKeysIncludedInSum: TClusterPropertyKey[];
  clusterProperties: Record<TClusterPropertyKey, unknown>;
  clusterPropertyToColourMap: Record<TClusterPropertyKey, string>;
}

interface ClusteringDisabledSettings {
  clusteringEnabled: false,
}

export type ClusteringSettings<TClusterPropertyKey extends string> = ClusteringEnabledSettings<TClusterPropertyKey> | ClusteringDisabledSettings;

export interface GetCountryHighlightingLayerInformationInput<
  TData extends Record<string, unknown>
> {
  data: TData[];
}

export interface PaintForCountries {
  countryData: Array<{
    countryAlphaThreeCode: string;
    fill: string;
    opacity: number;
    borderWidthPx: number;
    borderColour: string;
  }>;
  defaults: {
    fill: string;
    opacity: number;
    borderWidthPx: number;
    borderColour: string;
  }
}

export type GetCountryHighlightingLayerInformationOutput = {
  paint: PaintForCountries;
  countryHighlightLayerLegendEntries: CountryHighlightLayerLegendEntry[];
  freeTextEntries: FreeTextEntry[];
  linearLegendColourGradientConfiguration: LinearLegendColourGradientConfiguration;
  legendTooltipContent: React.ReactNode | undefined;
};

interface PathogenMapProps<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase,
  TClusterPropertyKey extends string
> {
  id: string;
  initialViewStateOverride?: MapProps['initialViewState'] | undefined;
  countryPopUpEnabled: boolean;
  countryPopUpOnHoverEnabled: boolean;
  baseCursor: PathogenMapCursor;
  layers: PathogenMapLayerInfo[];
  generatePopupContent: PopupContentGenerator<TPathogenDataPointProperties>;
  dataPoints: (TPathogenDataPointProperties & { country: string, countryAlphaThreeCode: string, countryAlphaTwoCode: string })[];
  clusteringSettings: ClusteringSettings<TClusterPropertyKey>;
  paint: PaintForCountries;
  additionalLayers?: React.ReactNode | undefined;
  allowCountryPopUpsWithEmptyData: boolean;
  countryDataContext: CountryDataContextType;
  sourceId: string;
  countryAlphaThreeCodesToNotHighlight?: string[];
  children?: React.ReactNode;
}

export function PathogenMap<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase,
  TClusterPropertyKey extends string
>({
  id,
  initialViewStateOverride,
  baseCursor,
  countryPopUpEnabled,
  countryPopUpOnHoverEnabled,
  generatePopupContent,
  layers,
  dataPoints,
  clusteringSettings,
  paint,
  additionalLayers,
  allowCountryPopUpsWithEmptyData,
  countryDataContext,
  sourceId,
  countryAlphaThreeCodesToNotHighlight,
  children
}: PathogenMapProps<
  TPathogenDataPointProperties,
  TClusterPropertyKey
>) {
  const [popUpInfo, _setPopUpInfo] = useState<
    PopupInfo<TPathogenDataPointProperties>
  >({ visible: false, properties: null, layerId: null });
  const { setPopUpInfoForCountryHighlightLayer } = useCountryHighlightLayer();
  const { mapStyle } = useContext(MapStyleContext);

  // TODO: might be possible to get rid of this
  const layerForCountryHighlighting = layers.find(layer => shouldLayerBeUsedForCountryHighlighting(layer));

  const setPopUpInfo = (newPopUpInfo: PopupInfo<TPathogenDataPointProperties>) => {
    if(newPopUpInfo.layerId === 'country-highlight-layer' || newPopUpInfo.layerId === 'country-highlight-layer-non-disputed-areas') {
      if(!countryPopUpEnabled) {
        return;
      }

      setPopUpInfoForCountryHighlightLayer({
        allowCountryPopUpsWithEmptyData,
        countryDataContext,
        newPopUpInfo,
        setPopUpInfo: _setPopUpInfo,
        dataPoints
      });

      return;
    }

    _setPopUpInfo(newPopUpInfo);
  }

  const [markersOnScreen, setMarkersOnScreen] = useState<MarkerCollection<TClusterPropertyKey>>({});

  const { cursor, onMouseLeave, onMouseEnter, onMouseDown } =
    usePathogenMapMouse({
      countryPopUpOnHoverEnabled,
      baseCursor,
      layers,
      setPopUpInfo,
    });

  if (!mapStyle) {
    return;
  }

  const onRender = (event: mapboxgl.Event) => {
    const map = event.target as mapboxgl.Map;
    if (map) {
      const features = map.querySourceFeatures(sourceId) as any as GeoJSON.Feature<
        GeoJSON.Geometry,
        { cluster: boolean, cluster_id: string } & Record<TClusterPropertyKey, number>
      >[];

      if(clusteringSettings.clusteringEnabled === true) {
        // This needs to be standardized. How? Can we be type specific probable not? 
        const newMarkers = computeClusterMarkers({
          features,
          headerText: clusteringSettings.headerText,
          popUpWidth: clusteringSettings.popUpWidth,
          markers: markersOnScreen,
          validClusterPropertyKeys: clusteringSettings.validClusterPropertyKeys,
          clusterPropertyKeysIncludedInSum: clusteringSettings.clusterPropertyKeysIncludedInSum,
          clusterPropertyToColourMap: clusteringSettings.clusterPropertyToColourMap,
          map
        });

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
      initialViewState={initialViewStateOverride ?? {
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
      <EsmMapSourceAndLayer
        popupLayerId={layerForCountryHighlighting?.id}
      />
      <PathogenCountryHighlightLayer
        paint={paint}
        countryAlphaThreeCodesToNotHighlight={countryAlphaThreeCodesToNotHighlight ?? []}
        positionedUnderLayerWithId={layerForCountryHighlighting?.id}
      />
      <PathogenMapSourceAndLayer
        layers={layers}
        dataPoints={dataPoints}
        clusteringSettings={clusteringSettings}
        sourceId={sourceId}
      />
      <PathogenMapPopup
        mapId={id}
        popUpInfo={popUpInfo}
        generatePopupContent={generatePopupContent}
      />
      {children}
      {Object.keys(markersOnScreen).map(
        (id) => markersOnScreen[id]?.element
      )}
      {additionalLayers ?? null}
    </Map>
  );
}

