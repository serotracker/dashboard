import assertNever from "assert-never";
import { CustomizationSetting, CustomizationSettingType } from "./customization-settings";
import { DropdownCustomizationSetting } from "./dropdown-customization-setting";
import { SwitchCustomizationSetting } from "./switch-customization-settings";
import { ModalHeader } from "../modal-header";

export interface CustomizationModalContentProps<TDropdownOption extends string> {
  className?: string;
  customizationSettings: CustomizationSetting<TDropdownOption>[];
  closeModal: () => void;
}

export const CustomizationModalContent = <
  TDropdownOption extends string
>(props: CustomizationModalContentProps<TDropdownOption>): React.ReactNode => (
  <div className={props.className}>
    <ModalHeader header={"Customize"} closeModal={props.closeModal} />
    <div className="mx-4 mb-4">
      {props.customizationSettings.map((customizationSetting, index) => {
        const isLastElement = index === props.customizationSettings.length - 1;

        if(customizationSetting.type === CustomizationSettingType.DROPDOWN) {
          return <DropdownCustomizationSetting className={isLastElement ? '' : 'mb-6'} key={customizationSetting.dropdownName} {...customizationSetting} />
        }

        if(customizationSetting.type === CustomizationSettingType.SWITCH) {
          return <SwitchCustomizationSetting className={isLastElement ? '' : 'mb-6'} key={customizationSetting.switchName} {...customizationSetting} />
        }

        assertNever(customizationSetting);
      })}
    </div>
  </div>
)