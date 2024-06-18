import { useCallback } from "react";
import { GetPaintForCountriesInput, GetPaintForCountriesOutput, PathogenDataPointPropertiesBase } from "@/components/ui/pathogen-map/pathogen-map";
import { MapSymbology } from "@/app/pathogen/arbovirus/dashboard/(map)/map-config";

export const useTotalCamelPopulationLayer = () => {
  const getPaintForCountries = useCallback(<
    TPathogenDataPointProperties extends PathogenDataPointPropertiesBase,
    TAdditionalNonPointData extends {
      countryAlphaThreeCode: string;
      camelCount?: number | undefined | null;
    }
  >(input: GetPaintForCountriesInput<
    TPathogenDataPointProperties,
    TAdditionalNonPointData
  >): GetPaintForCountriesOutput => {
    return {
      countryData: [{
        countryAlphaThreeCode: "CAN",
        fill: "#FC050D",
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