import * as RadixUISwitch from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  className?: string;
  switchValue: boolean;
  onSwitchValueChange: (newSwitchValue: boolean) => void;
}

export const Switch = (props: SwitchProps) => (
  <RadixUISwitch.Root
    className={cn(`
      w-12
      h-6
      rounded-full
      bg-switch-track-unchecked
      data-[state=checked]:bg-switch-track-checked
    `, props.className ?? '')}
    checked={props.switchValue}
    onCheckedChange={(newSwitchValue) => props.onSwitchValueChange(newSwitchValue)}
  >
    <RadixUISwitch.Thumb
      className="
        w-5
        ml-1
        mr-1
        h-5
        rounded-full
        block
        bg-switch-thumb-unchecked
        data-[state=checked]:bg-switch-thumb-checked
        transform
        transition
        translate-x-0
        data-[state=checked]:translate-x-5
      "
    />
  </RadixUISwitch.Root>
)