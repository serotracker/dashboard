import { useMemo } from 'react';
import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { PopUpContentRowType } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import { GenerateMersEstimateTableConfigurationsType, HumanMersSeroprevalenceEstimateMapMarkerData, ageGroupToColourClassnameMap, generateAlternateViewBannerConfiguration, generateMersEstimateTableConfigurations, getHumanMersEstimateRows, getSharedMersEstimateRows } from "./shared-mers-map-pop-up-variables";

interface HumanMersSeroprevalenceEstimatePopupContentProps {
  estimate: HumanMersSeroprevalenceEstimateMapMarkerData;
}

export const HumanMersSeroprevalenceEstimatePopupContent = (props: HumanMersSeroprevalenceEstimatePopupContentProps) => {
  const { estimate } = props;

  const topBannerText = useMemo(() => {
    const seroprevalencePercentageText = `Seroprevalence: ${(estimate.primaryEstimateInfo.seroprevalence * 100).toFixed(1)}%`;

    return `${seroprevalencePercentageText}`
  }, [ estimate ]);

  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.EXTRA_EXTRA_WIDE}
      headerConfiguration={{
        text: "Human Seroprevalence Estimate",
        textAlignment: HeaderConfigurationTextAlignment.CENTER
      }}
      subtitleConfiguration={{
        enabled: true,
        text: props.estimate.primaryEstimateInfo.sourceTitle,
        link: props.estimate.primaryEstimateInfo.sourceUrl ?? undefined
      }}
      topBannerConfiguration={{
        enabled: true,
        bannerText: topBannerText,
        bannerColourClassname: 'bg-mers-human-estimate',
        isTextBolded: true,
        isTextCentered: false,
        ...generateAlternateViewBannerConfiguration({
          estimate: props.estimate,
        })
      }}
      alternateViewConfiguration={{
        enabled: true,
        tableConfigurations: generateMersEstimateTableConfigurations({
          type: GenerateMersEstimateTableConfigurationsType.SEROPREVALENCE_ESTIMATES,
          estimate
        })
      }}
      rows={[
        ...getSharedMersEstimateRows(props.estimate),
        ...getHumanMersEstimateRows(props.estimate)
      ]}
      bottomBannerConfiguration={{
        enabled: false
      }}
    />
  );
}