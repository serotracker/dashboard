import assertNever from "assert-never";
import { CustomizationSetting, CustomizationSettingType } from "./customization-settings";
import { DropdownCustomizationSetting } from "./dropdown-customization-setting";
import { SwitchCustomizationSetting } from "./switch-customization-settings";

export interface CustomizationModalContentProps<TDropdownOption extends string> {
  customizationSettings: CustomizationSetting<TDropdownOption>[];
}

export const CustomizationModalContent = <
  TDropdownOption extends string
>(props: CustomizationModalContentProps<TDropdownOption>): React.ReactNode => (
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
)