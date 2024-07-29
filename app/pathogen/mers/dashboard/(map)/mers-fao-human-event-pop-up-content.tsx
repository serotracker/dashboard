import { parseISO } from 'date-fns';
import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { PopUpContentRowType } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import { HumanMersEventMapMarkerData, diagnosisSourceToStringMap, diagnosisStatusToColourClassnameMap, diagnosisStatusToStringMap } from './shared-mers-map-pop-up-variables';

interface MersFaoHumanEventPopupContentProps {
  event: HumanMersEventMapMarkerData;
}

export const MersFaoHumanEventPopupContent = (props: MersFaoHumanEventPopupContentProps) => {
  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.WIDE}
      headerConfiguration={{
        text: "Human MERS Case",
        textAlignment: HeaderConfigurationTextAlignment.CENTER
      }}
      subtitleConfiguration={{
        enabled: false,
      }}
      topBannerConfiguration={{
        enabled: true,
        bannerText: `${diagnosisStatusToStringMap[props.event.diagnosisStatus]} Case`,
        bannerColourClassname: diagnosisStatusToColourClassnameMap[props.event.diagnosisStatus],
        isTextBolded: true,
        isTextCentered: true,
        alternateViewButtonEnabled: false
      }}
      alternateViewConfiguration={{ enabled: false }}
      rows={[{
        title: "Location",
        type: PopUpContentRowType.LOCATION,
        countryName: props.event.country ?? 'Unknown',
        stateName: props.event.state,
        cityName: props.event.city
      }, {
        title: "Reported at",
        type: PopUpContentRowType.DATE,
        date: parseISO(props.event.reportDate)
      }, (
        props.event.observationDate 
        ? {
          title: "Observed at",
          type: PopUpContentRowType.DATE,
          date: parseISO(props.event.observationDate)
        }
        : {
          title: "Observed at",
          type: PopUpContentRowType.TEXT,
          text: 'Not Applicable'
        }
      ), {
        title: "Reported by",
        type: PopUpContentRowType.TEXT,
        text: diagnosisSourceToStringMap[props.event.diagnosisSource]
      }, {
        title: "Humans Affected",
        type: PopUpContentRowType.NUMBER,
        value: props.event.humansAffected,
      }, {
        title: "Human Deaths",
        type: PopUpContentRowType.NUMBER,
        value: props.event.humanDeaths,
      }]}
      bottomBannerConfiguration={{
        enabled: false
      }}
    />
  );
}