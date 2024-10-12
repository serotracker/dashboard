import uniq from 'lodash/uniq';
import { useCallback, useContext } from "react";
import { cyan } from 'tailwindcss/colors'
import {
  GetCountryHighlightingLayerInformationInput as GenericGetCountryHighlightingLayerInformationInput,
  GetCountryHighlightingLayerInformationOutput,
} from "@/components/ui/pathogen-map/pathogen-map";
import { generateMapColourBuckets } from "@/components/ui/pathogen-map/country-highlight-layers/generate-map-colour-buckets";
import { MapSymbology } from '@/app/pathogen/sarscov2/dashboard/(map)/map-config';
import { pipe } from "fp-ts/lib/function";
import { formatNumberRangeForLegend, generateStandardMapPaint, standardGetFreeTextEntriesFunction } from "./helpers";
import { typedGroupBy, typedObjectEntries } from '@/lib/utils';
import { MersMapCustomizationsContext } from '@/contexts/pathogen-context/pathogen-contexts/mers/map-customizations-context';
import { mapColourBucketsToLinearGradientConfiguration } from '@/components/ui/pathogen-map/country-highlight-layers/map-colour-buckets-to-linear-gradient-configuration';

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

export const useMersReportedHumanCasesMapLayer = () => {
  const { mapDataPointVisibilitySetting } = useContext(MersMapCustomizationsContext);

  const getFreeTextEntries = useCallback((input: GetFreeTextEntriesInput) => standardGetFreeTextEntriesFunction({
    countryOutlinesEnabled: input.countryOutlinesEnabled,
    mapDataPointVisibilitySetting
  }), [ mapDataPointVisibilitySetting ]);

  const getCountryHighlightingLayerInformation = useCallback(<
    TData extends { countryAlphaThreeCode: string, humansAffected: number },
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
        countryAlphaThreeCode, value: dataForCountry.reduce((accumulator, value) => accumulator + value.humansAffected, 0)
      }))
    );

    const { mapColourBuckets } = generateMapColourBuckets({
      idealBucketCount: 8,
      smallestValuePaint: {
        fill: cyan['100'],
        opacity: 0.6
      },
      largestValuePaint: {
        fill: cyan['700'],
        opacity: 0.8
      },
      data: postiveCasesByCountry,
      dataPointToValue: (dataPoint) => dataPoint.value
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

    const { linearLegendColourGradientConfiguration } = mapColourBucketsToLinearGradientConfiguration({
      mapColourBuckets,
      minimumPossibleValue: 0
    });

    return {
      paint: generateStandardMapPaint({
        mapColourBuckets,
        outlinedCountryAlphaThreeCodes,
        outlinedCountryAlphaThreeCodesWithNoData: outlinedCountryAlphaThreeCodesWithNoPositiveCaseData
      }),
      countryHighlightLayerLegendEntries: [],
      freeTextEntries: getFreeTextEntries({ countryOutlinesEnabled: input.countryOutlinesEnabled }),
      linearLegendColourGradientConfiguration: {
        enabled: linearLegendColourGradientConfiguration.enabled,
        props: {
          ticks: linearLegendColourGradientConfiguration.props.ticks,
          title: 'Human Cases By Country'
        }
      }
    }
  }, [ getFreeTextEntries ]);

  return {
    getCountryHighlightingLayerInformation
  }
}