import { useMemo, useState } from "react";
import { ModalState, ModalType, UseModalInput, useModal } from "@/components/ui/modal/modal";
import { CustomizationSettingType } from "@/components/ui/modal/customization-modal/customization-settings";
import { MapCustomizeButton } from "@/components/ui/pathogen-map/map-customize-button";

export enum CountryPaintChangeSetting {
  WHEN_RECOMMENDED = "WHEN_RECOMMENDED",
  ALWAYS_ENABLED = "ALWAYS_ENABLED",
  ALWAYS_DISABLED = "ALWAYS_DISABLED",
}

export enum MapDataPointVisibilityOptions {
  ESTIMATES_ONLY = 'ESTIMATES_ONLY',
  EVENTS_ONLY = 'EVENTS_ONLY',
  EVENTS_AND_ESTIMATES_VISIBLE = 'EVENTS_AND_ESTIMATES_VISIBLE',
  NOTHING_VISIBLE = 'NOTHING_VISIBLE',
}

const isMapDataPointVisibilityOptions = (input: string): input is MapDataPointVisibilityOptions =>
  Object.values(MapDataPointVisibilityOptions).some((element) => element === input);

const isCountryPaintChangeSetting = (input: string): input is CountryPaintChangeSetting =>
  Object.values(CountryPaintChangeSetting).some((element) => element === input);

export enum MersMapCountryHighlightingSettings {
  EVENTS_AND_ESTIMATES = 'EVENTS_AND_ESTIMATES',
  TOTAL_CAMEL_POPULATION = 'TOTAL_CAMEL_POPULATION',
  CAMELS_PER_CAPITA = 'CAMELS_PER_CAPITA',
  MERS_HUMAN_CASES = 'MERS_HUMAN_CASES',
  MERS_ANIMAL_CASES = 'MERS_ANIMAL_CASES',
}

const isMersMapCountryHighlightingSettings = (input: string): input is MersMapCountryHighlightingSettings =>
  Object.values(MersMapCountryHighlightingSettings).some((element) => element === input);

const dropdownOptionToLabelMap = {
  [MersMapCountryHighlightingSettings.EVENTS_AND_ESTIMATES]: "Presence of MERS estimates or events",
  [MersMapCountryHighlightingSettings.TOTAL_CAMEL_POPULATION]: "Total camel population",
  [MersMapCountryHighlightingSettings.CAMELS_PER_CAPITA]: "Camels per capita",
  [MersMapCountryHighlightingSettings.MERS_HUMAN_CASES]: "MERS Human Cases",
  [MersMapCountryHighlightingSettings.MERS_ANIMAL_CASES]: "MERS Animal Cases",
  [CountryPaintChangeSetting.WHEN_RECOMMENDED]: "When Recommended",
  [CountryPaintChangeSetting.ALWAYS_ENABLED]: "Always Enabled",
  [CountryPaintChangeSetting.ALWAYS_DISABLED]: "Always Disabled",
  [MapDataPointVisibilityOptions.ESTIMATES_ONLY]: "Only Estimates Visible",
  [MapDataPointVisibilityOptions.EVENTS_ONLY]: "Only Events Visible",
  [MapDataPointVisibilityOptions.EVENTS_AND_ESTIMATES_VISIBLE]: "Events And Estimates Visible",
  [MapDataPointVisibilityOptions.NOTHING_VISIBLE]: "No Data Visible on Map",
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
  const [
    mapDataPointVisibilitySetting,
    setMapDataPointVisibilitySetting
  ] = useState<MapDataPointVisibilityOptions>(MapDataPointVisibilityOptions.ESTIMATES_ONLY);
  const [countryPopUpEnabled, setCountryPopUpEnabled] = useState<boolean>(true);

  const useModalInput: UseModalInput<MersMapCountryHighlightingSettings | CountryPaintChangeSetting | MapDataPointVisibilityOptions> = useMemo(() => ({
    initialModalState: ModalState.CLOSED,
    disabled: false,
    modalType: ModalType.CUSTOMIZATION_MODAL,
    content: {
      paginationHoverClassname: "hover:bg-mersHover",
      paginationSelectedClassname: "bg-mers",
      customizationSettings: [{
        type: CustomizationSettingType.DROPDOWN,
        dropdownName: 'Country Highlighting',
        borderColourClassname: 'border-mers',
        hoverColourClassname: 'hover:bg-mersHover/50',
        highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
        dropdownOptionGroups: [{
          groupHeader: 'Seroprevalence and Viral Positive Prevalence Estimates',
          options: [
            MersMapCountryHighlightingSettings.EVENTS_AND_ESTIMATES
          ]
        }, {
          groupHeader: 'Camels',
          options: [
            MersMapCountryHighlightingSettings.TOTAL_CAMEL_POPULATION,
            MersMapCountryHighlightingSettings.CAMELS_PER_CAPITA,
          ]
        }, {
          groupHeader: 'Reported Positive Cases',
          options: [
            MersMapCountryHighlightingSettings.MERS_HUMAN_CASES,
            MersMapCountryHighlightingSettings.MERS_ANIMAL_CASES
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
        type: CustomizationSettingType.DROPDOWN,
        dropdownName: 'Data point types shown on map',
        borderColourClassname: 'border-mers',
        hoverColourClassname: 'hover:bg-mersHover/50',
        highlightedColourClassname: 'data-[highlighted]:bg-mersHover/50',
        dropdownOptionGroups: [{
          groupHeader: 'Data Points Shown',
          options: [
            MapDataPointVisibilityOptions.ESTIMATES_ONLY,
            MapDataPointVisibilityOptions.EVENTS_ONLY,
            MapDataPointVisibilityOptions.EVENTS_AND_ESTIMATES_VISIBLE,
            MapDataPointVisibilityOptions.NOTHING_VISIBLE
          ]
        }],
        chosenDropdownOption: mapDataPointVisibilitySetting,
        dropdownOptionToLabelMap,
        onDropdownOptionChange: (option) => {
          if(isMapDataPointVisibilityOptions(option)) {
            setMapDataPointVisibilitySetting(option)
          }
        }
      }, {
        type: CustomizationSettingType.SWITCH,
        switchName: `Country pop-up ${countryPopUpEnabled ? 'enabled' : 'disabled'}.`,
        switchValue: countryPopUpEnabled,
        onSwitchValueChange: (newSwitchValue) => setCountryPopUpEnabled(newSwitchValue),
      }]
    }
  }), [ countryOutlinesSetting, setCountryOutlinesSetting, currentMapCountryHighlightingSettings, setCurrentMapCountryHighlightingSettings, countryPopUpEnabled, setCountryPopUpEnabled, mapDataPointVisibilitySetting, setMapDataPointVisibilitySetting ])

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
    mapDataPointVisibilitySetting,
    mapCustomizeButton: () => mapCustomizeButton
  }
}