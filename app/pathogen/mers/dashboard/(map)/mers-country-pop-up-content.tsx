import { useMemo } from 'react';
import {
  GenericMapPopUp,
  GenericMapPopUpWidth,
  HeaderConfigurationTextAlignment
} from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import {
  AnimalMersEventMapMarkerData,
  HumanMersEventMapMarkerData,
  MersMapMarkerData,
  HumanMersSeroprevalenceEstimateMapMarkerData,
  isHumanMersSeroprevalenceEstimateMapMarkerData,
  AnimalMersSeroprevalenceEstimateMapMarkerData,
  isAnimalMersSeroprevalenceEstimateMapMarkerData,
  HumanMersViralEstimateMapMarkerData,
  isHumanMersViralEstimateMapMarkerData,
  AnimalMersViralEstimateMapMarkerData,
  isAnimalMersViralEstimateMapMarkerData,
  isMersFaoAnimalEventMapMarkerData,
  isMersFaoHumanEventMapMarkerData
} from "./shared-mers-map-pop-up-variables";
import { PopUpContentRowType, PopupContentTextAlignment } from '@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows';

interface MersCountryPopupContentProps {
  record: {
    id: string,
    alpha3CountryCode: string,
    countryName: string,
    latitude: string,
    longitude: string,
    dataPoints: MersMapMarkerData[]
  }
  estimateDataShown: boolean;
  eventDataShown: boolean;
}

