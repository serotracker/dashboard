import { useMemo } from 'react';
import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { AnimalMersSeroprevalenceEstimateMapMarkerData, GenerateMersEstimateTableConfigurationsType, animalSpeciesToColourClassnameMap, animalSpeciesToStringMap, generateAlternateViewBannerConfiguration, generateMersEstimateTableConfigurations, getAnimalMersEstimateRows, getSharedMersEstimateRows } from "./shared-mers-map-pop-up-variables";

interface AnimalMersSeroprevalenceEstimatePopupContentProps {
  estimate: AnimalMersSeroprevalenceEstimateMapMarkerData;
}

export const AnimalMersSeroprevalenceEstimatePopupContent = (props: AnimalMersSeroprevalenceEstimatePopupContentProps) => {
  const { estimate } = props;

  const topBannerText = useMemo(() => {
    const seroprevalencePercentageText = `Seroprevalence: ${(estimate.primaryEstimateInfo.seroprevalence * 100).toFixed(1)}%`;

    return `${seroprevalencePercentageText}`
  }, [ estimate ]);

  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.EXTRA_EXTRA_WIDE}
      headerConfiguration={{
        text: "Animal Seroprevalence Estimate",
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
        bannerColourClassname: 'bg-mers-animal-estimate',
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
    />
  );
}