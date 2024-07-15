import { useState, useContext } from "react";
import { ModalState, ModalType, UseModalInput } from "@/components/ui/modal/modal";
import { CustomizationSettingType } from "@/components/ui/modal/customization-modal/customization-settings";
import { ModelledSarsCov2SeroprevalenceContext } from "@/contexts/pathogen-context/pathogen-contexts/sarscov2/modelled-sarscov2-seroprevalence-context";

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

  const { customizationSettingsForModal } = useContext(ModelledSarsCov2SeroprevalenceContext);

  const customizationModalConfiguration: UseModalInput<string> = {
    initialModalState: ModalState.CLOSED,
    disabled: false,
    modalType: ModalType.CUSTOMIZATION_MODAL,
    content: {
      customizationSettings: [
        {
          type: CustomizationSettingType.SWITCH,
          switchName: `Scatter points ${modelledSeroprevalenceByWhoRegionScatterPointsVisible ? 'visible' : 'not visible'}.`,
          switchValue: modelledSeroprevalenceByWhoRegionScatterPointsVisible,
          onSwitchValueChange: (newSwitchValue: boolean) => setModelledSeroprevalenceByWhoRegionScatterPointsVisible(newSwitchValue),
        }, 
        ...customizationSettingsForModal
      ]
    }
  }

  return {
    customizationModalConfiguration,
    customizationSettings: {
      modelledSeroprevalenceByWhoRegionScatterPointsVisible
    }
  }
}