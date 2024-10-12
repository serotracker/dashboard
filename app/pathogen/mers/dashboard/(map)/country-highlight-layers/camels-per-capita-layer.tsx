import { rose } from 'tailwindcss/colors'
import uniq from 'lodash/uniq';
import { useCallback, useContext } from "react";
import {
  GetCountryHighlightingLayerInformationInput as GenericGetCountryHighlightingLayerInformationInput,
  GetCountryHighlightingLayerInformationOutput,
} from "@/components/ui/pathogen-map/pathogen-map";
import { generateMapColourBuckets } from "@/components/ui/pathogen-map/country-highlight-layers/generate-map-colour-buckets";
import { MapSymbology } from '@/app/pathogen/sarscov2/dashboard/(map)/map-config';
import { formatPerCapitaNumberRangeForLegend, standardGetFreeTextEntriesFunction } from './helpers';
import { MersMapCustomizationsContext } from '@/contexts/pathogen-context/pathogen-contexts/mers/map-customizations-context';

type GetCountryHighlightingLayerInformationInput<
  TData extends { countryAlphaThreeCode: string },
  TCountryOutlineData extends  { countryAlphaThreeCode: string },
> = GenericGetCountryHighlightingLayerInformationInput<TData> & {
  countryOutlinesEnabled: boolean;
  countryOutlineData: TCountryOutlineData[];
}

interface GetFreeTextEntriesInput {
  countryOutlinesEnabled: boolean;
}

export const useCamelsPerCapitaLayer = () => {
  const { mapDataPointVisibilitySetting } = useContext(MersMapCustomizationsContext);

  const getFreeTextEntries = useCallback((input: GetFreeTextEntriesInput) => standardGetFreeTextEntriesFunction({
    countryOutlinesEnabled: input.countryOutlinesEnabled,
    mapDataPointVisibilitySetting
  }), [ mapDataPointVisibilitySetting ]);

  const getCountryHighlightingLayerInformation = useCallback(<
    TData extends {
      countryAlphaThreeCode: string;
      camelCountPerCapita?: number | undefined | null;
    },
    TCountryOutlineData extends  { countryAlphaThreeCode: string },
  >(input: GetCountryHighlightingLayerInformationInput<
    TData,
    TCountryOutlineData
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
        description: formatPerCapitaNumberRangeForLegend({
          minimumInclusive: bucket.valueRange.minimumInclusive,
          maximumExclusive: bucket.valueRange.maximumExclusive,
          entity: 'camels'
        }),
        colour: bucket.fill
      }))
    ];
    
    const outlinedCountryAlphaThreeCodes = input.countryOutlinesEnabled ? uniq(input.countryOutlineData.map(({ countryAlphaThreeCode }) => countryAlphaThreeCode)) : [];
    const countryAlphaThreeCodesWithCamelData = uniq(input.data.map(( { countryAlphaThreeCode }) => countryAlphaThreeCode))
    const outlinedCountryAlphaThreeCodesWithNoCamelData = outlinedCountryAlphaThreeCodes.filter((alphaThreeCode) => !countryAlphaThreeCodesWithCamelData.includes(alphaThreeCode));

    return {
      paint: {
        countryData: [
          ...mapColourBuckets.flatMap((colourBucket) => 
            colourBucket.dataPoints.map((dataPoint) => ({
              countryAlphaThreeCode: dataPoint.countryAlphaThreeCode,
              fill: colourBucket.fill,
              opacity: colourBucket.opacity,
              borderWidthPx: outlinedCountryAlphaThreeCodes.includes(dataPoint.countryAlphaThreeCode)
                ? MapSymbology.CountryFeature.HasData.BorderWidth
                : MapSymbology.CountryFeature.Default.BorderWidth,
              borderColour: outlinedCountryAlphaThreeCodes.includes(dataPoint.countryAlphaThreeCode)
                ? MapSymbology.CountryFeature.HasData.BorderColour
                : MapSymbology.CountryFeature.Default.BorderColour,
            })
          )),
          ...outlinedCountryAlphaThreeCodesWithNoCamelData.map((countryAlphaThreeCode) => ({
            countryAlphaThreeCode,
            fill: MapSymbology.CountryFeature.Default.Color,
            opacity: MapSymbology.CountryFeature.Default.Opacity,
            borderWidthPx: MapSymbology.CountryFeature.HasData.BorderWidth,
            borderColour: MapSymbology.CountryFeature.HasData.BorderColour
          }))
        ],
        defaults: {
          fill: MapSymbology.CountryFeature.Default.Color,
          opacity: MapSymbology.CountryFeature.Default.Opacity,
          borderWidthPx: MapSymbology.CountryFeature.Default.BorderWidth,
          borderColour: MapSymbology.CountryFeature.Default.BorderColour
        }
      },
      countryHighlightLayerLegendEntries,
      freeTextEntries: getFreeTextEntries({ countryOutlinesEnabled: input.countryOutlinesEnabled }),
      linearLegendColourGradientConfiguration: {
        enabled: false
      }
    }
  }, [ getFreeTextEntries ]);

  return {
    getCountryHighlightingLayerInformation
  }
}