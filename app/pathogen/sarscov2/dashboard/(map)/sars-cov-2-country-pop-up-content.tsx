import uniq from "lodash/uniq";
import { GenericMapPopUp, GenericMapPopUpWidth, HeaderConfigurationTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/generic-map-pop-up";
import { PopUpContentRowType, PopupContentTextAlignment } from "@/components/ui/pathogen-map/map-pop-up/pop-up-content-rows";
import { typedGroupBy } from "@/lib/utils";
import { scopeToSortOrderMap } from "@/components/customs/filters/available-filters";
import { SarsCov2Estimate } from "@/contexts/pathogen-context/pathogen-contexts/sarscov2/sc2-context";
import { useContext, useMemo } from "react";
import { ModelledSarsCov2SeroprevalenceContext } from "@/contexts/pathogen-context/pathogen-contexts/sarscov2/modelled-sarscov2-seroprevalence-context";
import { monthCountToMonthYearString } from "@/lib/time-utils";

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
  const { alpha3CountryCode } = props.record;
  const allDataPointsWithScopes = props.record.dataPoints.filter((dataPoint): dataPoint is Omit<typeof dataPoint, 'scope'> & {scope: NonNullable<(typeof dataPoint['scope'])>} => !!dataPoint);

  const allScopesPresentInData = uniq(allDataPointsWithScopes.map((dataPoint) => dataPoint.scope));
  const dataGroupedByScope = typedGroupBy(allDataPointsWithScopes, (dataPoint) => dataPoint.scope);

  const { dataPointsForCountryAlphaThreeCodes } = useContext(ModelledSarsCov2SeroprevalenceContext);

  const modelledSeroprevalenceForCountry = useMemo(() =>
    dataPointsForCountryAlphaThreeCodes.find((element) => element.countryAlphaThreeCode === alpha3CountryCode)?.data.reduce<{
      modelledTwentyFivePercentSeroprevalenceMonth: number | undefined
      modelledFiftyPercentSeroprevalenceMonth: number | undefined
      modelledSeventyFivePercentSeroprevalenceMonth: number | undefined
    }>((accumulator, value) => ({
      modelledTwentyFivePercentSeroprevalenceMonth:
        accumulator.modelledTwentyFivePercentSeroprevalenceMonth === undefined && value.modelledYAxisValue > 25
          ? value.xAxisValue
          : accumulator.modelledTwentyFivePercentSeroprevalenceMonth,
      modelledFiftyPercentSeroprevalenceMonth:
        accumulator.modelledFiftyPercentSeroprevalenceMonth === undefined && value.modelledYAxisValue > 50
          ? value.xAxisValue
          : accumulator.modelledFiftyPercentSeroprevalenceMonth,
      modelledSeventyFivePercentSeroprevalenceMonth:
        accumulator.modelledSeventyFivePercentSeroprevalenceMonth === undefined && value.modelledYAxisValue > 75
          ? value.xAxisValue
          : accumulator.modelledSeventyFivePercentSeroprevalenceMonth
    }), {
      modelledTwentyFivePercentSeroprevalenceMonth: undefined,
      modelledFiftyPercentSeroprevalenceMonth: undefined,
      modelledSeventyFivePercentSeroprevalenceMonth: undefined,
    })
  , [dataPointsForCountryAlphaThreeCodes, alpha3CountryCode]);

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
        enabled: true,
        label: "Total Estimates".replace(' ', '\u00A0'),
        value: allDataPointsWithScopes.length.toString(),
        valueTextAlignment: PopupContentTextAlignment.RIGHT,
        bannerColourClassname: "bg-gray-200"
      }}
      alternateViewConfiguration={{ enabled: false }}
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
          {
            title: 'Approximate Month 25% Seroprevalence was exceeded',
            type: PopUpContentRowType.TEXT as const,
            text: modelledSeroprevalenceForCountry?.modelledTwentyFivePercentSeroprevalenceMonth
              ? monthCountToMonthYearString(modelledSeroprevalenceForCountry.modelledTwentyFivePercentSeroprevalenceMonth)
              : 'Not enough data to model',
            contentTextAlignment: PopupContentTextAlignment.RIGHT,
            rightPaddingEnabled: false
          },
          {
            title: 'Approximate Month 50% Seroprevalence was exceeded',
            type: PopUpContentRowType.TEXT as const,
            text: modelledSeroprevalenceForCountry?.modelledFiftyPercentSeroprevalenceMonth
              ? monthCountToMonthYearString(modelledSeroprevalenceForCountry.modelledFiftyPercentSeroprevalenceMonth)
              : 'Not enough data to model',
            contentTextAlignment: PopupContentTextAlignment.RIGHT,
            rightPaddingEnabled: false
          },
          {
            title: 'Approximate Month 75% Seroprevalence was exceeded',
            type: PopUpContentRowType.TEXT as const,
            text: modelledSeroprevalenceForCountry?.modelledSeventyFivePercentSeroprevalenceMonth
              ? monthCountToMonthYearString(modelledSeroprevalenceForCountry.modelledSeventyFivePercentSeroprevalenceMonth)
              : 'Not enough data to model',
            contentTextAlignment: PopupContentTextAlignment.RIGHT,
            rightPaddingEnabled: false
          },
        ]
      }
      bottomBannerConfiguration={{
        enabled: false
      }}
    />
  );
}