import { createContext, useState } from "react";
import { MapDataPointVisibilityOptions, MersMapCountryHighlightingSettings } from "@/app/pathogen/mers/dashboard/(map)/use-mers-map-customization-modal";

interface MersMapCustomizationsContextType {
  mapDataPointVisibilitySetting: MapDataPointVisibilityOptions;
  setMapDataPointVisibilitySetting: (newValue: MapDataPointVisibilityOptions) => void;
  currentMapCountryHighlightingSettings: MersMapCountryHighlightingSettings;
  setCurrentMapCountryHighlightingSettings: (newValue: MersMapCountryHighlightingSettings) => void;
}

const initialMersMapCustomizationsContext: MersMapCustomizationsContextType = {
  mapDataPointVisibilitySetting: MapDataPointVisibilityOptions.ESTIMATES_ONLY,
  setMapDataPointVisibilitySetting: () => {},
  currentMapCountryHighlightingSettings: MersMapCountryHighlightingSettings.EVENTS_AND_ESTIMATES,
  setCurrentMapCountryHighlightingSettings: () => {}
};

export const MersMapCustomizationsContext = createContext<
  MersMapCustomizationsContextType
>(initialMersMapCustomizationsContext);

interface MersMapCustomizationsProviderProps {
  children: React.ReactNode;
}

export const MersMapCustomizationsProvider = (props: MersMapCustomizationsProviderProps) => {
  const [
    mapDataPointVisibilitySetting,
    setMapDataPointVisibilitySetting
  ] = useState<MapDataPointVisibilityOptions>(MapDataPointVisibilityOptions.ESTIMATES_ONLY);
  const [
    currentMapCountryHighlightingSettings,
    setCurrentMapCountryHighlightingSettings
  ] = useState<MersMapCountryHighlightingSettings>(MersMapCountryHighlightingSettings.TOTAL_CAMEL_POPULATION);

  return (
    <MersMapCustomizationsContext.Provider
      value={{
        mapDataPointVisibilitySetting: mapDataPointVisibilitySetting,
        setMapDataPointVisibilitySetting: setMapDataPointVisibilitySetting,
        currentMapCountryHighlightingSettings: currentMapCountryHighlightingSettings,
        setCurrentMapCountryHighlightingSettings: setCurrentMapCountryHighlightingSettings,
      }}
    >
      {props.children}
    </MersMapCustomizationsContext.Provider>
  );
}