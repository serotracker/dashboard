import * as Switch from '@radix-ui/react-switch';
import { useState } from 'react';

interface BestFitLineCustomizationModalProps {
  onScatterPointsVisibilityChange: (areScatterPointsVisible: boolean) => void;
  initialScatterPointVisibility: boolean;
  visualizationId: string;
}

export const BestFitLineCustomizationModal = (props: BestFitLineCustomizationModalProps) => {
  const [
    areScatterPointsVisible,
    setAreScatterPointsVisible
  ] = useState<boolean>(props.initialScatterPointVisibility);

  return (
    <div className="flex items-center p-4">
      <label htmlFor={`${props.visualizationId}-see-scatter-points`} className='pr-4'>
        See Scatter Points
      </label>
      <Switch.Root
        className="
          w-12
          h-6
          rounded-full
          bg-switch-track-unchecked
          data-[state=checked]:bg-switch-track-checked
        "
        id={`${props.visualizationId}-see-scatter-points`}
        checked={areScatterPointsVisible}
        onCheckedChange={(value) => {
          setAreScatterPointsVisible(value);
          props.onScatterPointsVisibilityChange(value);
        }}
      >
        <Switch.Thumb
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
      </Switch.Root>
    </div>

  );
}