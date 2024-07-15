import { cn } from '@/lib/utils';
import { CustomizationSettingType } from "./customization-settings";
import { Select, SelectProps } from '@/components/customs/select';

export type MultiSelectDropdownCustomizationSettingProps = {
  dropdownName: string;
  type: CustomizationSettingType.MULTI_SELECT_DROPDOWN; 
} & Omit<SelectProps, 'singleSelect'>;

export const MultiSelectDropdownCustomizationSetting = (
  props: Omit<MultiSelectDropdownCustomizationSettingProps, 'type'>
) => {
  const { className: _, ...propsWithoutClassname } = props;

  return (
    <div className={cn("w-full flex justify-between items-center", props.className ?? '')}>
      <p> {props.dropdownName} </p>
      <Select className='max-w-md' {...propsWithoutClassname} />
    </div>
  );
}