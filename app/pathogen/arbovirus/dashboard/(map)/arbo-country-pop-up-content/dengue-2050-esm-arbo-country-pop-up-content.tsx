import { ArboCountryPopupContentProps } from "../arbo-country-pop-up-content";
import { ArbovirusEnvironmentalSuitabilityMaps } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-environmental-suitability-country-data-context";
import { GenericMapPopUp, GenericMapPopUpWidth } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { useEsmPopUpContent } from "./use-esm-pop-up-content";

type Dengue2050EsmArboCountryPopupContentProps = {
  hidden: boolean;
} & Pick<ArboCountryPopupContentProps, 'record'|'arbovirusEnvironmentalSuitabilityCountryData'>;

export const Dengue2050EsmArboCountryPopupContent = (props: Dengue2050EsmArboCountryPopupContentProps): React.ReactNode => {
  const {
    headerConfiguration,
    topBannerConfiguration,
    rows,
    bottomBannerConfiguration
  } = useEsmPopUpContent({
    selectedEsm: ArbovirusEnvironmentalSuitabilityMaps.DENGUE_2050,
    record: props.record,
    arbovirusEnvironmentalSuitabilityCountryData: props.arbovirusEnvironmentalSuitabilityCountryData
  })

  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.EXTRA_WIDE}
      headerConfiguration={headerConfiguration}
      subtitleConfiguration={{
        enabled: false
      }}
      topBannerConfiguration={topBannerConfiguration}
      alternateViewConfiguration={{ enabled: false }}
      rows={rows}
      className={props.hidden ? 'hidden' : ''}
      bottomBannerConfiguration={bottomBannerConfiguration}
    />
  );
}