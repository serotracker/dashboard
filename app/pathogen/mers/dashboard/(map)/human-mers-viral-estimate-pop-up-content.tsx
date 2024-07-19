import { useMemo } from 'react';
import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { PopUpContentRowType } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import { HumanMersViralEstimateMapMarkerData } from "./shared-mers-map-pop-up-variables";

interface HumanMersViralEstimatePopupContentProps {
  estimate: HumanMersViralEstimateMapMarkerData;
}

export const HumanMersViralEstimatePopupContent = (props: HumanMersViralEstimatePopupContentProps) => {
  const { estimate } = props;

  const topBannerText = useMemo(() => {
    const positivePrevalencePercentageText = `Positive Prevalence: ${(estimate.positivePrevalence * 100).toFixed(1)}%`;

    return `${positivePrevalencePercentageText}`
  }, [ estimate ]);

  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.WIDE}
      headerConfiguration={{
        text: "Human Viral Estimate",
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
        bannerColourClassname: 'bg-mers-human-viral-estimate',
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