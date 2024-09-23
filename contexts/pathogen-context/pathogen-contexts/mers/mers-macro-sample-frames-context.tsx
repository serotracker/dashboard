
import { createContext, useState, useEffect } from "react";
import { MapDataPointVisibilityOptions, MersMapCountryHighlightingSettings } from "@/app/pathogen/mers/dashboard/(map)/use-mers-map-customization-modal";
import { useMersMacroSampleFrames } from "@/hooks/mers/useMersMacroSampleFrames";
import { MersMacroSampleFramesQuery } from "@/gql/graphql";

interface MersMacroSampleFramesContextType {
  macroSampleFrames: MersMacroSampleFramesQuery['mersMacroSampleFrames'],
}

const initialMersMacroSampleFramesContext: MersMacroSampleFramesContextType = {
  macroSampleFrames: [],
};

export const MersMacroSampleFramesContext = createContext<
  MersMacroSampleFramesContextType
>(initialMersMacroSampleFramesContext);

interface MersMacroSampleFramesProviderProps {
  children: React.ReactNode;
}

export const MersMacroSampleFramesProvider = (props: MersMacroSampleFramesProviderProps) => {
  const [ macroSampleFrames, setMacroSampleFrames ] = useState<MersMacroSampleFramesQuery['mersMacroSampleFrames']>([]);

  const { data } = useMersMacroSampleFrames();

  useEffect(() => {
    if(!!data && data.mersMacroSampleFrames.length > 0 && macroSampleFrames.length > 0) {
      setMacroSampleFrames(data.mersMacroSampleFrames);
    }
  }, [ macroSampleFrames, setMacroSampleFrames, data ])
  return (
    <MersMacroSampleFramesContext.Provider
      value={{
        macroSampleFrames
      }}
    >
      {props.children}
    </MersMacroSampleFramesContext.Provider>
  );
}