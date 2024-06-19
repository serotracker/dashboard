import { rose } from 'tailwindcss/colors'
import { useCallback } from "react";
import { GetCountryHighlightingLayerInformationInput, GetCountryHighlightingLayerInformationOutput, PathogenDataPointPropertiesBase } from "@/components/ui/pathogen-map/pathogen-map";
import { MapSymbology } from "@/app/pathogen/arbovirus/dashboard/(map)/map-config";
import { generateMapColourBuckets } from "@/components/ui/pathogen-map/country-highlight-layers/generate-map-colour-buckets";

export const useCamelsPerCapitaLayer = () => {
  const getCountryHighlightingLayerInformation = useCallback(<
    TData extends {
      countryAlphaThreeCode: string;
      camelCountPerCapita?: number | undefined | null;
    }
  >(input: GetCountryHighlightingLayerInformationInput<
    TData
  >): GetCountryHighlightingLayerInformationOutput => {
    const { mapColourBuckets } = generateMapColourBuckets({
      idealBucketCount: 8,
      smallestValuePaint: {
        fill: rose['100'],
        opacity: 0.6
      },
      largestValuePaint: {
        fill: rose['700'],
        opacity: 0.8
      },
      data: input.data
        .map((dataPoint) => ({ camelCountPerCapita: dataPoint.camelCountPerCapita, countryAlphaThreeCode: dataPoint.countryAlphaThreeCode }))
        .filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'camelCountPerCapita'> & {
          camelCountPerCapita: NonNullable<typeof dataPoint['camelCountPerCapita']>
        } => dataPoint.camelCountPerCapita !== undefined && dataPoint.camelCountPerCapita !== null),
      dataPointToValue: (dataPoint) => dataPoint.camelCountPerCapita
    });

    const countryHighlightLayerLegendEntries = mapColourBuckets.map((bucket) => ({
      description: 'BBBBB',
      colour: bucket.fill
    }))

    return {
      paint: {
        countryData: mapColourBuckets.flatMap((colourBucket) => 
          colourBucket.dataPoints.map((dataPoint) => ({
            countryAlphaThreeCode: dataPoint.countryAlphaThreeCode,
            fill: colourBucket.fill,
            opacity: colourBucket.opacity
          })
        )),
        defaults: {
          fill: MapSymbology.CountryFeature.Default.Color,
          opacity: MapSymbology.CountryFeature.Default.Opacity
        }
      },
      countryHighlightLayerLegendEntries
    }
  }, []);

  return {
    getCountryHighlightingLayerInformation
  }
}