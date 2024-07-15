import { useContext, useState, useMemo } from "react";
import { CustomizationSettingType } from "@/components/ui/modal/customization-modal/customization-settings";
import { ModalState, ModalType, UseModalInput } from "@/components/ui/modal/modal";
import { GbdSubRegion, GbdSuperRegion, UnRegion, WhoRegion } from "@/gql/graphql";
import { isUNRegion, unRegionEnumToLabelMap } from "@/lib/un-regions";
import { isWHORegion } from "@/lib/who-regions";
import { CountryInformationContext } from "@/contexts/pathogen-context/country-information-context";
import { gbdSubRegionToLabelMap, gbdSuperRegionToLabelMap, isGbdSubRegion, isGbdSuperRegion } from "@/lib/gbd-regions";
import { typedObjectKeys } from "@/lib/utils";
import { SeriesFieldsRegionPortion, SeriesRegionType } from "./series-generator";

interface UseComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeModalOutput {
  seriesRegionPortions: SeriesFieldsRegionPortion[];
  customizationModalConfiguration: UseModalInput<string>
}

export const useComparingSeroprevalenceToPositiveCasesAndVaccinationsOverTimeModal = (): UseComparingSeroprevalencePositiveCasesAndVaccinationsOverTimeModalOutput => {
  const { countryAlphaTwoCodeToCountryNameMap } = useContext(CountryInformationContext);

  const [ globalLineVisible, setGlobalLineVisible ] = useState<boolean>(true);
  const [ selectedCountries, setSelectedCountries ] = useState<string[]>([]);
  const [ selectedUnRegions, setSelectedUnRegions ] = useState<UnRegion[]>([]);
  const [ selectedWhoRegions, setSelectedWhoRegions ] = useState<WhoRegion[]>([
    WhoRegion.Afr,
    WhoRegion.Amr,
    WhoRegion.Emr,
    WhoRegion.Eur,
    WhoRegion.Sear,
    WhoRegion.Wpr
  ]);
  const [ selectedGbdSuperRegions, setSelectedGbdSuperRegions ] = useState<GbdSuperRegion[]>([]);
  const [ selectedGbdSubRegions, setSelectedGbdSubRegions ] = useState<GbdSubRegion[]>([]);

  const seriesRegionPortions = useMemo((): SeriesFieldsRegionPortion[] => [
    ...(globalLineVisible ? [{ regionType: SeriesRegionType.GLOBAL as const }] : []),
    ...(selectedCountries.map((countryAlphaTwoCode) => ({ regionType: SeriesRegionType.COUNTRY as const, countryAlphaTwoCode }))),
    ...(selectedUnRegions.map((unRegion) => ({ regionType: SeriesRegionType.UN_REGION as const, unRegion }))),
    ...(selectedWhoRegions.map((whoRegion) => ({ regionType: SeriesRegionType.WHO_REGION as const, whoRegion }))),
    ...(selectedGbdSuperRegions.map((gbdSuperRegion) => ({ regionType: SeriesRegionType.GBD_SUPER_REGION as const, gbdSuperRegion }))),
    ...(selectedGbdSubRegions.map((gbdSubRegion) => ({ regionType: SeriesRegionType.GBD_SUB_REGION as const, gbdSubRegion }))),
  ], [
    globalLineVisible,
    selectedCountries,
    selectedUnRegions,
    selectedWhoRegions,
    selectedGbdSuperRegions,
    selectedGbdSubRegions,
  ])

  return {
    seriesRegionPortions,
    customizationModalConfiguration: {
      initialModalState: ModalState.CLOSED,
      disabled: false,
      modalType: ModalType.CUSTOMIZATION_MODAL,
      content: {
        customizationSettings: [{
          type: CustomizationSettingType.SWITCH,
          switchName: `Global line ${globalLineVisible ? 'visible' : 'not visible'}.`,
          switchValue: globalLineVisible,
          onSwitchValueChange: (newSwitchValue: boolean) => setGlobalLineVisible(newSwitchValue),
        }, {
          type: CustomizationSettingType.MULTI_SELECT_DROPDOWN,
          dropdownName: 'Selected Countries',
          heading: 'Selected Countries',
          options: typedObjectKeys(countryAlphaTwoCodeToCountryNameMap),
          optionToLabelMap: countryAlphaTwoCodeToCountryNameMap,
          selected: selectedCountries,
          handleOnChange: (selected) => setSelectedCountries(selected)
        }, {
          type: CustomizationSettingType.MULTI_SELECT_DROPDOWN,
          dropdownName: 'Selected UN Regions',
          heading: 'Selected UN Regions',
          options: Object.values(UnRegion),
          optionToLabelMap: unRegionEnumToLabelMap,
          selected: selectedUnRegions,
          handleOnChange: (selected) => setSelectedUnRegions(
            selected.filter((unRegion): unRegion is UnRegion => isUNRegion(unRegion))
          )
        }, {
          type: CustomizationSettingType.MULTI_SELECT_DROPDOWN,
          dropdownName: 'Selected WHO Regions',
          heading: 'Selected WHO Regions',
          options: Object.values(WhoRegion),
          optionToLabelMap: {},
          selected: selectedWhoRegions,
          handleOnChange: (selected) => setSelectedWhoRegions(
            selected.filter((whoRegion): whoRegion is WhoRegion => isWHORegion(whoRegion))
          )
        }, {
          type: CustomizationSettingType.MULTI_SELECT_DROPDOWN,
          dropdownName: 'Selected GBD Super Regions',
          heading: 'Selected GBD Super Regions',
          options: Object.values(GbdSuperRegion),
          optionToLabelMap: gbdSuperRegionToLabelMap,
          selected: selectedGbdSuperRegions,
          handleOnChange: (selected) => setSelectedGbdSuperRegions(
            selected.filter((gbdSuperRegion): gbdSuperRegion is GbdSuperRegion => isGbdSuperRegion(gbdSuperRegion))
          )
        }, {
          type: CustomizationSettingType.MULTI_SELECT_DROPDOWN,
          dropdownName: 'Selected GBD Sub Regions',
          heading: 'Selected GBD Sub Regions',
          options: Object.values(GbdSubRegion),
          optionToLabelMap: gbdSubRegionToLabelMap,
          selected: selectedGbdSubRegions,
          handleOnChange: (selected) => setSelectedGbdSubRegions(
            selected.filter((gbdSuperRegion): gbdSuperRegion is GbdSubRegion => isGbdSubRegion(gbdSuperRegion))
          )
        }]
      }
    }
  }
}