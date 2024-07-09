import { rose } from 'tailwindcss/colors'
import { useCallback } from "react";
import { GetCountryHighlightingLayerInformationInput, GetCountryHighlightingLayerInformationOutput, PathogenDataPointPropertiesBase } from "@/components/ui/pathogen-map/pathogen-map";
import { generateMapColourBuckets } from "@/components/ui/pathogen-map/country-highlight-layers/generate-map-colour-buckets";
import { MapSymbology } from '@/app/pathogen/sarscov2/dashboard/(map)/map-config';

export const formatCamelsPerCapita = (camelsPerCapita: number) => {
  return formatNumberForLegend({ value: camelsPerCapita, isExclusiveInRange: false });
}

const formatNumberForLegend = (input: {
  value: number,
  isExclusiveInRange: boolean;
}): string => {
  const adjustmentAmount = input.isExclusiveInRange ? 1 : 0;

  if(input.value * 1_000 >= 1) {
    return `${((input.value * 1_000) - adjustmentAmount).toFixed(0)} per thousand people`
  }

  if(input.value * 1_000_000 >= 1) {
    return `${((input.value * 1_000_000) - adjustmentAmount).toFixed(0)} per million people`
  }

  if(input.value * 1_000_000_000 >= 1) {
    return `${((input.value * 1_000_000_000) - adjustmentAmount).toFixed(0)} per billion people`
  }

  return input.value.toFixed(0)
}

const formatNumberRangeForLegend = (input: {
  minimumInclusive: number | undefined,
  maximumExclusive: number | undefined,
}): string => {
  const formattedMinimum = input.minimumInclusive ? formatNumberForLegend({ value: input.minimumInclusive, isExclusiveInRange: false }) : undefined;
  const formattedMaximum = input.maximumExclusive ? formatNumberForLegend({ value: input.maximumExclusive, isExclusiveInRange: true }) : undefined;

  if(formattedMinimum !== undefined && formattedMaximum !== undefined) {
    return `${formattedMinimum} to ${formattedMaximum}`;
  }

  if(formattedMinimum === undefined && formattedMaximum !== undefined) {
    return `Up to ${formattedMaximum}`;
  }

  if(formattedMinimum !== undefined && formattedMaximum === undefined) {
    return `Over ${formattedMinimum}`;
  }

  return "-";
}

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

    const countryHighlightLayerLegendEntries = [
      { description: "Data unavailable", colour: MapSymbology.CountryFeature.Default.Color },
      ...mapColourBuckets.map((bucket) => ({
        description: formatNumberRangeForLegend({
          minimumInclusive: bucket.valueRange.minimumInclusive,
          maximumExclusive: bucket.valueRange.maximumExclusive
        }),
        colour: bucket.fill
      }))
    ];

    return {
      paint: {
        countryData: mapColourBuckets.flatMap((colourBucket) => 
          colourBucket.dataPoints.map((dataPoint) => ({
            countryAlphaThreeCode: dataPoint.countryAlphaThreeCode,
            fill: colourBucket.fill,
            opacity: colourBucket.opacity,
            borderWidthPx: 0,
            borderColour: "#000000",
          })
        )),
        defaults: {
          fill: MapSymbology.CountryFeature.Default.Color,
          opacity: MapSymbology.CountryFeature.Default.Opacity,
          borderWidthPx: 0,
          borderColour: "#000000",
        }
      },
      countryHighlightLayerLegendEntries
    }
  }, []);

  return {
    getCountryHighlightingLayerInformation
  }
}