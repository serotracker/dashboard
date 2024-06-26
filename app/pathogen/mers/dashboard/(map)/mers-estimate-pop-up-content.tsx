import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { PopUpContentRowType } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import { MersEstimateMapMarkerData } from "./shared-mers-map-pop-up-variables";

interface MersEstimatePopupContentProps {
  estimate: MersEstimateMapMarkerData;
}

export const MersEstimatePopupContent = (props: MersEstimatePopupContentProps) => {
  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.WIDE}
      headerConfiguration={{
        text: "Study",
        textAlignment: HeaderConfigurationTextAlignment.LEFT
      }}
      subtitleConfiguration={{
        enabled: false,
      }}
      topBannerConfiguration={{
        enabled: false
      }}
      rows={[{
        title: "Location",
        type: PopUpContentRowType.LOCATION,
        countryName: props.estimate.country ?? 'Unknown',
        stateName: undefined,
        cityName: undefined
      }]}
      bottomBannerConfiguration={{
        enabled: false
      }}
    />
  );
}