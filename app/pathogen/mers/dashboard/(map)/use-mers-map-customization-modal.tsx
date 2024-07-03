import { useMemo, useState } from "react";
import { ModalState, ModalType, useModal } from "@/components/ui/modal/modal";
import { CustomizationSettingType } from "@/components/ui/modal/customization-modal/customization-settings";
import { MapCustomizeButton } from "@/components/ui/pathogen-map/map-customize-button";

export enum MersMapCountryHighlightingSettings {
  EVENTS_AND_ESTIMATES = 'EVENTS_AND_ESTIMATES',
  TOTAL_CAMEL_POPULATION = 'TOTAL_CAMEL_POPULATION',
  CAMELS_PER_CAPITA = 'CAMELS_PER_CAPITA'
}

export const useMersMapCustomizationModal = () => {
  const [
    currentMapCountryHighlightingSettings,
    setCurrentMapCountryHighlightingSettings
  ] = useState<MersMapCountryHighlightingSettings>(MersMapCountryHighlightingSettings.EVENTS_AND_ESTIMATES);
  const [countryPopUpEnabled, setCountryPopUpEnabled] = useState<boolean>(true);

  const {
    modal: customizationModal,
    setModalState: setCustomizationModalState,
  } = useModal({
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
        dropdownOptionToLabelMap: {
          [MersMapCountryHighlightingSettings.EVENTS_AND_ESTIMATES]: "Presence of MERS events or seroprevalence estimates",
          [MersMapCountryHighlightingSettings.TOTAL_CAMEL_POPULATION]: "Total camel population",
          [MersMapCountryHighlightingSettings.CAMELS_PER_CAPITA]: "Camels per capita",
        },
        onDropdownOptionChange: (option) => setCurrentMapCountryHighlightingSettings(option)
      }, {
        type: CustomizationSettingType.SWITCH,
        switchName: `Country pop-up ${countryPopUpEnabled ? 'enabled' : 'disabled'}.`,
        switchValue: countryPopUpEnabled,
        onSwitchValueChange: (newSwitchValue) => setCountryPopUpEnabled(newSwitchValue),
      }]
    }
  });

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
    mapCustomizeButton: () => mapCustomizeButton
  }
}