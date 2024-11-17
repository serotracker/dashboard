import { rose } from 'tailwindcss/colors'
import uniq from 'lodash/uniq';
import { useCallback, useContext } from "react";
import {
  GetCountryHighlightingLayerInformationInput as GenericGetCountryHighlightingLayerInformationInput,
  GetCountryHighlightingLayerInformationOutput,
} from "@/components/ui/pathogen-map/pathogen-map";
import { generateMapColourBuckets } from "@/components/ui/pathogen-map/country-highlight-layers/generate-map-colour-buckets";
import { MapSymbology } from '@/app/pathogen/sarscov2/dashboard/(map)/map-config';
import { formatPerCapitaNumberRangeForLegend, generateStandardMapPaint, standardGetFreeTextEntriesFunction } from './helpers';
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
        .map((dataPoint) => ({ value: dataPoint.camelCountPerCapita, countryAlphaThreeCode: dataPoint.countryAlphaThreeCode }))
        .filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'value'> & {
          value: NonNullable<typeof dataPoint['value']>
        } => dataPoint.value !== undefined && dataPoint.value !== null),
      dataPointToValue: (dataPoint) => dataPoint.value
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
      paint: generateStandardMapPaint({
        mapColourBuckets,
        outlinedCountryAlphaThreeCodes,
        outlinedCountryAlphaThreeCodesWithNoData: outlinedCountryAlphaThreeCodesWithNoCamelData
      }),
      countryHighlightLayerLegendEntries,
      freeTextEntries: getFreeTextEntries({ countryOutlinesEnabled: input.countryOutlinesEnabled }),
      linearLegendColourGradientConfiguration: {
        enabled: false
      },
      legendTooltipContent: undefined
    }
  }, [ getFreeTextEntries ]);

  return {
    getCountryHighlightingLayerInformation
  }
}