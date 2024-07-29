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
}

export const MersCountryPopupContent = (props: MersCountryPopupContentProps): React.ReactNode => {
  const { dataPoints } = props.record;

  const allHumanMersSeroprevalenceEstimates = useMemo(() => dataPoints.filter((dataPoint): dataPoint is HumanMersSeroprevalenceEstimateMapMarkerData =>
    isHumanMersSeroprevalenceEstimateMapMarkerData(dataPoint))
  , [ dataPoints ])
  const allAnimalMersSeroprevalenceEstimates = useMemo(() => dataPoints.filter((dataPoint): dataPoint is AnimalMersSeroprevalenceEstimateMapMarkerData =>
    isAnimalMersSeroprevalenceEstimateMapMarkerData(dataPoint))
  , [ dataPoints ])
  const allHumanMersViralEstimates = useMemo(() => dataPoints.filter((dataPoint): dataPoint is HumanMersViralEstimateMapMarkerData =>
    isHumanMersViralEstimateMapMarkerData(dataPoint))
  , [ dataPoints ])
  const allAnimalMersViralEstimates = useMemo(() => dataPoints.filter((dataPoint): dataPoint is AnimalMersViralEstimateMapMarkerData =>
    isAnimalMersViralEstimateMapMarkerData(dataPoint))
  , [ dataPoints ])
  const allHumanMersEvents = useMemo(() => dataPoints.filter((dataPoint): dataPoint is HumanMersEventMapMarkerData =>
    isMersFaoHumanEventMapMarkerData(dataPoint))
  , [ dataPoints ])
  const allAnimalMersEvents = useMemo(() => dataPoints.filter((dataPoint): dataPoint is AnimalMersEventMapMarkerData =>
    isMersFaoAnimalEventMapMarkerData(dataPoint))
  , [ dataPoints ])

  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.WIDE}
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
        {
          title: 'Human Seroprevalence Estimates'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.NUMBER as const,
          value: allHumanMersSeroprevalenceEstimates.length,
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-human-estimate' },
          rightPaddingEnabled: false
        },
        {
          title: 'Animal Seroprevalence Estimates'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.NUMBER as const,
          value: allAnimalMersSeroprevalenceEstimates.length,
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-animal-estimate' },
          rightPaddingEnabled: false
        },
        {
          title: 'Human Viral Estimates'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.NUMBER as const,
          value: allHumanMersViralEstimates.length,
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-human-viral-estimate' },
          rightPaddingEnabled: false
        },
        {
          title: 'Animal Viral Estimates'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.NUMBER as const,
          value: allAnimalMersViralEstimates.length,
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-animal-viral-estimate' },
          rightPaddingEnabled: false
        },
        {
          title: 'Human Cases'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.NUMBER as const,
          value: allHumanMersEvents.reduce((accumulator, value) => accumulator + value.humansAffected, 0),
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-human-event' },
          rightPaddingEnabled: false
        },
        {
          title: 'Human Deaths'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.NUMBER as const,
          value: allHumanMersEvents.reduce((accumulator, value) => accumulator + value.humanDeaths, 0),
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-human-event-alt' },
          rightPaddingEnabled: false
        },
        {
          title: 'Animal Cases'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.NUMBER as const,
          value: allAnimalMersEvents.length,
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-animal-event' },
          rightPaddingEnabled: false
        },
      ]}
      bottomBannerConfiguration={{
        enabled: false
      }}
    />
  );
}