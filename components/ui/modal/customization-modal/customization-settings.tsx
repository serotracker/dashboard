import { ColourPickerCustomizationSettingProps } from "./colour-picker-customization-setting";
import { DropdownCustomizationSettingProps } from "./dropdown-customization-setting";
import { MultiSelectDropdownCustomizationSettingProps } from "./multi-select-dropdown-customization-setting";
import { SwitchCustomizationSettingProps } from "./switch-customization-settings";

export enum CustomizationSettingType {
  DROPDOWN = "DROPDOWN",
  MULTI_SELECT_DROPDOWN = "MULTI_SELECT_DROPDOWN",
  SWITCH = "SWITCH",
  COLOUR_PICKER = "COLOUR_PICKER"
}

export type CustomizationSetting<TDropdownOption extends string> =
  | DropdownCustomizationSettingProps<TDropdownOption>
  | MultiSelectDropdownCustomizationSettingProps
  | SwitchCustomizationSettingProps
  | ColourPickerCustomizationSettingProps;
