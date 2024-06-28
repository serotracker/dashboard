import { Switch, SwitchProps } from "@/components/customs/switch/switch";
import { cn } from '@/lib/utils';
import { CustomizationSettingType } from "./customization-settings";

export type SwitchCustomizationSettingProps = {
  type: CustomizationSettingType.SWITCH; 
  switchName: string;
} & SwitchProps;

export const SwitchCustomizationSetting = (props: Omit<SwitchCustomizationSettingProps,'type'>) => {
  const { className: _, ...propsWithoutClassname } = props;

  return (
    <div className={cn("w-full flex justify-between items-center", props.className ?? '')}>
      <p> {props.switchName} </p>
      <Switch {...propsWithoutClassname} />
    </div>
  );
}