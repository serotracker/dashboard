"use client";
import React, { useState } from "react";

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

  const temporarilyDisableEstimateGroupingPopup = (
    input: TemporarilyDisableEstimateGroupingPopupInput
  ) => {
    const id = crypto.randomUUID();

    setTemporaryEstimateGroupingPopupDisables((currentValue) => [
      ...currentValue,
      { id },
    ]);

    setMapControlState({
      estimateGroupingPopupDisabled: true,
    });

    setTimeout(() => {
      const disableWithId = temporaryEstimateGroupingPopupDisables.find(
        ({ id: elementId }) => id === elementId
      );

      if (
        disableWithId &&
        temporaryEstimateGroupingPopupDisables.length === 1
      ) {
        setMapControlState({
          estimateGroupingPopupDisabled: false,
        });
      }

      setTemporaryEstimateGroupingPopupDisables((currentValue) =>
        currentValue.filter(({ id: elementId }) => id === elementId)
      );
    }, input.milliseconds);
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
