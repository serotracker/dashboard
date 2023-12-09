import { Layer, Source, useMap } from "react-map-gl";
import { PathogenDataPointPropertiesBase } from "./pathogen-map";
import { PathogenMapLayerInfoWithCountryHighlighting } from "./pathogen-map-layer";
import { useEffect, useState } from "react";
import { getEsriVectorSourceStyle } from "@/utils/mapping-util";
import {
  MapResources,
  MapSymbology,
} from "@/app/pathogen/arbovirus/dashboard/(map)/map-config";
import { countryNameToIso31661Alpha3CodeMap } from "@/lib/country-iso-3166-1-alpha-3-codes";

interface PathogenCountryHighlightLayerProps<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
> {
  layer:
    | PathogenMapLayerInfoWithCountryHighlighting<TPathogenDataPointProperties>
    | undefined;
  positionedUnderLayerWithId: string | undefined;
}

const generatePaintForLayer = <
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
>(input: {
  layer:
    | PathogenMapLayerInfoWithCountryHighlighting<TPathogenDataPointProperties>
    | undefined;
}) => {
  const { layer } = input;

  const allUniqueCountryCodesWithData = new Set(
    layer?.dataPoints
      .map((dataPoint) => {
        return countryNameToIso31661Alpha3CodeMap[dataPoint.country];
      })
      .filter(
        (alpha3CountryCode: string | undefined): alpha3CountryCode is string =>
          !!alpha3CountryCode
      ) ?? []
  );

  const countryColorsAndOpacities = Array.from(
    allUniqueCountryCodesWithData
  ).map((alpha3CountryCode) => ({
    alpha3CountryCode: alpha3CountryCode,
    fill: MapSymbology.CountryFeature.HasData.Color,
    opacity: MapSymbology.CountryFeature.HasData.Opacity,
  }));

  return {
    "fill-color": [
      "match",
      ["get", "CODE"],
      ...countryColorsAndOpacities.flatMap(({ alpha3CountryCode, fill }) => [
        alpha3CountryCode,
        fill,
      ]),
      MapSymbology.CountryFeature.Default.Color,
    ],
    "fill-opacity": [
      "match",
      ["get", "CODE"],
      ...countryColorsAndOpacities.flatMap(({ alpha3CountryCode, opacity }) => [
        alpha3CountryCode,
        opacity,
      ]),
      MapSymbology.CountryFeature.Default.Opacity,
    ],
  };
};

export function PathogenCountryHighlightLayer<
  TPathogenDataPointProperties extends PathogenDataPointPropertiesBase
>({
  layer,
  positionedUnderLayerWithId,
}: PathogenCountryHighlightLayerProps<TPathogenDataPointProperties>) {
  const maps = useMap();

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

  return (
    <Source {...mapCountryVectors.sources["esri"]}>
      <Layer
        {...mapCountryVectors.layers[0]}
        paint={generatePaintForLayer({ layer })}
        beforeId={positionedUnderLayerWithId}
      />
    </Source>
  );
}
