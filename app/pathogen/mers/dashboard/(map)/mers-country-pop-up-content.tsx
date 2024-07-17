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
  HumanMersEstimateMapMarkerData,
  isHumanMersEstimateMapMarkerData,
  AnimalMersEstimateMapMarkerData,
  isAnimalMersEstimateMapMarkerData,
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

  const allHumanMersEstimates = useMemo(() => dataPoints.filter((dataPoint): dataPoint is HumanMersEstimateMapMarkerData =>
    isHumanMersEstimateMapMarkerData(dataPoint))
  , [ dataPoints ])
  const allAnimalMersEstimates = useMemo(() => dataPoints.filter((dataPoint): dataPoint is AnimalMersEstimateMapMarkerData =>
    isAnimalMersEstimateMapMarkerData(dataPoint))
  , [ dataPoints ])
  const allHumanMersEvents = useMemo(() => dataPoints.filter((dataPoint): dataPoint is HumanMersEventMapMarkerData =>
    isMersFaoHumanEventMapMarkerData(dataPoint))
  , [ dataPoints ])
  const allAnimalMersEvents = useMemo(() => dataPoints.filter((dataPoint): dataPoint is AnimalMersEventMapMarkerData =>
    isMersFaoAnimalEventMapMarkerData(dataPoint))
  , [ dataPoints ])

  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.MEDIUM}
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
      rows={[
        {
          title: 'Human Seroprevalence Estimates'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.NUMBER as const,
          value: allHumanMersEstimates.length,
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-human-estimate' },
          rightPaddingEnabled: false
        },
        {
          title: 'Animal Seroprevalence Estimates'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.NUMBER as const,
          value: allAnimalMersEstimates.length,
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-animal-estimate' },
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