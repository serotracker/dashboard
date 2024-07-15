import { DropdownCustomizationSettingProps } from "./dropdown-customization-setting";
import { MultiSelectDropdownCustomizationSettingProps } from "./multi-select-dropdown-customization-setting";
import { SwitchCustomizationSettingProps } from "./switch-customization-settings";

export enum CustomizationSettingType {
  DROPDOWN = "DROPDOWN",
  MULTI_SELECT_DROPDOWN = "MULTI_SELECT_DROPDOWN",
  SWITCH = "SWITCH"
}

export type CustomizationSetting<TDropdownOption extends string> =
  | DropdownCustomizationSettingProps<TDropdownOption>
  | MultiSelectDropdownCustomizationSettingProps
  | SwitchCustomizationSettingProps;
