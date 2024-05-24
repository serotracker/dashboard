import uniq from "lodash/uniq";
import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { PopUpContentRowType, PopupContentTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import { typedGroupBy } from "@/lib/utils";
import { scopeToSortOrderMap } from "@/components/customs/filters/available-filters";
import { SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";

interface SarsCov2CountryPopupContentProps {
  record: {
    id: string,
    alpha3CountryCode: string,
    countryName: string,
    latitude: string,
    longitude: string,
    dataPoints: Pick<SarsCov2Estimate, 'scope' | 'denominatorValue'>[],
  }
}

const scopeToRibbonColourClassname: Record<string, string | undefined> = {
  "Local": "bg-local-study",
  "Regional": "bg-regional-study",
  "National": "bg-national-study"
}

export const SarsCov2CountryPopupContent = (props: SarsCov2CountryPopupContentProps): React.ReactNode => {
  const allDataPointsWithScopes = props.record.dataPoints.filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'scope'> & {scope: NonNullable<(typeof dataPoint['scope'])>} => !!dataPoint);

  const allScopesPresentInData = uniq(allDataPointsWithScopes.map((dataPoint) => dataPoint.scope));
  const dataGroupedByScope = typedGroupBy(allDataPointsWithScopes, (dataPoint) => dataPoint.scope);

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
        value: allDataPointsWithScopes.length.toString(),
        valueTextAlignment: PopupContentTextAlignment.RIGHT,
        bannerColourClassname: "bg-gray-200"
      }}
      rows={
        [
          {
            title: 'Antibody Tests Administered'.replace(' ', '\u00A0'),
            type: PopUpContentRowType.NUMBER as const,
            value: props.record.dataPoints
              .map((dataPoint) => (dataPoint.denominatorValue ?? 0))
              .reduce((accumulator, value) => accumulator + value, 0),
            contentTextAlignment: PopupContentTextAlignment.RIGHT,
            rightPaddingEnabled: false
          },
          ...allScopesPresentInData
            .sort((scopeA, scopeB) => (scopeToSortOrderMap[scopeA] ?? 0) - (scopeToSortOrderMap[scopeB] ?? 0))
            .map((scope) => ({
              title: `${scope} estimates`.replace(' ', '\u00A0'),
              type: PopUpContentRowType.NUMBER as const,
              value: dataGroupedByScope[scope].length,
              contentTextAlignment: PopupContentTextAlignment.RIGHT,
              ribbonConfiguration: {
                ribbonColourClassname: scopeToRibbonColourClassname[scope] ?? 'bg-gray-200'
              },
              rightPaddingEnabled: false
            })),
        ]
      }
      bottomBannerConfiguration={{
        enabled: false
      }}
    />
  );
}