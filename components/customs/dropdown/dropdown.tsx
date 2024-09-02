import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { DropdownItem } from './dropdown-item';
import { cn } from '@/lib/utils';
import { PossibleFragmentSpreadsRule } from 'graphql';
import { GenericTooltip } from '../generic-tooltip';

export interface DropdownProps<TDropdownOption extends string> {
  className?: string;
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
  tooltipContent?: React.ReactNode | undefined;
}

export const Dropdown = <TDropdownOption extends string>(props: DropdownProps<TDropdownOption>) => (
  <div className={props.tooltipContent ? 'flex' : 'inline'}>
    <Select.Root value={props.chosenDropdownOption} onValueChange={(value) => props.onDropdownOptionChange(value as TDropdownOption)}>
      <Select.Trigger
        className={cn(`
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
        `, props.className ?? '')}
        aria-label={`Open ${props.dropdownName} dropdown`}
      >
        <Select.Value placeholder="Unknown" />
        <Select.Icon className="SelectIcon">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="bg-white rounded-md overflow-hidden z-30">
          <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white cursor-default">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className={`border-2 ${props.borderColourClassname} bg-neutral-100`}>
            {props.dropdownOptionGroups.map((dropdownOptionGroup, index) =>
              <div key={dropdownOptionGroup.groupHeader}>
                {index !== 0 && <Select.Separator className="m-1 h-px bg-black" />}
                <Select.Group>
                  <Select.Label className="py-0 px-6 leading-6 text-xs">
                    {dropdownOptionGroup.groupHeader}
                  </Select.Label>
                  {dropdownOptionGroup.options.map((option) =>
                    <DropdownItem
                      key={option}
                      value={option}
                      highlightedColourClassname={props.highlightedColourClassname}
                    >
                      {props.dropdownOptionToLabelMap[option]}
                    </DropdownItem>
                  )}
                </Select.Group>
              </div>
            )}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white cursor-default">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
    {props.tooltipContent && <GenericTooltip className='pl-2' tooltipContent={props.tooltipContent} />}
  </div>
)