import * as Select from '@radix-ui/react-select';
import { CustomizationSettingType } from "./customization-settings";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

export interface DropdownCustomizationSetting<TDropdownOption extends string> {
  type: CustomizationSettingType.DROPDOWN; 
  dropdownName: string;
  dropdownOptionGroups: {
    groupHeader: string;
    options: TDropdownOption[]
  }[];
  chosenDropdownOption: TDropdownOption;
  dropdownOptionToLabelMap: Record<TDropdownOption, string>;
  onDropdownOptionChange: (option: TDropdownOption) => void;
}

type DropdownCustomizationSettingProps<TDropdownOption extends string> =
  Omit<DropdownCustomizationSetting<TDropdownOption>, 'type'>;

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
}

const SelectItem = (props: SelectItemProps) => (
  <Select.Item value={props.value} className='SelectItem'>
    <Select.ItemText> {props.children} </Select.ItemText>
    <Select.ItemIndicator>
      <CheckIcon />
    </Select.ItemIndicator>
  </Select.Item>
);

export const DropdownCustomizationSetting = <
  TDropdownOption extends string
>(props: DropdownCustomizationSettingProps<TDropdownOption>) => (
  <div className="w-full flex justify-between">
    <p> {props.dropdownName} </p>
    <Select.Root value={props.chosenDropdownOption} onValueChange={(value) => props.onDropdownOptionChange(value as TDropdownOption)}>
      <Select.Trigger className="SelectTrigger" aria-label="Food">
        <Select.Value placeholder="Unknown" />
        <Select.Icon className="SelectIcon">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="SelectContent">
          <Select.ScrollUpButton className="SelectScrollButton">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="SelectViewport">
            {props.dropdownOptionGroups.map((dropdownOptionGroup) => 
              <Select.Group key={dropdownOptionGroup.groupHeader}>
                <Select.Label className="SelectLabel">{dropdownOptionGroup.groupHeader}</Select.Label>
                {dropdownOptionGroup.options.map((option) =>
                  <SelectItem key={option} value={option}>{props.dropdownOptionToLabelMap[option]}</SelectItem>
                )}
              </Select.Group>
            )}
          </Select.Viewport>
          <Select.ScrollDownButton className="SelectScrollButton">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </div>
)