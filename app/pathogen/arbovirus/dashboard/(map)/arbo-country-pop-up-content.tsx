import uniq from "lodash/uniq";
import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { Arbovirus } from "@/gql/graphql";
import { PopUpContentRowType, PopupContentTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import { typedGroupBy } from "@/lib/utils";
import { filterArbovirusToSortOrderMap } from "@/components/customs/filters/available-filters";
import { arboShortformToFullNameMap } from "../(visualizations)/recharts";

interface ArboCountryPopupContentProps {
  record: {
    id: string,
    alpha3CountryCode: string,
    countryName: string,
    latitude: string,
    longitude: string,
    dataPoints: { pathogen: Arbovirus }[],
  }
}

const arbovirusToRibbonColourClassname: Record<Arbovirus, string> = {
  [Arbovirus.Zikv]: 'bg-zikv',
  [Arbovirus.Denv]: 'bg-denv',
  [Arbovirus.Chikv]: 'bg-chikv',
  [Arbovirus.Yf]: 'bg-yf',
  [Arbovirus.Wnv]: 'bg-wnv',
  [Arbovirus.Mayv]: 'bg-mayv',
}

export const ArboCountryPopupContent = ({ record }: ArboCountryPopupContentProps): React.ReactNode => {
  const allArbovirusesPresentInData = uniq(record.dataPoints.map((dataPoint) => dataPoint.pathogen));
  const dataGroupedByArbovirus = typedGroupBy(record.dataPoints, (dataPoint) => dataPoint.pathogen);

  return (
    <GenericMapPopUp
      width={GenericMapPopUpWidth.THIN}
      headerConfiguration={{
        text: record.countryName,
        textAlignment: HeaderConfigurationTextAlignment.CENTER
      }}
      subtitleConfiguration={{
        enabled: false
      }}
      topBannerConfiguration={{
        enabled: true,
        label: "Total Estimates".replace(' ', '\u00A0'),
        value: record.dataPoints.length.toString(),
        valueTextAlignment: PopupContentTextAlignment.RIGHT,
        bannerColourClassname: "bg-gray-200",
        alternateViewButtonEnabled: false
      }}
      alternateViewConfiguration={{ enabled: false }}
      rows={allArbovirusesPresentInData
        .sort((arbovirusA, arbovirusB) => filterArbovirusToSortOrderMap[arbovirusA] - filterArbovirusToSortOrderMap[arbovirusB])
        .map((arbovirus) => ({
          title: `${arboShortformToFullNameMap[arbovirus]} estimates`.replace(' ', '\u00A0'),
          type: PopUpContentRowType.NUMBER,
          value: dataGroupedByArbovirus[arbovirus].length,
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: {
            ribbonColourClassname: arbovirusToRibbonColourClassname[arbovirus],
          },
          rightPaddingEnabled: false
        }))
      }
      bottomBannerConfiguration={{
        enabled: false
      }}
    />
  );
}