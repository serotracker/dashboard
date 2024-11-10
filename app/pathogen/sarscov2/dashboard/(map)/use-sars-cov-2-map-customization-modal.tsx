import { CustomizationSettingType } from "@/components/ui/modal/customization-modal/customization-settings";
import { ModalState, ModalType, useModal } from "@/components/ui/modal/modal";
import { MapCustomizeButton } from "@/components/ui/pathogen-map/map-customize-button";
import { useMemo, useState } from "react";

export const useSarsCov2MapCustomizationModal = () => {
  const [ countryPopUpEnabled, setCountryPopUpEnabled ] = useState<boolean>(true);

  const {
    modal: customizationModal,
    setModalState: setCustomizationModalState,
  } = useModal({
    initialModalState: ModalState.CLOSED,
    disabled: false,
    modalType: ModalType.CUSTOMIZATION_MODAL,
    content: {
      paginationHoverClassname: "hover:bg-sc2virusHover",
      paginationSelectedClassname: "bg-sc2virus",
      customizationSettings: [{
        type: CustomizationSettingType.SWITCH,
        switchName: `Country/Area pop-up ${countryPopUpEnabled ? 'enabled' : 'disabled'}.`,
        switchValue: countryPopUpEnabled,
        onSwitchValueChange: (newSwitchValue) => setCountryPopUpEnabled(newSwitchValue),
      }]
    }
  });

  const mapCustomizeButton = useMemo(() =>
    <MapCustomizeButton
      onClick={() => setCustomizationModalState(ModalState.OPENED)}
      hoverColourClassname='hover:bg-sc2virusHover/50'
    />
  , [ setCustomizationModalState ])

  return {
    customizationModal,
    countryPopUpEnabled,
    mapCustomizeButton: () => mapCustomizeButton
  }
}