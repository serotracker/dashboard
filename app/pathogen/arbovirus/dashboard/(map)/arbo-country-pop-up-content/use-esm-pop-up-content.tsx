import { useMemo } from "react";
import { ArbovirusEnvironmentalSuitabilityMaps } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-environmental-suitability-country-data-context";
import { ArboCountryPopupContentProps, arbovirusToRibbonColourClassname } from "../arbo-country-pop-up-content";
import { HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { PopUpContentRowType, PopupContentTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import { Arbovirus } from "@/gql/graphql";
import { arboShortformToFullNameMap } from "../../(visualizations)/recharts";

export type useEsmPopUpContentInput = {
  selectedEsm: ArbovirusEnvironmentalSuitabilityMaps;
} & Pick<ArboCountryPopupContentProps, 'record'|'arbovirusEnvironmentalSuitabilityCountryData'>;

const selectedEsmToArbovirusMap = {
  [ArbovirusEnvironmentalSuitabilityMaps.ZIKA]: Arbovirus.Zikv,
  [ArbovirusEnvironmentalSuitabilityMaps.DENGUE_2015]: Arbovirus.Denv,
  [ArbovirusEnvironmentalSuitabilityMaps.DENGUE_2050]: Arbovirus.Denv,
}

export const useEsmPopUpContent = (input: useEsmPopUpContentInput) => {
  const { selectedEsm, record, arbovirusEnvironmentalSuitabilityCountryData } = input;

  const arbovirus = useMemo(() => selectedEsmToArbovirusMap[selectedEsm], [ selectedEsm ]);

  const correspondingRecord = useMemo(() => {
    const { alpha3CountryCode } = record;

    return arbovirusEnvironmentalSuitabilityCountryData
      .find((element) => element.countryAlphaThreeCode === alpha3CountryCode && element.environmentalSuitabilityMap === selectedEsm);
  }, [ record, arbovirusEnvironmentalSuitabilityCountryData, selectedEsm ])

  const headerConfiguration = useMemo(() => ({
    text: record.countryName,
    textAlignment: HeaderConfigurationTextAlignment.CENTER
  }), [ record ]);

  const topBannerConfiguration = useMemo(() => ({
    enabled: true as const,
    label: `Total ${arboShortformToFullNameMap[arbovirus]} Estimates`.replace(' ', '\u00A0'),
    value: record.dataPoints
      .filter((element) => element.pathogen === arbovirus)
      .length
      .toString(),
    valueTextAlignment: PopupContentTextAlignment.RIGHT,
    bannerColourClassname: arbovirusToRibbonColourClassname[arbovirus]
  }), [ record, arbovirus ]);

  const rows = useMemo(() => {
    if(!correspondingRecord) {
      return [];
    }

    return [
      {
        title: 'Maximum Environmental Suitability'.replace(' ', '\u00A0'),
        type: PopUpContentRowType.TEXT as const,
        text: (correspondingRecord.data.maximumValue * 100).toFixed(1),
        contentTextAlignment: PopupContentTextAlignment.RIGHT,
        rightPaddingEnabled: false
      },
      {
        title: 'Minimum Environmental Suitability'.replace(' ', '\u00A0'),
        type: PopUpContentRowType.TEXT as const,
        text: (correspondingRecord.data.minimumValue * 100).toFixed(1),
        contentTextAlignment: PopupContentTextAlignment.RIGHT,
        rightPaddingEnabled: false
      },
      {
        title: 'Mean Environmental Suitability'.replace(' ', '\u00A0'),
        type: PopUpContentRowType.TEXT as const,
        text: (correspondingRecord.data.meanValue * 100).toFixed(1),
        contentTextAlignment: PopupContentTextAlignment.RIGHT,
        rightPaddingEnabled: false
      },
      {
        title: 'Median Environmental Suitability'.replace(' ', '\u00A0'),
        type: PopUpContentRowType.TEXT as const,
        text: (correspondingRecord.data.medianValue * 100).toFixed(1),
        contentTextAlignment: PopupContentTextAlignment.RIGHT,
        rightPaddingEnabled: false
      },
      {
        title: 'Value which 90% of Environmental Suitability values are below'.replace(' ', '\u00A0'),
        type: PopUpContentRowType.TEXT as const,
        text: (correspondingRecord.data.ninetyPercentOfValuesAreBelowThisValue * 100).toFixed(1),
        contentTextAlignment: PopupContentTextAlignment.RIGHT,
        rightPaddingEnabled: false
      },
    ];
  }, [ correspondingRecord ]);

  const bottomBannerConfiguration = useMemo(() => {
    if(!correspondingRecord) {
      return { 
        enabled: false as const
      };
    };

    return {
      enabled: true as const,
      bannerText: 'For all environmental suitability values, 0.0 represents an environment which is not suitable at all and 100.0 represents the most suitable environments.',
      bannerColourClassname: 'bg-gray-200',
      isTextBolded: true,
      isTextCentered: true,
      alternateViewButtonEnabled: false as const
    }
  }, [ correspondingRecord ]);

  return {
    headerConfiguration,
    topBannerConfiguration,
    rows,
    bottomBannerConfiguration
  }
};