import { parseISO } from 'date-fns';
import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { PopUpContentRowType } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import { AnimalMersEventMapMarkerData, animalSpeciesToColourClassnameMap, animalSpeciesToStringMap, animalTypeToColourClassnameMap, animalTypeToStringMap, diagnosisSourceToStringMap, diagnosisStatusToColourClassnameMap, diagnosisStatusToStringMap } from "./shared-mers-map-pop-up-variables";

interface MersFaoAnimalEventPopupContentProps {
  event: AnimalMersEventMapMarkerData;
}

export const MersFaoAnimalEventPopupContent = (props: MersFaoAnimalEventPopupContentProps) => {
  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.WIDE}
      headerConfiguration={{
        text: "Animal MERS Case",
        textAlignment: HeaderConfigurationTextAlignment.CENTER
      }}
      subtitleConfiguration={{
        enabled: false
      }}
      topBannerConfiguration={{
        enabled: true,
        bannerText: `${diagnosisStatusToStringMap[props.event.diagnosisStatus]} Case`,
        bannerColourClassname: diagnosisStatusToColourClassnameMap[props.event.diagnosisStatus],
        isTextBolded: true,
        isTextCentered: true
      }}
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
        title: "Animal Type",
        type: PopUpContentRowType.COLOURED_PILL_LIST,
        values: [ props.event.animalType ],
        valueToColourClassnameMap: animalTypeToColourClassnameMap,
        valueToLabelMap: animalTypeToStringMap,
        defaultColourClassname: "bg-sky-100"
      }]}
      bottomBannerConfiguration={{
        enabled: true,
        bannerText: `Animal Species: ${animalSpeciesToStringMap[props.event.animalSpecies]}`,
        bannerColourClassname: animalSpeciesToColourClassnameMap[props.event.animalSpecies],
        isTextBolded: true,
        isTextCentered: true
      }}
    />
  );
}