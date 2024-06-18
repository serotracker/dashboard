import { useCallback } from "react";
import { GetPaintForCountriesInput, GetPaintForCountriesOutput, PathogenDataPointPropertiesBase } from "../pathogen-map";
import { MapSymbology } from "@/app/pathogen/arbovirus/dashboard/(map)/map-config";

export const useDataPointPresentLayer = () => {
  const getPaintForCountries = useCallback(<
    TPathogenDataPointProperties extends PathogenDataPointPropertiesBase & { countryAlphaThreeCode: string },
    TAdditionalNonPointData extends Record<string, unknown>
  >(input: GetPaintForCountriesInput<
    TPathogenDataPointProperties,
    TAdditionalNonPointData
  >): GetPaintForCountriesOutput => {
    const allUniqueCountryCodesWithData = new Set(
      input.dataPoints.map((dataPoint) => dataPoint.countryAlphaThreeCode)
    );

    const countryData = Array.from(
      allUniqueCountryCodesWithData
    ).map((countryAlphaThreeCode) => ({
      countryAlphaThreeCode: countryAlphaThreeCode,
      fill: MapSymbology.CountryFeature.HasData.Color,
      opacity: MapSymbology.CountryFeature.HasData.Opacity,
    }));

    return {
      countryData,
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