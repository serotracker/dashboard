import { useCallback } from "react";
import {
  GetCountryHighlightingLayerInformationInput as GenericGetCountryHighlightingLayerInformationInput,
  GetCountryHighlightingLayerInformationOutput
} from "../pathogen-map";
import { MapSymbology } from "@/app/pathogen/arbovirus/dashboard/(map)/map-config";

type GetCountryHighlightingLayerInformationInput<
  TData extends { countryAlphaThreeCode: string }
> = GenericGetCountryHighlightingLayerInformationInput<TData> & {
  countryHighlightingEnabled: boolean;
}

export const useDataPointPresentLayer = () => {
  const getCountryHighlightingLayerInformation = useCallback(<
    TData extends {
      countryAlphaThreeCode: string;
    }
  >(input: GetCountryHighlightingLayerInformationInput<
    TData
  >): GetCountryHighlightingLayerInformationOutput => {
    const allUniqueCountryCodesWithData = new Set(
      input.data.map((dataPoint) => dataPoint.countryAlphaThreeCode)
    );

    const countryData = Array.from(
      allUniqueCountryCodesWithData
    ).map((countryAlphaThreeCode) => ({
      countryAlphaThreeCode: countryAlphaThreeCode,
      fill: MapSymbology.CountryFeature.HasData.Color,
      opacity: MapSymbology.CountryFeature.HasData.Opacity,
    }));

    const countryHighlightLayerLegendEntries = [{
      description: 'Seroprevalence estimates',
      colour: MapSymbology.CountryFeature.HasData.Color
    }, {
      description: 'No seroprevalence estimates',
      colour: MapSymbology.CountryFeature.Default.Color
    }];

    return {
      paint: {
        countryData: (input.countryHighlightingEnabled === false) ? countryData : [],
        defaults: {
          fill: MapSymbology.CountryFeature.Default.Color,
          opacity: MapSymbology.CountryFeature.Default.Opacity
        }
      },
      countryHighlightLayerLegendEntries: (input.countryHighlightingEnabled === false) ? countryHighlightLayerLegendEntries : [],
    }
  }, []);

  return {
    getCountryHighlightingLayerInformation
  }
}