export const MersCountryPopupContent = (props: MersCountryPopupContentProps): React.ReactNode => {
  const { dataPoints } = props.record;
  const { estimateDataShown, eventDataShown } = props;

  const allHumanMersSeroprevalenceEstimates = useMemo(() => dataPoints.filter((dataPoint): dataPoint is HumanMersSeroprevalenceEstimateMapMarkerData =>
    isHumanMersSeroprevalenceEstimateMapMarkerData(dataPoint))
  , [ dataPoints ])

  const humanMersSeroprevalenceRange = useMemo(() => allHumanMersSeroprevalenceEstimates.length > 0
    ? `Human seroprevalence ranges from ${(Math.min(
      ...allHumanMersSeroprevalenceEstimates.map((estimate) => estimate.primaryEstimateInfo.seroprevalence)
    ) * 100).toFixed(1)}% - ${(Math.max(
      ...allHumanMersSeroprevalenceEstimates.map((estimate) => estimate.primaryEstimateInfo.seroprevalence)
    ) * 100).toFixed(1)}% across the ${
      allHumanMersSeroprevalenceEstimates.length
    } estimate(s) in our database`
    : 'No estimates in our database'
  , [ allHumanMersSeroprevalenceEstimates ]);

  const allAnimalMersSeroprevalenceEstimates = useMemo(() => dataPoints.filter((dataPoint): dataPoint is AnimalMersSeroprevalenceEstimateMapMarkerData =>
    isAnimalMersSeroprevalenceEstimateMapMarkerData(dataPoint))
  , [ dataPoints ])

  const animalMersSeroprevalenceRange = useMemo(() => allAnimalMersSeroprevalenceEstimates.length > 0
    ? `Animal seroprevalence ranges from ${(Math.min(
      ...allAnimalMersSeroprevalenceEstimates.map((estimate) => estimate.primaryEstimateInfo.seroprevalence)
    ) * 100).toFixed(1)}% - ${(Math.max(
      ...allAnimalMersSeroprevalenceEstimates.map((estimate) => estimate.primaryEstimateInfo.seroprevalence)
    ) * 100).toFixed(1)}% across the ${
      allAnimalMersSeroprevalenceEstimates.length
    } estimate(s) in our database`
    : 'No estimates in our database'
  , [ allAnimalMersSeroprevalenceEstimates ]);

  const allHumanMersViralEstimates = useMemo(() => dataPoints.filter((dataPoint): dataPoint is HumanMersViralEstimateMapMarkerData =>
    isHumanMersViralEstimateMapMarkerData(dataPoint))
  , [ dataPoints ]);

  const humanMersViralPrevalenceRange = useMemo(() => allHumanMersViralEstimates.length > 0
    ? `Human viral prevalence ranges from ${(Math.min(
      ...allHumanMersViralEstimates.map((estimate) => estimate.primaryEstimateInfo.positivePrevalence)
    ) * 100).toFixed(1)}% - ${(Math.max(
      ...allHumanMersViralEstimates.map((estimate) => estimate.primaryEstimateInfo.positivePrevalence)
    ) * 100).toFixed(1)}% across the ${
      allHumanMersViralEstimates.length
    } estimate(s) in our database`
    : 'No estimates in our database'
  , [ allHumanMersViralEstimates ]);

  const allAnimalMersViralEstimates = useMemo(() => dataPoints.filter((dataPoint): dataPoint is AnimalMersViralEstimateMapMarkerData =>
    isAnimalMersViralEstimateMapMarkerData(dataPoint))
  , [ dataPoints ])

  const animalMersViralPrevalenceRange = useMemo(() => allAnimalMersViralEstimates.length > 0
    ? `Animal viral prevalence ranges from ${(Math.min(
      ...allAnimalMersViralEstimates.map((estimate) => estimate.primaryEstimateInfo.positivePrevalence)
    ) * 100).toFixed(1)}% - ${(Math.max(
      ...allAnimalMersViralEstimates.map((estimate) => estimate.primaryEstimateInfo.positivePrevalence)
    ) * 100).toFixed(1)}% across the ${
      allAnimalMersViralEstimates.length
    } estimate(s) in our database`
    : 'No estimates in our database'
  , [ allAnimalMersViralEstimates ]);

  const allHumanMersEvents = useMemo(() => dataPoints.filter((dataPoint): dataPoint is HumanMersEventMapMarkerData =>
    isMersFaoHumanEventMapMarkerData(dataPoint))
  , [ dataPoints ])

  const allAnimalMersEvents = useMemo(() => dataPoints.filter((dataPoint): dataPoint is AnimalMersEventMapMarkerData =>
    isMersFaoAnimalEventMapMarkerData(dataPoint))
  , [ dataPoints ])

  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.EXTRA_WIDE}
      headerConfiguration={{
        text: props.record.countryName,
        textAlignment: HeaderConfigurationTextAlignment.CENTER
      }}
      subtitleConfiguration={{
        enabled: false
      }}
      topBannerConfiguration={{
        enabled: false
      }}
      alternateViewConfiguration={{ enabled: false }}
      rows={[
        ...(estimateDataShown ? [{
          title: 'Human Seroprevalence Estimates'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.TEXT as const,
          text: humanMersSeroprevalenceRange,
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-human-estimate' },
          rightPaddingEnabled: false
        }] : []),
        ...(estimateDataShown ? [{
          title: 'Animal Seroprevalence Estimates'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.TEXT as const,
          text: animalMersSeroprevalenceRange,
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-animal-estimate' },
          rightPaddingEnabled: false
        }] : []),
        ...(estimateDataShown ? [{
          title: 'Human Viral Estimates'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.TEXT as const,
          text: humanMersViralPrevalenceRange,
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-human-viral-estimate' },
          rightPaddingEnabled: false
        }] : []),
        ...(estimateDataShown ? [{
          title: 'Animal Viral Estimates'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.TEXT as const,
          text: animalMersViralPrevalenceRange,
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-animal-viral-estimate' },
          rightPaddingEnabled: false
        }] : []),
        ...(eventDataShown ? [{
          title: 'Human Cases'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.NUMBER as const,
          value: allHumanMersEvents.reduce((accumulator, value) => accumulator + value.humansAffected, 0),
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-human-event' },
          rightPaddingEnabled: false
        }] : []),
        ...(eventDataShown ? [{
          title: 'Human Deaths'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.NUMBER as const,
          value: allHumanMersEvents.reduce((accumulator, value) => accumulator + value.humanDeaths, 0),
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-human-event-alt' },
          rightPaddingEnabled: false
        }] : []),
        ...(eventDataShown ? [{
          title: 'Animal Cases'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.NUMBER as const,
          value: allAnimalMersEvents.length,
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-animal-event' },
          rightPaddingEnabled: false
        }] : []),
      ]}
      bottomBannerConfiguration={{
        enabled: false
      }}
    />
  );
}