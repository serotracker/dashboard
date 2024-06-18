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
  borderColourClassname: string;
  hoverColourClassname: string;
  highlightedColourClassname: string;
  dropdownOptionToLabelMap: Record<TDropdownOption, string>;
  onDropdownOptionChange: (option: TDropdownOption) => void;
}

type DropdownCustomizationSettingProps<TDropdownOption extends string> =
  Omit<DropdownCustomizationSetting<TDropdownOption>, 'type'>;

interface SelectItemProps {
  children: React.ReactNode;
  highlightedColourClassname: string;
  value: string;
}

const SelectItem = (props: SelectItemProps) => (
  <Select.Item value={props.value} className={`
    leading-none
    flex
    items-center
    h-6
    pr-9
    pl-6
    relative
    select-none
    ${props.highlightedColourClassname}
    data-[disabled]:pointer-events-none
  `}>
    <Select.ItemText> {props.children} </Select.ItemText>
    <Select.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
      <CheckIcon />
    </Select.ItemIndicator>
  </Select.Item>
);

export const DropdownCustomizationSetting = <
  TDropdownOption extends string
>(props: DropdownCustomizationSettingProps<TDropdownOption>) => (
  <div className="w-full flex justify-between items-center">
    <p> {props.dropdownName} </p>
    <Select.Root value={props.chosenDropdownOption} onValueChange={(value) => props.onDropdownOptionChange(value as TDropdownOption)}>
      <Select.Trigger
        className={`
          inline-flex
          items-center
          justify-center
          rounded
          py-0
          px-4
          leading-none
          h-9
          gap-1.5
          bg-neutral-100
          ${props.hoverColourClassname}
          border
          ${props.borderColourClassname}
        `}
        aria-label={`Open ${props.dropdownName} dropdown`}
      >
        <Select.Value placeholder="Unknown" />
        <Select.Icon className="SelectIcon">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="bg-white rounded-md overflow-hidden">
          <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white cursor-default">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className={`border-2 ${props.borderColourClassname} bg-neutral-100`}>
            {props.dropdownOptionGroups.map((dropdownOptionGroup, index) =>
              <>
                {index !== 0 && <Select.Separator className="m-1 h-px bg-black" />}
                <Select.Group key={dropdownOptionGroup.groupHeader}>
                  <Select.Label className="py-0 px-6 leading-6 text-xs">
                    {dropdownOptionGroup.groupHeader}
                  </Select.Label>
                  {dropdownOptionGroup.options.map((option) =>
                    <SelectItem
                      key={option}
                      value={option}
                      highlightedColourClassname={props.highlightedColourClassname}
                    >
                      {props.dropdownOptionToLabelMap[option]}
                    </SelectItem>
                  )}
                </Select.Group>
              </>
            )}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white cursor-default">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </div>
)