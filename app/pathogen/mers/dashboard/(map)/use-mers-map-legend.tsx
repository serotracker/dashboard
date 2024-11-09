import { CountryHighlightLayerLegend, CountryHighlightLayerLegendProps } from "@/components/ui/pathogen-map/country-highlight-layers/country-highlight-layer-legend";
import { Breakpoint, useBreakpoint } from "@/hooks/useBreakpoint";
import { useMemo, useState } from "react";

interface UseMersMapLegendInput {
  legendProps: Omit<CountryHighlightLayerLegendProps, 'closeButtonConfiguration'>;
}

export const useMersMapLegend = (input: UseMersMapLegendInput) => {
  const { legendProps } = input;
  const { isGreaterThanOrEqualToBreakpoint, currentBreakpoint } = useBreakpoint();
  const [ _mersMapClosed, setMersMapClosed ] = useState<boolean | null>(null);

  const isOnMdBreakpointOrBelow = useMemo(() => {
    const oppositeOfResult = isGreaterThanOrEqualToBreakpoint(currentBreakpoint, Breakpoint.LG);

    if(typeof oppositeOfResult === 'boolean') {
      return !oppositeOfResult;
    }

    return true;
  }, [ isGreaterThanOrEqualToBreakpoint, currentBreakpoint ])

  const mersMapClosed = useMemo(() => {
    if(_mersMapClosed !== null) {
      return _mersMapClosed;
    }

    if(!isOnMdBreakpointOrBelow) {
      return false;
    }

    return true;
  }, [ _mersMapClosed, isOnMdBreakpointOrBelow ]);

  const mersMapLegend = useMemo(() => {
    if(mersMapClosed) {
      return (
        <button
          className='absolute bottom-1 right-1 mb-1 bg-white/60 backdrop-blur-md py-1 px-2 rounded-md'
          onClick={() => setMersMapClosed(false)}
        >
          <p>Show Legend</p>
        </button>
      );
    }
    return (
      <CountryHighlightLayerLegend
        closeButtonConfiguration={{
          enabled: true,
          onClick: () => setMersMapClosed(true)
        }}
        {...legendProps}
      />
    );
  }, [ mersMapClosed, legendProps ]);

  return {
    mersMapLegend
  }
}