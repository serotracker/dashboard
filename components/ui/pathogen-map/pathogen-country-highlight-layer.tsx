import { Layer, Source } from "react-map-gl";
import { PaintForCountries, PathogenDataPointPropertiesBase } from "./pathogen-map";
import { useEffect, useState, useMemo } from "react";
import { getEsriVectorSourceStyle } from "@/utils/mapping-util";
import { MapResources } from "@/app/pathogen/sarscov2/dashboard/(map)/map-config";
import { DataDrivenPropertyValueSpecification } from "mapbox-gl";

interface PathogenCountryHighlightLayerProps {
  positionedUnderLayerWithId: string | undefined;
  paint: PaintForCountries;
}

interface GeneratePaintForLayerInput {
  paint: PaintForCountries;
}

const generatePaintForLayer = (
  input: GeneratePaintForLayerInput
) => {
  const { paint } = input;

  const { countryData, defaults } = paint;

  const fillColour: DataDrivenPropertyValueSpecification<string> | undefined = countryData.length > 0 ? [
    "match",
    ["get", "iso_3166_1_alpha_3"],
    ...countryData.flatMap(({ countryAlphaThreeCode, fill }) => [
      countryAlphaThreeCode,
      fill,
    ]),
    defaults.fill
  ] : defaults.fill;

  const fillOpacity: DataDrivenPropertyValueSpecification<number> | undefined = countryData.length > 0 ? [
    "match",
    ["get", "iso_3166_1_alpha_3"],
    ...countryData.flatMap(({ countryAlphaThreeCode, opacity }) => [
      countryAlphaThreeCode,
      opacity,
    ]),
    defaults.opacity
  ] : defaults.opacity;

  const lineWidth: DataDrivenPropertyValueSpecification<number> | undefined = countryData.length > 0 ? [
    "match",
    ["get", "iso_3166_1_alpha_3"],
    ...countryData.flatMap(({ countryAlphaThreeCode, borderWidthPx }) => [
      countryAlphaThreeCode,
      borderWidthPx,
    ]),
    defaults.borderWidthPx
  ] : defaults.borderWidthPx;

  const lineColor: DataDrivenPropertyValueSpecification<string> | undefined = countryData.length > 0 ? [
    "match",
    ["get", "iso_3166_1_alpha_3"],
    ...countryData.flatMap(({ countryAlphaThreeCode, borderColour }) => [
      countryAlphaThreeCode,
      borderColour
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
  const { paint } = props;
  const [mapCountryVectors, setMapCountryVectors] = useState<any>(null);
  const layerPaint = useMemo(() => generatePaintForLayer({ paint }), [paint])

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

  console.log(paint);

  return (
    <Source
      id='country-boundaries'
      type='vector'
      url='mapbox://mapbox.country-boundaries-v1'
    >
      <Layer
        id="country-highlight-layer"
        //id="country-highlight-layer-non-disputed-areas"
        source="country-boundaries"
        source-layer="country_boundaries"
        type='fill'
        filter={[
          "==",
          [
            "get",
            "disputed"
          ],
          "false"
        ]}
        paint={{
          'fill-color': layerPaint['fill-color'],
          'fill-opacity': layerPaint['fill-opacity'],
        }}
        beforeId={props.positionedUnderLayerWithId}
      />
      <Layer
        id="country-highlight-layer-line"
        source="country-boundaries"
        source-layer="country_boundaries"
        type='line'
        filter={[
          "==",
          [
            "get",
            "disputed"
          ],
          "false"
        ]}
        paint={{
          'line-color': layerPaint['line-color'],
          'line-width': layerPaint['line-width']
        }}
        beforeId={props.positionedUnderLayerWithId}
      />
      {
      <Layer
        id="country-highlight-layer-disputed-areas"
        //id="country-highlight-layer"
        source="country-boundaries"
        source-layer="country_boundaries"
        type='fill'
        filter={[
          "==",
          [
            "get",
            "disputed"
          ],
          "true"
        ]}
        paint={{
          'fill-color': [
            "match",
            ["get", "name"],
            "Indian-administered Kashmir",
            "#E1E1E1",
            "Pakistan-administered Kashmir",
            "#E1E1E1",
            "Aksai Chin disputed area",
            paint.countryData.find((data) => data.countryAlphaThreeCode === 'CHN')?.fill ?? '#000000',
            "Arunachal Pradash",
            paint.countryData.find((data) => data.countryAlphaThreeCode === 'CHN')?.fill ?? '#000000',
            "Hala'ib Triangle",
            paint.countryData.find((data) => data.countryAlphaThreeCode === 'EGY')?.fill ?? '#000000',
            "Bir Tawil",
            paint.countryData.find((data) => data.countryAlphaThreeCode === 'SDN')?.fill ?? '#000000',
            "Trans-Karakoram Tract",
            "#E1E1E1",
            "Demchok disputed area",
            "#E1E1E1",
            "#E1E1E1"
          ],
          'fill-opacity': [
            "match",
            ["get", "name"],
            "Arunachal Pradash",
            paint.countryData.find((data) => data.countryAlphaThreeCode === 'CHN')?.opacity ?? 1,
            "Hala'ib Triangle",
            paint.countryData.find((data) => data.countryAlphaThreeCode === 'EGY')?.opacity ?? 1,
            "Bir Tawil",
            paint.countryData.find((data) => data.countryAlphaThreeCode === 'SDN')?.opacity ?? 1,
            1
          ]
        }}
        beforeId={props.positionedUnderLayerWithId}
      />
      }
      <Layer
        id="country-highlight-layer-disputed-line"
        source="country-boundaries"
        source-layer="country_boundaries"
        type='line'
        filter={[
          "==",
          [
            "get",
            "disputed"
          ],
          "true"
        ]}
        paint={{
          'line-color': "#000000",
          'line-width': 1,
          'line-dasharray': [ 2, 2 ]
        }}
        beforeId={props.positionedUnderLayerWithId}
      />
    </Source>
  );
}
