import { useState } from "react";
import { ModalState, ModalType, UseModalInput } from "@/components/ui/modal/modal";
import { CustomizationSettingType } from "@/components/ui/modal/customization-modal/customization-settings";

interface UseModelledSeroprevalenceByWhoRegionCustomizationModalOutput {
  customizationModalConfiguration: UseModalInput<string>
  customizationSettings: {
    modelledSeroprevalenceByWhoRegionScatterPointsVisible: boolean;
  }
}

export const useModelledSeroprevalenceByWhoRegionCustomizationModal = (): UseModelledSeroprevalenceByWhoRegionCustomizationModalOutput => {
  const [
    modelledSeroprevalenceByWhoRegionScatterPointsVisible,
    setModelledSeroprevalenceByWhoRegionScatterPointsVisible
  ] = useState<boolean>(false);

  const customizationModalConfiguration: UseModalInput<string> = {
    initialModalState: ModalState.CLOSED,
    disabled: false,
    modalType: ModalType.CUSTOMIZATION_MODAL,
    content: {
      customizationSettings: [{
        type: CustomizationSettingType.SWITCH,
        switchName: `Scatter points ${modelledSeroprevalenceByWhoRegionScatterPointsVisible ? 'visible' : 'not visible'}.`,
        switchValue: modelledSeroprevalenceByWhoRegionScatterPointsVisible,
        onSwitchValueChange: (newSwitchValue: boolean) => setModelledSeroprevalenceByWhoRegionScatterPointsVisible(newSwitchValue),
      }]
    }
  }

  return {
    customizationModalConfiguration,
    customizationSettings: {
      modelledSeroprevalenceByWhoRegionScatterPointsVisible
    }
  }
}