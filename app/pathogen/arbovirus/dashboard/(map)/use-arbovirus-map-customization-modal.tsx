import { CustomizationSettingType } from "@/components/ui/modal/customization-modal/customization-settings";
import { ModalState, ModalType, useModal } from "@/components/ui/modal/modal";
import { MapCustomizeButton } from "@/components/ui/pathogen-map/map-customize-button";
import { useMemo, useState } from "react";

export const useArbovirusMapCustomizationModal = () => {
  const [ countryHighlightingEnabled, setCountryHighlightingEnabled ] = useState<boolean>(true);

  const {
    modal: customizationModal,
    setModalState: setCustomizationModalState,
  } = useModal({
    initialModalState: ModalState.CLOSED,
    headerText: "Customize Map",
    modalType: ModalType.CUSTOMIZATION_MODAL,
    content: {
      customizationSettings: [{
        type: CustomizationSettingType.SWITCH,
        switchName: `Country highlighting ${countryHighlightingEnabled ? 'enabled' : 'disabled'}.`,
        switchValue: countryHighlightingEnabled,
        onSwitchValueChange: (newSwitchValue) => setCountryHighlightingEnabled(newSwitchValue),
      }]
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
    countryHighlightingEnabled,
    mapCustomizeButton: () => mapCustomizeButton
  }
}