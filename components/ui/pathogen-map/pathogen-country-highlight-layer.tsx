import { Layer, Source } from "react-map-gl";
import { PaintForCountries, PATHOGEN_MAP_WHO_ADMIN_O_SOURCE_LAYER_ID, PathogenDataPointPropertiesBase } from "./pathogen-map";
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
    ["get", "ISO_3_CODE"],
    ...countryData
      .filter(({ countryAlphaThreeCode }) => !countryAlphaThreeCodesToNotHighlight.includes(countryAlphaThreeCode))
      .flatMap(({ countryAlphaThreeCode, fill }) => [
        countryAlphaThreeCode,
        fill,
      ]),
    defaults.fill
  ] : defaults.fill;

  const fillOpacity = countryData.length > 0 ? [
    "match",
    ["get", "ISO_3_CODE"],
    ...countryData
      .filter(({ countryAlphaThreeCode }) => !countryAlphaThreeCodesToNotHighlight.includes(countryAlphaThreeCode))
      .flatMap(({ countryAlphaThreeCode, opacity }) => [
        countryAlphaThreeCode,
        countryAlphaThreeCode !== 'SDN' ? opacity : [
          "match",
          ["get", "OBJECTID"],
          695,
          opacity,
          0
        ],
      ]),
    defaults.opacity
  ] : defaults.opacity;

  const lineWidth = countryData.length > 0 ? [
    "match",
    ["get", "ISO_3_CODE"],
    ...countryData
      .filter(({ countryAlphaThreeCode }) => !countryAlphaThreeCodesToNotHighlight.includes(countryAlphaThreeCode))
      .flatMap(({ countryAlphaThreeCode, borderWidthPx }) => [
        countryAlphaThreeCode,
        countryAlphaThreeCode !== 'SDN' ? borderWidthPx : [
          "match",
          ["get", "UNIQUE CODE LEVEL 0"],
          "SD001000000000000000",
          0,
          borderWidthPx
        ],
      ]),
    defaults.borderWidthPx
  ] : defaults.borderWidthPx;

  const lineColor = countryData.length > 0 ? [
    "match",
    ["get", "ISO_3_CODE"],
    ...countryData
      .filter(({ countryAlphaThreeCode }) => !countryAlphaThreeCodesToNotHighlight.includes(countryAlphaThreeCode))
      .flatMap(({ countryAlphaThreeCode, borderColour }) => [
        countryAlphaThreeCode,
        borderColour,
      ]),
    defaults.borderColour
  ] : defaults.borderColour;

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
  const layerPaint = useMemo(() => generatePaintForLayer({
    paint,
    countryAlphaThreeCodesToNotHighlight,
    countryHighlightingEnabled
  }), [ paint, countryAlphaThreeCodesToNotHighlight ]);

  return (
    <>
      <Layer 
        id='country-highlight-layer'
        type='fill'
        source={PATHOGEN_MAP_WHO_ADMIN_O_SOURCE_LAYER_ID}
        paint={{
          'fill-color': layerPaint['fill-color'],
          'fill-opacity': layerPaint['fill-opacity']
        } as any}
        beforeId={props.positionedUnderLayerWithId}
      />
      <Layer
        type="line"
        id='country-highlight-layer-line'
        source={PATHOGEN_MAP_WHO_ADMIN_O_SOURCE_LAYER_ID}
        paint={{
          'line-color': layerPaint['line-color'],
          'line-width': layerPaint['line-width']
        } as any}
        beforeId={props.positionedUnderLayerWithId}
      />
    </>
  )

  // return (
  //   <Source {...mapCountryVectors.sources[countryLayer.source]}>
  //     <Layer
  //       {...countryLayer}
  //       id='country-highlight-layer'
  //       paint={{
  //         'fill-color': layerPaint['fill-color'],
  //         'fill-opacity': layerPaint['fill-opacity']
  //       }}
  //       beforeId={props.positionedUnderLayerWithId}
  //     />
  //     <Layer
  //       {...countryLayer}
  //       type="line"
  //       id='country-highlight-layer-line'
  //       paint={{
  //         'line-color': layerPaint['line-color'],
  //         'line-width': layerPaint['line-width']
  //       }}
  //       beforeId={props.positionedUnderLayerWithId}
  //     />
  //   </Source>
  // );
}
