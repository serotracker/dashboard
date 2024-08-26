import { createContext, useState } from "react";
import { MapDataPointVisibilityOptions } from "@/app/pathogen/mers/dashboard/(map)/use-mers-map-customization-modal";

interface MersMapCustomizationsContextType {
  mapDataPointVisibilitySetting: MapDataPointVisibilityOptions;
  setMapDataPointVisibilitySetting: (newValue: MapDataPointVisibilityOptions) => void;
}

const initialMersMapCustomizationsContext: MersMapCustomizationsContextType = {
  mapDataPointVisibilitySetting: MapDataPointVisibilityOptions.ESTIMATES_ONLY,
  setMapDataPointVisibilitySetting: () => {},
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

  return (
    <MersMapCustomizationsContext.Provider
      value={{
        mapDataPointVisibilitySetting: mapDataPointVisibilitySetting,
        setMapDataPointVisibilitySetting: setMapDataPointVisibilitySetting,
      }}
    >
      {props.children}
    </MersMapCustomizationsContext.Provider>
  );
}