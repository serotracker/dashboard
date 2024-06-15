import { useMemo } from 'react';
import {
  GenericMapPopUp,
  GenericMapPopUpWidth,
  HeaderConfigurationTextAlignment
} from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import {
  AnimalMersEventMapMarkerData,
  HumanMersEventMapMarkerData,
  MersEstimateMapMarkerData,
  MersMapMarkerData,
  isMersEstimateMapMarkerData,
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

  const allMersEstimates = useMemo(() => dataPoints.filter((dataPoint): dataPoint is MersEstimateMapMarkerData =>
    isMersEstimateMapMarkerData(dataPoint))
  , [ dataPoints ])
  const allHumanMersEvents = useMemo(() => dataPoints.filter((dataPoint): dataPoint is HumanMersEventMapMarkerData =>
    isMersFaoHumanEventMapMarkerData(dataPoint))
  , [ dataPoints ])
  const allAnimalMersEvents = useMemo(() => dataPoints.filter((dataPoint): dataPoint is AnimalMersEventMapMarkerData =>
    isMersFaoAnimalEventMapMarkerData(dataPoint))
  , [ dataPoints ])

  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.THIN}
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
          title: 'Seroprevalence Estimates'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.NUMBER as const,
          value: allMersEstimates.length,
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-estimate' },
          rightPaddingEnabled: false
        },
        {
          title: 'Confirmed Human Cases'.replace(' ', '\u00A0'),
          type: PopUpContentRowType.NUMBER as const,
          value: allHumanMersEvents.length,
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: { ribbonColourClassname: 'bg-mers-human-event' },
          rightPaddingEnabled: false
        },
        {
          title: 'Confirmed Animal Cases'.replace(' ', '\u00A0'),
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