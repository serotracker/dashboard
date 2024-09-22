import { useMemo, useCallback, useState } from 'react';
import { LegendConfiguration } from "./stacked-bar-chart";
import { assertNever } from 'assert-never';

interface UseBarColourAndLegendPropsInput<TSecondaryGroupingKey extends Exclude<string, "primaryKey">> {
  getColourForSecondaryKeyDefault: (secondaryKey: TSecondaryGroupingKey, index: number) => string;
  secondaryGroupingKeyToLabel: ((input: TSecondaryGroupingKey) => string) | undefined;
  legendConfiguration: LegendConfiguration | undefined;
}

export const useBarColourAndLegendProps = <TSecondaryGroupingKey extends Exclude<string, "primaryKey">>(
  input: UseBarColourAndLegendPropsInput<TSecondaryGroupingKey>
) => {
  const { getColourForSecondaryKeyDefault, legendConfiguration, secondaryGroupingKeyToLabel } = input;
  const [ getColourForSecondaryKey, reassignGetColourForSecondaryKey ] = useState<
    (secondaryKey: TSecondaryGroupingKey, index: number) => string
  >(() => getColourForSecondaryKeyDefault);

  const legendOnMouseOver = useCallback((data: any) => {
    const legendLabelHoveredOver: string = data.value;

    const newGetBarColour : typeof getColourForSecondaryKey = (secondaryKey) => {
      const secondaryKeyLabel = secondaryGroupingKeyToLabel ? secondaryGroupingKeyToLabel(secondaryKey) : secondaryKey;
      return secondaryKeyLabel === legendLabelHoveredOver
        ? "#0b41e0"
        : "#f0131e";
    }

    reassignGetColourForSecondaryKey(() => newGetBarColour);
  }, [ secondaryGroupingKeyToLabel, reassignGetColourForSecondaryKey ]);

  const legendOnMouseOut = useCallback(() => {
    reassignGetColourForSecondaryKey(() => getColourForSecondaryKeyDefault);
  }, [ getColourForSecondaryKeyDefault, reassignGetColourForSecondaryKey ]);
  
  const legendProps = useMemo(() => {
    if(!legendConfiguration) {
      return {
        onMouseOver: legendOnMouseOver,
        onMouseOut: legendOnMouseOut
      }
    }
    if(legendConfiguration === LegendConfiguration.RIGHT_ALIGNED) {
      return {
        layout: "vertical" as const,
        verticalAlign: "middle" as const,
        align: "right" as const,
        wrapperStyle: { right: -10 },
        onMouseOver: legendOnMouseOver,
        onMouseOut: legendOnMouseOut
      }
    }
    if(legendConfiguration === LegendConfiguration.BOTTOM_ALIGNED) {
      return {
        layout: "horizontal" as const,
        verticalAlign: "bottom" as const,
        align: "center" as const,
        wrapperStyle: {
          paddingTop: 10,
          bottom: 0,
        },
        onMouseOver: legendOnMouseOver,
        onMouseOut: legendOnMouseOut
      }
    }

    assertNever(legendConfiguration);
  }, [ legendConfiguration, legendOnMouseOver, legendOnMouseOut ]);

  return {
    getColourForSecondaryKey,
    legendProps
  }
}