import uniq from 'lodash/uniq';
import { useCallback } from "react";
import { fuchsia } from 'tailwindcss/colors'
import {
  GetCountryHighlightingLayerInformationInput as GenericGetCountryHighlightingLayerInformationInput,
  GetCountryHighlightingLayerInformationOutput,
} from "@/components/ui/pathogen-map/pathogen-map";
import { generateMapColourBuckets } from "@/components/ui/pathogen-map/country-highlight-layers/generate-map-colour-buckets";
import { MapSymbology } from '@/app/pathogen/sarscov2/dashboard/(map)/map-config';
import { pipe } from "fp-ts/lib/function";
import { formatNumberRangeForLegend } from "./helpers";
import { typedGroupBy, typedObjectEntries } from '@/lib/utils';

type GetCountryHighlightingLayerInformationInput<
  TData extends { countryAlphaThreeCode: string },
  TCountryOutlineData extends  { countryAlphaThreeCode: string },
> = GenericGetCountryHighlightingLayerInformationInput<TData> & {
  countryOutlinesEnabled: boolean;
  countryOutlineData: TCountryOutlineData[];
}

export const useMersReportedAnimalCasesMapLayer = () => {
  const getCountryHighlightingLayerInformation = useCallback(<
    TData extends { countryAlphaThreeCode: string, animalsAffected: number },
    TCountryOutlineData extends  { countryAlphaThreeCode: string }
  >(input: GetCountryHighlightingLayerInformationInput<
    TData,
    TCountryOutlineData
  >): GetCountryHighlightingLayerInformationOutput => {
    const postiveCasesByCountry = pipe(
      input.data,
      (data) => typedGroupBy(data, (dataPoint) => dataPoint.countryAlphaThreeCode),
      (groupedData) => typedObjectEntries(groupedData)
        .map(([countryAlphaThreeCode, dataForCountry]) => ({ countryAlphaThreeCode, dataForCountry })),
      (data) => data.map(({ countryAlphaThreeCode, dataForCountry }) => ({
        countryAlphaThreeCode, positiveCases: dataForCountry.reduce((accumulator, value) => accumulator + value.animalsAffected, 0)
      }))
    );

    const { mapColourBuckets } = generateMapColourBuckets({
      idealBucketCount: 8,
      smallestValuePaint: {
        fill: fuchsia['100'],
        opacity: 0.6
      },
      largestValuePaint: {
        fill: fuchsia['700'],
        opacity: 0.8
      },
      data: postiveCasesByCountry,
      dataPointToValue: (dataPoint) => dataPoint.positiveCases
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
    
    const outlinedCountryAlphaThreeCodes = input.countryOutlinesEnabled ? uniq(input.countryOutlineData.map(({ countryAlphaThreeCode }) => countryAlphaThreeCode)) : [];
    const countryAlphaThreeCodesWithPositiveCaseData =
      uniq(input.data.map(( { countryAlphaThreeCode }) => countryAlphaThreeCode));
    const outlinedCountryAlphaThreeCodesWithNoPositiveCaseData =
      outlinedCountryAlphaThreeCodes.filter((alphaThreeCode) => !countryAlphaThreeCodesWithPositiveCaseData.includes(alphaThreeCode));

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
          ...outlinedCountryAlphaThreeCodesWithNoPositiveCaseData.map((countryAlphaThreeCode) => ({
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
      freeTextEntries: input.countryOutlinesEnabled ? [{
        text: 'Countries with a black outline contain seroprevalence or positive case data.'
      }] : []
    }
  }, []);

  return {
    getCountryHighlightingLayerInformation
  }
}