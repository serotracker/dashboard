import { EnabledLinearLegendColourGradientConfiguration } from "./country-highlight-layer-legend";

interface MapColourBucketsToLinearGradientConfigurationInput {
  mapColourBuckets: Array<{
    fill: string;
    opacity: number;
    valueRange: {
      minimumInclusive: number | undefined,
      maximumExclusive: number | undefined,
    }
  }>
  minimumPossibleValue: number
}

interface MapColourBucketsToLinearGradientConfigurationOutput {
  linearLegendColourGradientConfiguration: {
    enabled: EnabledLinearLegendColourGradientConfiguration['enabled'],
    props: Pick<EnabledLinearLegendColourGradientConfiguration['props'], 'ticks'>
  }
}

export const mapColourBucketsToLinearGradientConfiguration = (
  input: MapColourBucketsToLinearGradientConfigurationInput
): MapColourBucketsToLinearGradientConfigurationOutput => {
  return {
    linearLegendColourGradientConfiguration: {
      enabled: true,
      props: {
        ticks: input.mapColourBuckets.flatMap((colourBucket) => ([{
          numericValue: colourBucket.valueRange.minimumInclusive ?? input.minimumPossibleValue,
          colourCode: colourBucket.fill
        }, 
        ...(colourBucket.valueRange.maximumExclusive !== undefined ? [{
          numericValue: colourBucket.valueRange.maximumExclusive - 1,
          colourCode: colourBucket.fill
        }] : [])])),
      }
    }
  };
}