import { useMemo } from 'react';
import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { AnimalMersSeroprevalenceEstimateMapMarkerData, animalSpeciesToColourClassnameMap, animalSpeciesToStringMap, getAnimalMersEstimateRows, getSharedMersEstimateRows } from "./shared-mers-map-pop-up-variables";

interface AnimalMersSeroprevalenceEstimatePopupContentProps {
  estimate: AnimalMersSeroprevalenceEstimateMapMarkerData;
}

export const AnimalMersSeroprevalenceEstimatePopupContent = (props: AnimalMersSeroprevalenceEstimatePopupContentProps) => {
  const { estimate } = props;

  const topBannerText = useMemo(() => {
    const seroprevalencePercentageText = `Seroprevalence: ${(estimate.seroprevalence * 100).toFixed(1)}%`;

    return `${seroprevalencePercentageText}`
  }, [ estimate ]);

  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.EXTRA_WIDE}
      headerConfiguration={{
        text: "Animal Seroprevalence Estimate",
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
        bannerColourClassname: 'bg-mers-animal-estimate',
        isTextBolded: true,
        isTextCentered: false
      }}
      rows={[
        ...getSharedMersEstimateRows(props.estimate),
        ...getAnimalMersEstimateRows(props.estimate)
      ]}
      bottomBannerConfiguration={{
        enabled: true,
        bannerText: `Animal Species: ${animalSpeciesToStringMap[props.estimate.animalSpecies]}`,
        bannerColourClassname: animalSpeciesToColourClassnameMap[props.estimate.animalSpecies],
        isTextBolded: true,
        isTextCentered: true
      }}
    />
  );
}