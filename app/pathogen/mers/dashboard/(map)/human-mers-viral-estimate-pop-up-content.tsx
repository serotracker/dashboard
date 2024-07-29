import { useMemo } from 'react';
import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { PopUpContentRowType } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import { GenerateMersEstimateTableConfigurationsType, HumanMersViralEstimateMapMarkerData, ageGroupToColourClassnameMap, generateAlternateViewBannerConfiguration, generateMersEstimateTableConfigurations, getHumanMersEstimateRows, getSharedMersEstimateRows } from "./shared-mers-map-pop-up-variables";

interface HumanMersViralEstimatePopupContentProps {
  estimate: HumanMersViralEstimateMapMarkerData;
}

export const HumanMersViralEstimatePopupContent = (props: HumanMersViralEstimatePopupContentProps) => {
  const { estimate } = props;

  const topBannerText = useMemo(() => {
    const positivePrevalencePercentageText = `Positive Prevalence: ${(estimate.primaryEstimateInfo.positivePrevalence * 100).toFixed(1)}%`;

    return `${positivePrevalencePercentageText}`
  }, [ estimate ]);

  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.EXTRA_EXTRA_WIDE}
      headerConfiguration={{
        text: "Human Viral Estimate",
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
        bannerColourClassname: 'bg-mers-human-viral-estimate',
        isTextBolded: true,
        isTextCentered: false,
        ...generateAlternateViewBannerConfiguration({
          estimate: props.estimate,
        })
      }}
      alternateViewConfiguration={{
        enabled: true,
        tableConfigurations: generateMersEstimateTableConfigurations({
          type: GenerateMersEstimateTableConfigurationsType.VIRAL_ESTIMATES,
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