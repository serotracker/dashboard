import { ColorResult, HuePicker } from 'react-color';
import { cn } from '@/lib/utils';
import { CustomizationSettingType } from './customization-settings';
import { useState } from 'react';

export interface ColourPickerCustomizationSettingProps {
  type: CustomizationSettingType.COLOUR_PICKER;
  className?: string;
  colourPickerName: string;
  chosenColour: string;
  setChosenColour: (newChosenColour: string) => void;
}

const colourResultToHexString = (colourResult: ColorResult): string => `#${
  colourResult.rgb.r.toString(16).padStart(2, '0')
}${
  colourResult.rgb.g.toString(16).padStart(2, '0')
}${
  colourResult.rgb.b.toString(16).padStart(2, '0')
}`

export const ColourPickerCustomizationSetting = (props: ColourPickerCustomizationSettingProps) => {
  const [ intermediateColour, setIntermediateColour ] = useState<string>(props.chosenColour);

  return (
    <div className={cn("w-full flex justify-between items-center", props.className ?? '')}>
      <p> {props.colourPickerName} </p>
      <div className='border-2 border-black cursor-pointer'>
        <HuePicker
          color={{
            r: parseInt(intermediateColour.slice(1, 3), 16),
            g: parseInt(intermediateColour.slice(3, 5), 16),
            b: parseInt(intermediateColour.slice(5, 7), 16)
          }}
          onChange={(newColour) => {
            const newColourHexString = colourResultToHexString(newColour);

            setIntermediateColour(newColourHexString);
          }}
          onChangeComplete={(newColour) => {
            const newColourHexString = colourResultToHexString(newColour);

            setIntermediateColour(newColourHexString);
            props.setChosenColour(newColourHexString);
          }}
        />
      </div>
    </div>
  )
}