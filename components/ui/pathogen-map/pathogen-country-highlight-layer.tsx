import { Layer, Source } from "react-map-gl";
import { GetPaintForCountriesInput, GetPaintForCountriesOutput, PathogenDataPointPropertiesBase } from "./pathogen-map";
import { useEffect, useMemo, useState } from "react";
import { getEsriVectorSourceStyle } from "@/utils/mapping-util";
import {
  MapResources,
  MapSymbology,
} from "@/app/pathogen/arbovirus/dashboard/(map)/map-config";

interface PathogenCountryHighlightLayerProps<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase,
  TAdditionalNonPointData extends Record<string, unknown>
> {
  positionedUnderLayerWithId: string | undefined;
  dataPoints: (TPathogenDataPointProperties & {countryAlphaThreeCode : string})[];
  additionalNonPointData: TAdditionalNonPointData[];
  getPaintForCountries: (input: GetPaintForCountriesInput<
    TPathogenDataPointProperties,
    TAdditionalNonPointData
  >) => GetPaintForCountriesOutput;
}

interface GeneratePaintForLayerInput<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase,
  TAdditionalNonPointData extends Record<string, unknown>
> {
  dataPoints: (TPathogenDataPointProperties & { countryAlphaThreeCode : string})[];
  additionalNonPointData: TAdditionalNonPointData[];
  getPaintForCountries: (input: GetPaintForCountriesInput<
    TPathogenDataPointProperties,
    TAdditionalNonPointData
  >) => GetPaintForCountriesOutput;
}

const generatePaintForLayer = <
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase,
  TAdditionalNonPointData extends Record<string, unknown>
>(input: GeneratePaintForLayerInput<TPathogenDataPointProperties, TAdditionalNonPointData>) => {
  const { dataPoints, additionalNonPointData, getPaintForCountries } = input;

  const { countryData, defaults } = getPaintForCountries({
    dataPoints,
    additionalNonPointData
  });

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

export function PathogenCountryHighlightLayer<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase,
  TAdditionalNonPointData extends Record<string, unknown>
>(props: PathogenCountryHighlightLayerProps<TPathogenDataPointProperties, TAdditionalNonPointData>) {
  const [mapCountryVectors, setMapCountryVectors] = useState<any>(null);

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
        paint={generatePaintForLayer({
          dataPoints: props.dataPoints,
          additionalNonPointData: props.additionalNonPointData,
          getPaintForCountries: props.getPaintForCountries,
        })}
        beforeId={props.positionedUnderLayerWithId}
      />
    </Source>
  );
}
