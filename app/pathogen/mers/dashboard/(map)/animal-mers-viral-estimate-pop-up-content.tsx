import { useMemo } from 'react';
import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { PopUpContentRowType } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import { AnimalMersViralEstimateMapMarkerData, animalSpeciesToColourClassnameMap, animalSpeciesToStringMap, animalTypeToColourClassnameMap, animalTypeToStringMap, getAnimalMersEstimateRows, getSharedMersEstimateRows } from "./shared-mers-map-pop-up-variables";

interface AnimalMersViralEstimatePopupContentProps {
  estimate: AnimalMersViralEstimateMapMarkerData;
}

export const AnimalMersViralEstimatePopupContent = (props: AnimalMersViralEstimatePopupContentProps) => {
  const { estimate } = props;

  const topBannerText = useMemo(() => {
    const positivePrevalencePercentageText = `Positive Prevalence: ${(estimate.primaryEstimateInfo.positivePrevalence * 100).toFixed(1)}%`;

    return `${positivePrevalencePercentageText}`
  }, [ estimate ]);

  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.EXTRA_WIDE}
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
        isTextCentered: false
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
        isTextCentered: true
      }}
    />
  );
}