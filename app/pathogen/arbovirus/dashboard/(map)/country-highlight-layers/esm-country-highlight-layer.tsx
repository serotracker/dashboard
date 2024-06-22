import { useCallback } from "react";
import {
  GetCountryHighlightingLayerInformationInput,
  GetCountryHighlightingLayerInformationOutput
} from "@/components/ui/pathogen-map/pathogen-map";
import { MapSymbology } from "@/app/pathogen/arbovirus/dashboard/(map)/map-config";

export const useEsmCountryHighlightLayer = () => {
  const getCountryHighlightingLayerInformation = useCallback(<
    TData extends {
      countryAlphaThreeCode: string;
    }
  >(input: GetCountryHighlightingLayerInformationInput<
    TData
  >): GetCountryHighlightingLayerInformationOutput => {
    return {
      paint: {
        countryData: [],
        defaults: {
          fill: MapSymbology.CountryFeature.Default.Color,
          opacity: MapSymbology.CountryFeature.Default.Opacity
        }
      },
      countryHighlightLayerLegendEntries: []
    }
  }, []);

  return {
    getCountryHighlightingLayerInformation
  }
}