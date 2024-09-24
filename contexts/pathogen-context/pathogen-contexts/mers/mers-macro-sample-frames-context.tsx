
import { createContext, useState, useEffect } from "react";
import { MapDataPointVisibilityOptions, MersMapCountryHighlightingSettings } from "@/app/pathogen/mers/dashboard/(map)/use-mers-map-customization-modal";
import { useMersMacroSampleFrames } from "@/hooks/mers/useMersMacroSampleFrames";
import { MersMacroSampleFrameType as MersMacroSampleFrameTypeForApi } from "@/gql/graphql";
import uniq from "lodash/uniq";

interface MersMacroSampleFramesContextType {
  macroSampleFrames: Array<{
    macroSampleFrame: MersMacroSampleFrameType;
    sampleFrames: string[];
  }>;
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

export enum MersMacroSampleFrameType {
  GENERAL_POPULATION = 'GENERAL_POPULATION',
  HIGH_RISK_NOT_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS = 'HIGH_RISK_NOT_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS',
  HIGH_RISK_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS = 'HIGH_RISK_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS',
  HIGH_RISK_POPULATIONS = 'HIGH_RISK_POPULATIONS',
  UNCATEGORIZED = 'UNCATEGORIZED'
}

const apiMersMacroSampleFrameTypeToDomainTypeMap = {
  [MersMacroSampleFrameTypeForApi.GeneralPopulation]: MersMacroSampleFrameType.GENERAL_POPULATION,
  [MersMacroSampleFrameTypeForApi.HighRiskNotOccupationallyExposedToDromedaryCamels]: MersMacroSampleFrameType.HIGH_RISK_NOT_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS,
  [MersMacroSampleFrameTypeForApi.HighRiskOccupationallyExposedToDromedaryCamels]: MersMacroSampleFrameType.HIGH_RISK_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS,
  [MersMacroSampleFrameTypeForApi.Uncategorized]: MersMacroSampleFrameType.UNCATEGORIZED,
}

export const MersMacroSampleFramesProvider = (props: MersMacroSampleFramesProviderProps) => {
  const [ macroSampleFrames, setMacroSampleFrames ] = useState<MersMacroSampleFramesContextType['macroSampleFrames']>([]);
  const { data } = useMersMacroSampleFrames();

  useEffect(() => {
    if(!!data && data.mersMacroSampleFrames.length > 0 && macroSampleFrames.length === 0) {
      setMacroSampleFrames([
        ...data.mersMacroSampleFrames.map((macroSampleFrame) => ({
          macroSampleFrame: apiMersMacroSampleFrameTypeToDomainTypeMap[macroSampleFrame.macroSampleFrame],
          sampleFrames: macroSampleFrame.sampleFrames
        })),
        {
          macroSampleFrame: MersMacroSampleFrameType.HIGH_RISK_POPULATIONS,
          sampleFrames: uniq([
            ...data.mersMacroSampleFrames
              .filter((macroSampleFrame) => macroSampleFrame.macroSampleFrame === MersMacroSampleFrameTypeForApi.HighRiskNotOccupationallyExposedToDromedaryCamels)
              .flatMap((macroSampleFrame) => macroSampleFrame.sampleFrames),
            ...data.mersMacroSampleFrames
              .filter((macroSampleFrame) => macroSampleFrame.macroSampleFrame === MersMacroSampleFrameTypeForApi.HighRiskOccupationallyExposedToDromedaryCamels)
              .flatMap((macroSampleFrame) => macroSampleFrame.sampleFrames),
          ])
        }
      ]);
    }
  }, [ macroSampleFrames, setMacroSampleFrames, data ]);

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