import { Layer, Source } from "react-map-gl";
import { PaintForCountries, PathogenDataPointPropertiesBase } from "./pathogen-map";
import { useEffect, useState, useMemo } from "react";
import { getEsriVectorSourceStyle } from "@/utils/mapping-util";
import { MapResources } from "@/app/pathogen/arbovirus/dashboard/(map)/map-config";

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

  return {
    "fill-color": [
      "match",
      ["get", "CODE"],
      ...countryData.flatMap(({ countryAlphaThreeCode, fill }) => [
        countryAlphaThreeCode,
        fill,
      ]),
      defaults.fill
    ],
    "fill-opacity": [
      "match",
      ["get", "CODE"],
      ...countryData.flatMap(({ countryAlphaThreeCode, opacity }) => [
        countryAlphaThreeCode,
        opacity,
      ]),
      defaults.opacity
    ],
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

  return (
    <Source {...mapCountryVectors.sources[countryLayer.source]}>
      <Layer
        {...countryLayer}
        id='country-highlight-layer'
        paint={layerPaint}
        beforeId={props.positionedUnderLayerWithId}
      />
    </Source>
  );
}
