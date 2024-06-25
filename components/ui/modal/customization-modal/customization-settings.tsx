import { DropdownCustomizationSettingProps } from "./dropdown-customization-setting";
import { SwitchCustomizationSettingProps } from "./switch-customization-settings";

export enum CustomizationSettingType {
  DROPDOWN = "DROPDOWN",
  SWITCH = "SWITCH"
}

export type CustomizationSetting<TDropdownOption extends string> =
  | DropdownCustomizationSettingProps<TDropdownOption>
  | SwitchCustomizationSettingProps;