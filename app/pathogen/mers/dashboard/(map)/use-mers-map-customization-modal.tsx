import { useMemo, useState } from "react";
import { ModalState, ModalType, UseModalInput, useModal } from "@/components/ui/modal/modal";
import { CustomizationSettingType } from "@/components/ui/modal/customization-modal/customization-settings";
import { MapCustomizeButton } from "@/components/ui/pathogen-map/map-customize-button";

export enum CountryPaintChangeSetting {
  WHEN_RECOMMENDED = "WHEN_RECOMMENDED",
  ALWAYS_ENABLED = "ALWAYS_ENABLED",
  ALWAYS_DISABLED = "ALWAYS_DISABLED",
}

const isCountryPaintChangeSetting = (input: string): input is CountryPaintChangeSetting =>
  Object.values(CountryPaintChangeSetting).some((element) => element === input);

export enum MersMapCountryHighlightingSettings {
  EVENTS_AND_ESTIMATES = 'EVENTS_AND_ESTIMATES',
  TOTAL_CAMEL_POPULATION = 'TOTAL_CAMEL_POPULATION',
  CAMELS_PER_CAPITA = 'CAMELS_PER_CAPITA'
}

const isMersMapCountryHighlightingSettings = (input: string): input is MersMapCountryHighlightingSettings =>
  Object.values(MersMapCountryHighlightingSettings).some((element) => element === input);

const dropdownOptionToLabelMap = {
  [MersMapCountryHighlightingSettings.EVENTS_AND_ESTIMATES]: "Presence of MERS events or seroprevalence estimates",
  [MersMapCountryHighlightingSettings.TOTAL_CAMEL_POPULATION]: "Total camel population",
  [MersMapCountryHighlightingSettings.CAMELS_PER_CAPITA]: "Camels per capita",
  [CountryPaintChangeSetting.WHEN_RECOMMENDED]: "When Recommended",
  [CountryPaintChangeSetting.ALWAYS_ENABLED]: "Always Enabled",
  [CountryPaintChangeSetting.ALWAYS_DISABLED]: "Always Disabled",
}

export const useMersMapCustomizationModal = () => {
  const [
    currentMapCountryHighlightingSettings,
    setCurrentMapCountryHighlightingSettings
  ] = useState<MersMapCountryHighlightingSettings>(MersMapCountryHighlightingSettings.EVENTS_AND_ESTIMATES);
  const [
    countryOutlinesSetting,
    setCountryOutlinesSetting
  ] = useState<CountryPaintChangeSetting>(CountryPaintChangeSetting.WHEN_RECOMMENDED);
  const [countryPopUpEnabled, setCountryPopUpEnabled] = useState<boolean>(true);

  const useModalInput: UseModalInput<MersMapCountryHighlightingSettings | CountryPaintChangeSetting> = useMemo(() => ({
    initialModalState: ModalState.CLOSED,
    disabled: false,
    modalType: ModalType.CUSTOMIZATION_MODAL,
    content: {
      customizationSettings: [{
        type: CustomizationSettingType.DROPDOWN,
        dropdownName: 'Country Highlighting',
        borderColourClassname: 'border-mers',
        hoverColourClassname: 'hover:bg-mersHover/50',
        highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
        dropdownOptionGroups: [{
          groupHeader: 'Events and estimates',
          options: [
            MersMapCountryHighlightingSettings.EVENTS_AND_ESTIMATES
          ]
        }, {
          groupHeader: 'Camels',
          options: [
            MersMapCountryHighlightingSettings.TOTAL_CAMEL_POPULATION,
            MersMapCountryHighlightingSettings.CAMELS_PER_CAPITA,
          ]
        }],
        chosenDropdownOption: currentMapCountryHighlightingSettings,
        dropdownOptionToLabelMap,
        onDropdownOptionChange: (option) => {
          if(isMersMapCountryHighlightingSettings(option)) {
            setCurrentMapCountryHighlightingSettings(option)
          }
        }
      }, {
        type: CustomizationSettingType.DROPDOWN,
        dropdownName: 'Country outlines for countries with data',
        borderColourClassname: 'border-mers',
        hoverColourClassname: 'hover:bg-mersHover/50',
        highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
        dropdownOptionGroups: [{
          groupHeader: 'Preferences',
          options: [
            CountryPaintChangeSetting.WHEN_RECOMMENDED,
            CountryPaintChangeSetting.ALWAYS_DISABLED,
            CountryPaintChangeSetting.ALWAYS_ENABLED,
          ]
        }],
        chosenDropdownOption: countryOutlinesSetting,
        dropdownOptionToLabelMap,
        onDropdownOptionChange: (option) => {
          if(isCountryPaintChangeSetting(option)) {
            setCountryOutlinesSetting(option)
          }
        }
      }, {
        type: CustomizationSettingType.SWITCH,
        switchName: `Country pop-up ${countryPopUpEnabled ? 'enabled' : 'disabled'}.`,
        switchValue: countryPopUpEnabled,
        onSwitchValueChange: (newSwitchValue) => setCountryPopUpEnabled(newSwitchValue),
      }]
    }
  }), [ countryOutlinesSetting, setCountryOutlinesSetting, currentMapCountryHighlightingSettings, setCurrentMapCountryHighlightingSettings, countryPopUpEnabled, setCountryPopUpEnabled ])

  const {
    modal: customizationModal,
    setModalState: setCustomizationModalState,
  } = useModal(useModalInput);

  const mapCustomizeButton = useMemo(() =>
    <MapCustomizeButton
      onClick={() => setCustomizationModalState(ModalState.OPENED)}
      hoverColourClassname='hover:bg-mersHover/50'
    />
  , [ setCustomizationModalState ])

  return {
    customizationModal,
    countryPopUpEnabled,
    currentMapCountryHighlightingSettings,
    countryOutlinesSetting,
    mapCustomizeButton: () => mapCustomizeButton
  }
}