import * as Select from '@radix-ui/react-select';
import { CheckIcon } from "lucide-react";

interface DropdownItemProps {
  children: React.ReactNode;
  highlightedColourClassname: string;
  value: string;
}

export const DropdownItem = (props: DropdownItemProps) => (
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