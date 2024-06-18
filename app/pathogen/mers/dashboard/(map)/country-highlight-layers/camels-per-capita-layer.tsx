import { useCallback } from "react";
import { GetPaintForCountriesInput, GetPaintForCountriesOutput, PathogenDataPointPropertiesBase } from "@/components/ui/pathogen-map/pathogen-map";
import { MapSymbology } from "@/app/pathogen/arbovirus/dashboard/(map)/map-config";

export const useCamelsPerCapitaLayer = () => {
  const getPaintForCountries = useCallback(<
    TPathogenDataPointProperties extends PathogenDataPointPropertiesBase,
    TAdditionalNonPointData extends {
      countryAlphaThreeCode: string;
      camelCountPerCapita?: number | undefined | null;
    }
  >(input: GetPaintForCountriesInput<
    TPathogenDataPointProperties,
    TAdditionalNonPointData
  >): GetPaintForCountriesOutput => {
    return {
      countryData: [{
        countryAlphaThreeCode: "USA",
        fill: "#0526fc",
        opacity: 1
      }],
      defaults: {
        fill: MapSymbology.CountryFeature.Default.Color,
        opacity: MapSymbology.CountryFeature.Default.Opacity
      }
    }
  }, []);

  return {
    getPaintForCountries
  }
}