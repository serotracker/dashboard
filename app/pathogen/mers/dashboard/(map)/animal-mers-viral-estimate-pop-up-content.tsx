import { MouseEventHandler, useMemo } from 'react';
import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import {
  AnimalMersViralEstimateMapMarkerData,
  GenerateMersEstimateTableConfigurationsType,
  animalSpeciesToColourClassnameMap,
  animalSpeciesToStringMap,
  generateAlternateViewBannerConfiguration,
  generateMersEstimateTableConfigurations,
  getAnimalMersEstimateRows,
  useMersEstimateRows
} from "./shared-mers-map-pop-up-variables";

interface AnimalMersViralEstimatePopupContentProps {
  estimate: AnimalMersViralEstimateMapMarkerData;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  className?: string;
}

export const AnimalMersViralEstimatePopupContent = (props: AnimalMersViralEstimatePopupContentProps) => {
  const { estimate } = props;

  const { getSharedMersEstimateRows } = useMersEstimateRows();

  const topBannerText = useMemo(() => {
    const positivePrevalencePercentageText = `Positive Prevalence: ${(estimate.primaryEstimateInfo.positivePrevalence * 100).toFixed(1)}%`;

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
        text: "Animal Viral Estimate",
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
        bannerColourClassname: 'bg-mers-animal-viral-estimate',
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
      rows={[
        ...getSharedMersEstimateRows(props.estimate),
        ...getAnimalMersEstimateRows(props.estimate)
      ]}
      bottomBannerConfiguration={{
        enabled: true,
        bannerText: `Animal Species: ${animalSpeciesToStringMap[props.estimate.primaryEstimateInfo.animalSpecies]}`,
        bannerColourClassname: animalSpeciesToColourClassnameMap[props.estimate.primaryEstimateInfo.animalSpecies],
        isTextBolded: true,
        isTextCentered: true,
        alternateViewButtonEnabled: false
      }}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      className={props.className}
    />
  );
}