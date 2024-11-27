import { rose } from 'tailwindcss/colors'
import Link from 'next/link';
import uniq from 'lodash/uniq';
import { useCallback, useContext } from "react";
import {
  GetCountryHighlightingLayerInformationInput as GenericGetCountryHighlightingLayerInformationInput,
  GetCountryHighlightingLayerInformationOutput,
} from "@/components/ui/pathogen-map/pathogen-map";
import { generateMapColourBuckets } from "@/components/ui/pathogen-map/country-highlight-layers/generate-map-colour-buckets";
import { MapSymbology } from '@/app/pathogen/sarscov2/dashboard/(map)/map-config';
import { MersMapCustomizationsContext } from '@/contexts/pathogen-context/pathogen-contexts/mers/map-customizations-context';
import { mapColourBucketsToLinearGradientConfiguration } from '@/components/ui/pathogen-map/country-highlight-layers/map-colour-buckets-to-linear-gradient-configuration';
import { generateStandardMapPaint, standardGetFreeTextEntriesFunction } from './helpers';

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

export const useTotalCamelPopulationLayer = () => {
  const { mapDataPointVisibilitySetting } = useContext(MersMapCustomizationsContext);

  const getFreeTextEntries = useCallback((input: GetFreeTextEntriesInput) => standardGetFreeTextEntriesFunction({
    countryOutlinesEnabled: input.countryOutlinesEnabled,
    mapDataPointVisibilitySetting
  }), [ mapDataPointVisibilitySetting ]);

  const getCountryHighlightingLayerInformation = useCallback(<
    TData extends {
      countryAlphaThreeCode: string;
      camelCount?: number | undefined | null;
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
        .map((dataPoint) => ({ value: dataPoint.camelCount, countryAlphaThreeCode: dataPoint.countryAlphaThreeCode }))
        .filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'value'> & {
          value: NonNullable<typeof dataPoint['value']>
        } => dataPoint.value !== undefined && dataPoint.value !== null),
      dataPointToValue: (dataPoint) => dataPoint.value
    });

    const countryHighlightLayerLegendEntries = [
      { description: "Camel population data unavailable", colour: MapSymbology.CountryFeature.Default.Color },
    ];

    const outlinedCountryAlphaThreeCodes = input.countryOutlinesEnabled ? uniq(input.countryOutlineData.map(({ countryAlphaThreeCode }) => countryAlphaThreeCode)) : [];
    const countryAlphaThreeCodesWithCamelData = uniq(input.data.map(( { countryAlphaThreeCode }) => countryAlphaThreeCode))
    const outlinedCountryAlphaThreeCodesWithNoCamelData = outlinedCountryAlphaThreeCodes.filter((alphaThreeCode) => !countryAlphaThreeCodesWithCamelData.includes(alphaThreeCode));

    const { linearLegendColourGradientConfiguration } = mapColourBucketsToLinearGradientConfiguration({
      mapColourBuckets,
      minimumPossibleValue: 0
    });

    return {
      paint: generateStandardMapPaint({
        mapColourBuckets,
        outlinedCountryAlphaThreeCodes,
        outlinedCountryAlphaThreeCodesWithNoData: outlinedCountryAlphaThreeCodesWithNoCamelData
      }),
      countryHighlightLayerLegendEntries,
      freeTextEntries: getFreeTextEntries({ countryOutlinesEnabled: input.countryOutlinesEnabled }),
      linearLegendColourGradientConfiguration: {
        enabled: linearLegendColourGradientConfiguration.enabled,
        props: {
          ticks: linearLegendColourGradientConfiguration.props.ticks,
          title: 'Camel Population By Country or Area'
        }
      },
      legendTooltipContent: (
        <div>
          <p className='inline text-sm'>Unpublished camel population map based on a FAO elaboration from the Global Livestock Impact Mapping System (GLIMS) database and adjusted to FAOSTAT 2020. Country boundaries based on </p>
          <p className="inline font-bold text-sm">UN Geospatial</p>
          <p className='inline text-sm'>. 2023. Map of the World. In: </p>
          <p className='inline italics text-sm'>United Nations</p>
          <p className='inline text-sm'>. [Cited: November 2024].</p>
          <Link className="inline text-link text-sm" href="www.un.org/geospatial/content/map-world-1" target="__blank" rel="noopener noreferrer">www.un.org/geospatial/content/map-world-1</Link>
        </div>
      )
    }
  }, [ getFreeTextEntries ]);

  return {
    getCountryHighlightingLayerInformation
  }
}