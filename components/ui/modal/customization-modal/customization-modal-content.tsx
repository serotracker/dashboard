import assertNever from "assert-never";
import { CustomizationSetting, CustomizationSettingType } from "./customization-settings";
import { DropdownCustomizationSetting } from "./dropdown-customization-setting";
import { SwitchCustomizationSetting } from "./switch-customization-settings";
import { ModalHeader } from "../modal-header";
import { MultiSelectDropdownCustomizationSetting } from "./multi-select-dropdown-customization-setting";
import { ColourPickerCustomizationSetting } from "./colour-picker-customization-setting";

export interface CustomizationModalContentProps<TDropdownOption extends string> {
  className?: string;
  customizationSettings: CustomizationSetting<TDropdownOption>[];
  closeModal: () => void;
}

export const CustomizationModalContent = <
  TDropdownOption extends string
>(props: CustomizationModalContentProps<TDropdownOption>): React.ReactNode => {
  return (
    <div className={props.className}>
      <ModalHeader header={"Customize"} closeModal={props.closeModal} />
      <div className="mx-4 mb-4">
        {props.customizationSettings.map((customizationSetting, index) => {
          const isLastElement = index === props.customizationSettings.length - 1;

          if(customizationSetting.type === CustomizationSettingType.DROPDOWN) {
            return <DropdownCustomizationSetting className={isLastElement ? '' : 'mb-6'} key={customizationSetting.dropdownName} {...customizationSetting} />
          }

          if(customizationSetting.type === CustomizationSettingType.MULTI_SELECT_DROPDOWN) {
            return <MultiSelectDropdownCustomizationSetting className={isLastElement ? '' : 'mb-6'} key={customizationSetting.dropdownName} {...customizationSetting} />
          }

          if(customizationSetting.type === CustomizationSettingType.SWITCH) {
            return <SwitchCustomizationSetting className={isLastElement ? '' : 'mb-6'} key={customizationSetting.switchName} {...customizationSetting} />
          }

          if(customizationSetting.type === CustomizationSettingType.COLOUR_PICKER) {
            return <ColourPickerCustomizationSetting className={isLastElement ? '' : 'mb-6'} key={customizationSetting.colourPickerName} {...customizationSetting} />
          }

          assertNever(customizationSetting);
        })}
      </div>
    </div>
  )
}