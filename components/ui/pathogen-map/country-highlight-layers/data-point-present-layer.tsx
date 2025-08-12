import { useCallback } from "react";
import {
  GetCountryHighlightingLayerInformationInput as GenericGetCountryHighlightingLayerInformationInput,
  GetCountryHighlightingLayerInformationOutput
} from "../pathogen-map";
import { MapSymbology } from "@/app/pathogen/sarscov2/dashboard/(map)/map-config";

type GetCountryHighlightingLayerInformationInput<
  TData extends { countryAlphaThreeCode: string }
> = GenericGetCountryHighlightingLayerInformationInput<TData> & {
  countryHighlightingEnabled: boolean;
  countryOutlinesEnabled: boolean;
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
      fill: input.countryHighlightingEnabled 
        ? MapSymbology.CountryFeature.HasData.Color
        : MapSymbology.CountryFeature.Default.Color,
      opacity: input.countryHighlightingEnabled 
        ? MapSymbology.CountryFeature.HasData.Opacity
        : MapSymbology.CountryFeature.Default.Opacity,
      borderWidthPx: input.countryOutlinesEnabled
        ? MapSymbology.CountryFeature.HasData.BorderWidth
        : MapSymbology.CountryFeature.Default.BorderWidth,
      borderColour: input.countryOutlinesEnabled
        ? MapSymbology.CountryFeature.HasData.BorderColour
        : MapSymbology.CountryFeature.Default.BorderColour,
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
        countryData: (input.countryHighlightingEnabled || input.countryOutlinesEnabled) ? countryData : [],
        defaults: {
          fill: MapSymbology.CountryFeature.Default.Color,
          opacity: MapSymbology.CountryFeature.Default.Opacity,
          borderWidthPx: MapSymbology.CountryFeature.Default.BorderWidth,
          borderColour: MapSymbology.CountryFeature.Default.BorderColour,
        }
      },
      countryHighlightLayerLegendEntries: (input.countryHighlightingEnabled === true) ? countryHighlightLayerLegendEntries : [],
      freeTextEntries: (!input.countryHighlightingEnabled && input.countryOutlinesEnabled) ? [{
        text: 'Countries and areas with a black outline contain seroprevalence data.'
      }] : [],
      linearLegendColourGradientConfiguration: {
        enabled: false
      },
      legendTooltipContent: undefined
    }
  }, []);

  return {
    getCountryHighlightingLayerInformation
  }
}