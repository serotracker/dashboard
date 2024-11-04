import { MouseEventHandler, useMemo } from 'react';
import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import {
  GenerateMersEstimateTableConfigurationsType,
  HumanMersViralEstimateMapMarkerData,
  generateAlternateViewBannerConfiguration,
  generateMersEstimateTableConfigurations,
  useMersEstimateRows
} from "./shared-mers-map-pop-up-variables";

interface HumanMersViralEstimatePopupContentProps {
  estimate: HumanMersViralEstimateMapMarkerData;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  className?: string;
}

export const HumanMersViralEstimatePopupContent = (props: HumanMersViralEstimatePopupContentProps) => {
  const { estimate } = props;

  const { getSharedMersEstimateRows } = useMersEstimateRows();

  const topBannerText = useMemo(() => {
    const positivePrevalencePercentageText = `Positive Prevalence: ${(estimate.primaryEstimateInfo.positivePrevalence * 100).toFixed(3)}%`;

    return `${positivePrevalencePercentageText}`
  }, [ estimate ]);

  const tableConfigurations = useMemo(() => generateMersEstimateTableConfigurations({
    type: GenerateMersEstimateTableConfigurationsType.VIRAL_ESTIMATES,
    estimate
  }), [ estimate ]);

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
        tableConfigurations
      }}
      rows={getSharedMersEstimateRows(props.estimate)}
      bottomBannerConfiguration={{
        enabled: false
      }}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      className={props.className}
    />
  );
}