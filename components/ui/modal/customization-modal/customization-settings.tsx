import { DropdownCustomizationSetting } from "./dropdown-customization-setting";

export enum CustomizationSettingType {
  DROPDOWN = "DROPDOWN"
}

export type CustomizationSetting<TDropdownOption extends string> =
  DropdownCustomizationSetting<TDropdownOption>;