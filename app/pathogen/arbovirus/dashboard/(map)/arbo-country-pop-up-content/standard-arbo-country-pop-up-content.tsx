import uniq from "lodash/uniq";
import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { PopUpContentRowType, PopupContentTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import { typedGroupBy } from "@/lib/utils";
import { filterArbovirusToSortOrderMap } from "@/components/customs/filters/available-filters";
import { arboShortformToFullNameMap } from "../../(visualizations)/recharts";
import { ArboCountryPopupContentProps, arbovirusToRibbonColourClassname } from "../arbo-country-pop-up-content";

type StandardEsmArboCountryPopupContentProps = {
  hidden: boolean;
} & Pick<ArboCountryPopupContentProps, 'record'>;

export const StandardArboCountryPopupContent = (props: StandardEsmArboCountryPopupContentProps): React.ReactNode => {
  const allArbovirusesPresentInData = uniq(props.record.dataPoints.map((dataPoint) => dataPoint.pathogen));
  const dataGroupedByArbovirus = typedGroupBy(props.record.dataPoints, (dataPoint) => dataPoint.pathogen);

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
        enabled: true,
        label: "Total Estimates".replace(' ', '\u00A0'),
        value: props.record.dataPoints.length.toString(),
        valueTextAlignment: PopupContentTextAlignment.RIGHT,
        bannerColourClassname: "bg-gray-200",
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
      className={props.hidden ? 'hidden' : ''}
      bottomBannerConfiguration={{
        enabled: false
      }}
    />
  );
}