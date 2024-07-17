import { useMemo } from 'react';
import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { PopUpContentRowType } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import { HumanMersEstimateMapMarkerData } from "./shared-mers-map-pop-up-variables";

interface HumanMersEstimatePopupContentProps {
  estimate: HumanMersEstimateMapMarkerData;
}

export const HumanMersEstimatePopupContent = (props: HumanMersEstimatePopupContentProps) => {
  const { estimate } = props;

  const topBannerText = useMemo(() => {
    const seroprevalencePercentageText = `Seroprevalence: ${(estimate.seroprevalence * 100).toFixed(1)}%`;

    return `${seroprevalencePercentageText}`
  }, [ estimate ]);

  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.WIDE}
      headerConfiguration={{
        text: "Human Seroprevalence Estimate",
        textAlignment: HeaderConfigurationTextAlignment.CENTER
      }}
      subtitleConfiguration={{
        enabled: true,
        text: props.estimate.sourceTitle,
        link: props.estimate.sourceUrl ?? undefined
      }}
      topBannerConfiguration={{
        enabled: true,
        bannerText: topBannerText,
        bannerColourClassname: 'bg-mers-human-estimate',
        isTextBolded: true,
        isTextCentered: false
      }}
      rows={[{
        title: "Location",
        type: PopUpContentRowType.LOCATION,
        countryName: props.estimate.country,
        stateName: props.estimate.state ?? undefined,
        cityName: props.estimate.city ?? undefined
      }, {
        title: "Source Type",
        type: PopUpContentRowType.TEXT,
        text: props.estimate.sourceType ?? 'Not Reported'
      }, {
        title: "First Author Full Name",
        type: PopUpContentRowType.TEXT,
        text: props.estimate.firstAuthorFullName ?? 'Not Reported'
      }, {
        title: "Institution",
        type: PopUpContentRowType.TEXT,
        text: props.estimate.insitutution ?? 'Not Reported'
      }]}
      bottomBannerConfiguration={{
        enabled: false
      }}
    />
  );
}