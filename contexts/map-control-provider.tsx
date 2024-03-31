"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";

interface MapControlContextType {
  estimateGroupingPopupDisabled: boolean;
  temporarilyDisableEstimateGroupingPopup: (
    input: TemporarilyDisableEstimateGroupingPopupInput
  ) => void;
}

interface TemporarilyDisableEstimateGroupingPopupInput {
  milliseconds: number;
}

export const MapControlContext = React.createContext<MapControlContextType>({
  estimateGroupingPopupDisabled: false,
  temporarilyDisableEstimateGroupingPopup: () => {},
});

interface TemporaryEstimateGroupingPopupDisable {
  id: string;
}

export function MapControlProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mapControlState, setMapControlState] = useState<
    Pick<MapControlContextType, "estimateGroupingPopupDisabled">
  >({
    estimateGroupingPopupDisabled: false,
  });

  const [
    temporaryEstimateGroupingPopupDisables,
    setTemporaryEstimateGroupingPopupDisables,
  ] = useState<TemporaryEstimateGroupingPopupDisable[]>([]);
  const temporaryEstimateGroupingPopupDisablesRef = useRef<TemporaryEstimateGroupingPopupDisable[]>([])

  useEffect(() => {
    temporaryEstimateGroupingPopupDisablesRef.current = temporaryEstimateGroupingPopupDisables
  }, [temporaryEstimateGroupingPopupDisables])

  const handle = (id: string) => {
    console.log(temporaryEstimateGroupingPopupDisablesRef.current)
    const disableWithId = temporaryEstimateGroupingPopupDisablesRef.current.find(
      ({ id: elementId }) => id === elementId
    );

    if (
      disableWithId &&
      temporaryEstimateGroupingPopupDisablesRef.current.length === 1
    ) {
      setMapControlState({
        estimateGroupingPopupDisabled: false,
      });
    }

    setTemporaryEstimateGroupingPopupDisables((currentValue) =>
      currentValue.filter(({ id: elementId }) => id !== elementId)
    );
  }

  const temporarilyDisableEstimateGroupingPopup = (
    input: TemporarilyDisableEstimateGroupingPopupInput
  ) => {
    const id = crypto.randomUUID();

    setTemporaryEstimateGroupingPopupDisables(currentValue => [
      ...currentValue,
      { id },
    ]);

    setMapControlState({
      estimateGroupingPopupDisabled: true,
    });

    setTimeout(handle, input.milliseconds, id);
  };

  return (
    <MapControlContext.Provider
      value={{
        estimateGroupingPopupDisabled:
          mapControlState.estimateGroupingPopupDisabled,
        temporarilyDisableEstimateGroupingPopup,
      }}
    >
      {children}
    </MapControlContext.Provider>
  );
}
