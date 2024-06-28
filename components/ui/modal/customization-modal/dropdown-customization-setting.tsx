import { Dropdown, DropdownProps } from '@/components/customs/dropdown/dropdown';
import { cn } from '@/lib/utils';
import { CustomizationSettingType } from "./customization-settings";

export type DropdownCustomizationSettingProps<TDropdownOption extends string> = {
  type: CustomizationSettingType.DROPDOWN; 
} & DropdownProps<TDropdownOption>;

export const DropdownCustomizationSetting = <
  TDropdownOption extends string
>(props: Omit<DropdownCustomizationSettingProps<TDropdownOption>, 'type'>) => {
  const { className: _, ...propsWithoutClassname } = props;

  return (
    <div className={cn("w-full flex justify-between items-center", props.className ?? '')}>
      <p> {props.dropdownName} </p>
      <Dropdown {...propsWithoutClassname} />
    </div>
  );
}