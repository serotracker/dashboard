import { useCallback, useMemo, useState } from "react";
import { Legend } from 'recharts';
import { UnRegion, WhoRegion } from "@/gql/graphql";
import { LegendConfiguration } from "@/components/customs/visualizations/stacked-bar-chart";

interface UseEstimatesByRegionLegendPropsInput {
  regionToDotColourDefault: (region: WhoRegion | UnRegion | string, regionIndex: number) => string;
  regionToLegendLabel: (region:WhoRegion | UnRegion | string) => string;
  legendConfiguration: LegendConfiguration
}

export const useEstimatesByRegionLegendProps = (
  input: UseEstimatesByRegionLegendPropsInput
) => {
  const { regionToDotColourDefault, regionToLegendLabel, legendConfiguration } = input;
  const [
    regionToDotColour,
    setRegionToDotColour
  ] = useState<(region:WhoRegion | UnRegion | string, regionIndex: number) => string>(() => regionToDotColourDefault);

  const legendOnMouseOver = useCallback((data: any) => {
    const legendLabelHoveredOver: string = data.value;

    const newRegionToDotColour: typeof regionToDotColour = (region) => {
      const legendLabelForRegion = regionToLegendLabel(region);

      return legendLabelForRegion === legendLabelHoveredOver
        ? "#0ee32a"
        : "#f0131e";
    }

    setRegionToDotColour(() => newRegionToDotColour);
  }, [ setRegionToDotColour, regionToLegendLabel ]);

  const legendOnMouseOut = useCallback(() => {
    setRegionToDotColour(() => regionToDotColourDefault);
  }, [ setRegionToDotColour, regionToDotColourDefault ]);

  const legendProps = useMemo(() => 
    legendConfiguration === LegendConfiguration.RIGHT_ALIGNED
      ? {
          layout: "vertical" as const,
          verticalAlign: "middle" as const,
          align: "right" as const,
          wrapperStyle: { right: -10 },
          onMouseOver: legendOnMouseOver,
          onMouseOut: legendOnMouseOut
        }
      : {
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
  , [ legendConfiguration, legendOnMouseOver, legendOnMouseOut ])

  return {
    legendProps,
    regionToDotColour
  }
}