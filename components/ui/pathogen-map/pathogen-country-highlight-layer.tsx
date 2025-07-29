import { Layer, Source } from "react-map-gl";
import { PaintForCountries, PathogenDataPointPropertiesBase } from "./pathogen-map";
import { useEffect, useState, useMemo } from "react";
import { getEsriVectorSourceStyle } from "@/utils/mapping-util";
import { MapResources } from "@/app/pathogen/sarscov2/dashboard/(map)/map-config";

interface PathogenCountryHighlightLayerProps {
  positionedUnderLayerWithId: string | undefined;
  paint: PaintForCountries;
  countryAlphaThreeCodesToNotHighlight: string[];
  countryHighlightingEnabled: boolean;
}

interface GeneratePaintForLayerInput {
  paint: PaintForCountries;
  countryAlphaThreeCodesToNotHighlight: string[];
  countryHighlightingEnabled: boolean;
}

const generatePaintForLayer = (
  input: GeneratePaintForLayerInput
) => {
  const { paint, countryAlphaThreeCodesToNotHighlight, countryHighlightingEnabled } = input;

  const { countryData, defaults } = paint;

  if(!countryHighlightingEnabled) {
    return {
      "fill-color": defaults.fill,
      "line-width": defaults.borderWidthPx,
      "line-color": defaults.borderColour,
      "fill-opacity": defaults.opacity
    };
  }

  const fillColour = countryData.length > 0 ? [
    "match",
    ["concat",
      ["get", "iso_3166_1_alpha_3"],
      ["get", "disputed"],
      ["get", "worldview"],
    ],
    ...countryData
      //.filter(({ countryAlphaThreeCode }) => !countryAlphaThreeCodesToNotHighlight.includes(countryAlphaThreeCode))
      .flatMap(({ countryAlphaThreeCode, fill }) => [
        `${countryAlphaThreeCode}falseall`,
        fill,
      ]),
    defaults.fill
  ] : defaults.fill;

  const fillOpacity = countryData.length > 0 ? [
    "match",
    ["concat",
      ["get", "iso_3166_1_alpha_3"],
      ["get", "disputed"],
      ["get", "worldview"],
    ],
    ...countryData
      //.filter(({ countryAlphaThreeCode }) => !countryAlphaThreeCodesToNotHighlight.includes(countryAlphaThreeCode))
      .flatMap(({ countryAlphaThreeCode, opacity }) => [
        `${countryAlphaThreeCode}falseall`,
        opacity,
      ]),
    defaults.opacity
  ] : defaults.opacity;

  const lineWidth = countryData.length > 0 ? [
    "match",
    ["get", "iso_3166_1_alpha_3"],
    ...countryData
      .filter(({ countryAlphaThreeCode }) => !countryAlphaThreeCodesToNotHighlight.includes(countryAlphaThreeCode))
      .flatMap(({ countryAlphaThreeCode, borderWidthPx }) => [
        countryAlphaThreeCode,
        borderWidthPx,
      ]),
    defaults.borderWidthPx
  ] : defaults.borderWidthPx;

  const lineColor = countryData.length > 0 ? [
    "match",
    ["get", "iso_3166_1_alpha_3"],
    ...countryData
      .filter(({ countryAlphaThreeCode }) => !countryAlphaThreeCodesToNotHighlight.includes(countryAlphaThreeCode))
      .flatMap(({ countryAlphaThreeCode, borderColour }) => [
        countryAlphaThreeCode,
        borderColour,
      ]),
    defaults.borderColour
  ] : defaults.borderColour;

  console.log('fillColour', fillColour);
  console.log('fillOpacity', fillOpacity);

  return {
    "fill-color": fillColour,
    "line-width": lineWidth,
    "line-color": lineColor,
    "fill-opacity": fillOpacity
  };
};

export function PathogenCountryHighlightLayer(
  props: PathogenCountryHighlightLayerProps
) {
  const { paint, countryAlphaThreeCodesToNotHighlight, countryHighlightingEnabled } = props;
  const [mapCountryVectors, setMapCountryVectors] = useState<any>(null);
  const layerPaint = useMemo(() => generatePaintForLayer({
    paint,
    countryAlphaThreeCodesToNotHighlight,
    countryHighlightingEnabled
  }), [ paint, countryAlphaThreeCodesToNotHighlight ]);

  useEffect(() => {
    getEsriVectorSourceStyle(MapResources.WHO_COUNTRY_VECTORTILES).then(
      (mapCountryVectors) => {
        setMapCountryVectors(mapCountryVectors);
      }
    );
  }, []);

  if (!mapCountryVectors) {
    return;
  }

  const countryLayer = mapCountryVectors.layers[0];

  return (
    <Source
      id='Countries'
      type='vector'
      url='mapbox://mapbox.country-boundaries-v1'
    >
      <Layer
        id='country-highlight-layer'
        source-layer='country_boundaries'
        source='Countries'
        type='fill'
        paint={{
          'fill-color': layerPaint['fill-color'],
          'fill-opacity': layerPaint['fill-opacity']
        }}
        beforeId={props.positionedUnderLayerWithId}
      />
      {/*<Layer
        {...countryLayer}
        id='country-highlight-layer'
        paint={{
          'fill-color': layerPaint['fill-color'],
          'fill-opacity': layerPaint['fill-opacity']
        }}
        beforeId={props.positionedUnderLayerWithId}
      />
      <Layer
        {...countryLayer}
        type="line"
        id='country-highlight-layer-line'
        paint={{
          'line-color': layerPaint['line-color'],
          'line-width': layerPaint['line-width']
        }}
        beforeId={props.positionedUnderLayerWithId}
      />*/}
    </Source>
  );
}
