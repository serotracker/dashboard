import assertNever from "assert-never";
import { CustomizationSetting, CustomizationSettingType } from "./customization-settings";
import { DropdownCustomizationSetting } from "./dropdown-customization-setting";

export interface CustomizationModalContentProps<TDropdownOption extends string> {
  customizationSettings: CustomizationSetting<TDropdownOption>[];
}

export const CustomizationModalContent = <
  TDropdownOption extends string
>(props: CustomizationModalContentProps<TDropdownOption>): React.ReactNode => (
  <div className="mx-4 mb-4">
    {props.customizationSettings.map((customizationSetting) => {
      if(customizationSetting.type === CustomizationSettingType.DROPDOWN) {
        return <DropdownCustomizationSetting key={customizationSetting.dropdownName} {...customizationSetting} />
      }

      assertNever(customizationSetting.type);
    })}
  </div>
)