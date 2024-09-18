import { CustomizationSettingType } from "@/components/ui/modal/customization-modal/customization-settings";
import { ModalState, ModalType, useModal } from "@/components/ui/modal/modal";
import { MapCustomizeButton } from "@/components/ui/pathogen-map/map-customize-button";
import { useMemo, useState } from "react";

export enum CountryPaintChangeSetting {
  WHEN_RECOMMENDED = "WHEN_RECOMMENDED",
  ALWAYS_ENABLED = "ALWAYS_ENABLED",
  ALWAYS_DISABLED = "ALWAYS_DISABLED",
}

export const useArbovirusMapCustomizationModal = () => {
  const [ countryHighlightingSetting, setCountryHighlightingSetting ] = useState<CountryPaintChangeSetting>(CountryPaintChangeSetting.WHEN_RECOMMENDED);
  const [ countryOutlinesSetting, setCountryOutlinesSetting ] = useState<CountryPaintChangeSetting>(CountryPaintChangeSetting.WHEN_RECOMMENDED);
  const [ countryPopUpEnabled, setCountryPopUpEnabled ] = useState<boolean>(true);
  const [ oropoucheCasesMapEnabled, setOropoucheCasesMapEnabled ] = useState<boolean>(false);

  const {
    modal: customizationModal,
    setModalState: setCustomizationModalState,
  } = useModal({
    initialModalState: ModalState.CLOSED,
    disabled: false,
    modalType: ModalType.CUSTOMIZATION_MODAL,
    content: {
      paginationHoverClassname: "hover:bg-arbovirusHover",
      paginationSelectedClassname: "bg-arbovirus",
      customizationSettings: [{
        type: CustomizationSettingType.DROPDOWN,
        dropdownName: 'Country highlighting for countries with data',
        borderColourClassname: 'border-arbovirus',
        hoverColourClassname: 'hover:bg-arbovirusHover/50',
        highlightedColourClassname: 'data-[highlighted]:bg-arbovirusHover/50',
        dropdownOptionGroups: [{
          groupHeader: 'Preferences',
          options: [
            CountryPaintChangeSetting.WHEN_RECOMMENDED,
            CountryPaintChangeSetting.ALWAYS_DISABLED,
            CountryPaintChangeSetting.ALWAYS_ENABLED,
          ]
        }],
        chosenDropdownOption: countryHighlightingSetting,
        dropdownOptionToLabelMap: {
          [CountryPaintChangeSetting.WHEN_RECOMMENDED]: "When Recommended",
          [CountryPaintChangeSetting.ALWAYS_ENABLED]: "Always Enabled",
          [CountryPaintChangeSetting.ALWAYS_DISABLED]: "Always Disabled",
        },
        onDropdownOptionChange: (option) => setCountryHighlightingSetting(option)
      }, {
        type: CustomizationSettingType.DROPDOWN,
        dropdownName: 'Country outlines for countries with data',
        borderColourClassname: 'border-arbovirus',
        hoverColourClassname: 'hover:bg-arbovirusHover/50',
        highlightedColourClassname: 'data-[highlighted]:bg-arbovirusHover/50',
        dropdownOptionGroups: [{
          groupHeader: 'Preferences',
          options: [
            CountryPaintChangeSetting.WHEN_RECOMMENDED,
            CountryPaintChangeSetting.ALWAYS_DISABLED,
            CountryPaintChangeSetting.ALWAYS_ENABLED,
          ]
        }],
        chosenDropdownOption: countryOutlinesSetting,
        dropdownOptionToLabelMap: {
          [CountryPaintChangeSetting.WHEN_RECOMMENDED]: "When Recommended",
          [CountryPaintChangeSetting.ALWAYS_ENABLED]: "Always Enabled",
          [CountryPaintChangeSetting.ALWAYS_DISABLED]: "Always Disabled",
        },
        onDropdownOptionChange: (option) => setCountryOutlinesSetting(option)
      }, {
        type: CustomizationSettingType.SWITCH,
        switchName: `Country pop-up ${countryPopUpEnabled ? 'enabled' : 'disabled'}.`,
        switchValue: countryPopUpEnabled,
        onSwitchValueChange: (newSwitchValue) => setCountryPopUpEnabled(newSwitchValue),
      }, 
      ...( process.env.NEXT_PUBLIC_OROPOUCHE_ENABLED === 'true' ? [{
        type: CustomizationSettingType.SWITCH as const,
        switchName: `Ororpouche Case Map ${countryPopUpEnabled ? 'enabled' : 'disabled'}.`,
        switchValue: oropoucheCasesMapEnabled,
        onSwitchValueChange: (newSwitchValue: boolean) => setOropoucheCasesMapEnabled(newSwitchValue),
      }] : [])]
    }
  });

  const mapCustomizeButton = useMemo(() =>
    <MapCustomizeButton
      onClick={() => setCustomizationModalState(ModalState.OPENED)}
      hoverColourClassname='hover:bg-arbovirusHover/50'
    />
  , [ setCustomizationModalState ])

  return {
    customizationModal,
    countryPopUpEnabled,
    countryHighlightingSetting,
    countryOutlinesSetting,
    oropoucheCasesMapEnabled,
    mapCustomizeButton: () => mapCustomizeButton
  }
}