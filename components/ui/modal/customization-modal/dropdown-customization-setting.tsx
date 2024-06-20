import { CustomizationSettingType } from "./customization-settings";
import { Dropdown, DropdownProps } from '@/components/customs/dropdown/dropdown';

export type DropdownCustomizationSetting<TDropdownOption extends string> = {
  type: CustomizationSettingType.DROPDOWN; 
} & DropdownProps<TDropdownOption>;

export const DropdownCustomizationSetting = <
  TDropdownOption extends string
>(props: DropdownProps<TDropdownOption>) => (
  <div className="w-full flex justify-between items-center">
    <p> {props.dropdownName} </p>
    <Dropdown {...props} />
  </div>
)