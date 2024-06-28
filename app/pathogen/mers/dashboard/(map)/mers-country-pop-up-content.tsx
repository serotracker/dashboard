import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";

interface MersCountryPopupContentProps {
  record: {
    id: string,
    alpha3CountryCode: string,
    countryName: string,
    latitude: string,
    longitude: string,
    dataPoints: Pick<SarsCov2Estimate, 'country'>[],
  }
}

export const MersCountryPopupContent = (props: MersCountryPopupContentProps): React.ReactNode => {
  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.THIN}
      headerConfiguration={{
        text: props.record.countryName,
        textAlignment: HeaderConfigurationTextAlignment.CENTER
      }}
      subtitleConfiguration={{
        enabled: false
      }}
      topBannerConfiguration={{
        enabled: false
      }}
      rows={[]}
      bottomBannerConfiguration={{
        enabled: false
      }}
    />
  );
}