import uniq from "lodash/uniq";
import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { PopUpContentRowType, PopupContentTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import { typedGroupBy } from "@/lib/utils";
import { scopeToSortOrderMap } from "@/components/customs/filters/available-filters";

interface SarsCov2CountryPopupContentProps {
  record: {
    id: string,
    alpha3CountryCode: string,
    countryName: string,
    latitude: string,
    longitude: string,
    dataPoints: { scope?: string | undefined | null }[],
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
        label: "Total\u00A0Estimates",
        value: allDataPointsWithScopes.length.toString(),
        valueTextAlignment: PopupContentTextAlignment.RIGHT,
        bannerColourClassname: "bg-gray-200"
      }}
      rows={allScopesPresentInData
        .sort((scopeA, scopeB) => (scopeToSortOrderMap[scopeA] ?? 0) - (scopeToSortOrderMap[scopeB] ?? 0))
        .map((scope) => ({
          title: `${scope.replace(' ', '\u00A0')}\u00A0estimates`,
          type: PopUpContentRowType.NUMBER,
          value: dataGroupedByScope[scope].length,
          contentTextAlignment: PopupContentTextAlignment.RIGHT,
          ribbonConfiguration: {
            ribbonColourClassname: scopeToRibbonColourClassname[scope] ?? 'bg-gray-200'
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