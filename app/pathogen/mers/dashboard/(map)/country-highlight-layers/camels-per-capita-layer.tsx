import { rose } from 'tailwindcss/colors'
import { useCallback } from "react";
import { GetPaintForCountriesInput, GetPaintForCountriesOutput, PathogenDataPointPropertiesBase } from "@/components/ui/pathogen-map/pathogen-map";
import { MapSymbology } from "@/app/pathogen/arbovirus/dashboard/(map)/map-config";
import { generateMapColourBuckets } from "@/components/ui/pathogen-map/country-highlight-layers/generate-map-colour-buckets";

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
      data: (input.additionalNonPointData ?? [])
        .map((dataPoint) => ({ camelCountPerCapita: dataPoint.camelCountPerCapita, countryAlphaThreeCode: dataPoint.countryAlphaThreeCode }))
        .filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'camelCountPerCapita'> & {
          camelCountPerCapita: NonNullable<typeof dataPoint['camelCountPerCapita']>
        } => dataPoint.camelCountPerCapita !== undefined && dataPoint.camelCountPerCapita !== null),
      dataPointToValue: (dataPoint) => dataPoint.camelCountPerCapita
    });

    return {
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
    }
  }, []);

  return {
    getPaintForCountries
  }
}