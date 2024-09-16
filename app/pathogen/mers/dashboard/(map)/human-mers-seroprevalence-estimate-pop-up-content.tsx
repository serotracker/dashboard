import { MouseEventHandler, useMemo } from 'react';
import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import {
  GenerateMersEstimateTableConfigurationsType,
  HumanMersSeroprevalenceEstimateMapMarkerData,
  generateAlternateViewBannerConfiguration,
  generateMersEstimateTableConfigurations,
  useMersEstimateRows
} from "./shared-mers-map-pop-up-variables";

interface HumanMersSeroprevalenceEstimatePopupContentProps {
  estimate: HumanMersSeroprevalenceEstimateMapMarkerData;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  className?: string;
}

export const HumanMersSeroprevalenceEstimatePopupContent = (props: HumanMersSeroprevalenceEstimatePopupContentProps) => {
  const { estimate } = props;

  const { getSharedMersEstimateRows } = useMersEstimateRows();

  const topBannerText = useMemo(() => {
    const seroprevalencePercentageText = `Seroprevalence: ${(estimate.primaryEstimateInfo.seroprevalence * 100).toFixed(1)}%`;

    return `${seroprevalencePercentageText}`
  }, [ estimate ]);

  const tableConfigurations = useMemo(() => generateMersEstimateTableConfigurations({
    type: GenerateMersEstimateTableConfigurationsType.SEROPREVALENCE_ESTIMATES,
    estimate
  }), [ estimate ]);

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