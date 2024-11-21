import { createContext, useState, useEffect, useCallback } from "react";
import { useMersMacroSampleFrames } from "@/hooks/mers/useMersMacroSampleFrames";
import { MersMacroSampleFrameType as MersMacroSampleFrameTypeForApi } from "@/gql/graphql";
import uniq from "lodash/uniq";
import { useMersPrimaryEstimates } from "@/hooks/mers/useMersPrimaryEstimates";

interface AdjustMacroSampleFrameInput {
  macroSampleFrame: (
    MersMacroSampleFrameType.GENERAL_POPULATION |
    MersMacroSampleFrameType.HIGH_RISK_HEALTHCARE_WORKERS |
    MersMacroSampleFrameType.HIGH_RISK_CLINICAL_MONITORING |
    MersMacroSampleFrameType.HIGH_RISK_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS
  );
  newSampleFrames: string[];
}

interface MersMacroSampleFramesContextType {
  macroSampleFrames: Array<{
    macroSampleFrame: MersMacroSampleFrameType;
    sampleFrames: string[];
  }>;
  allHumanSampleFrames: string[];
  adjustMacroSampleFrame: (input: AdjustMacroSampleFrameInput) => void;
  getMacroSampleFramesForSampleFrame: (sampleFrame: string) => MersMacroSampleFrameType[];
}

const initialMersMacroSampleFramesContext: MersMacroSampleFramesContextType = {
  macroSampleFrames: [],
  allHumanSampleFrames: [],
  adjustMacroSampleFrame: () => {},
  getMacroSampleFramesForSampleFrame: () => []
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
  HIGH_RISK_HEALTHCARE_WORKERS = 'HIGH_RISK_HEALTHCARE_WORKERS',
  HIGH_RISK_CLINICAL_MONITORING = 'HIGH_RISK_CLINICAL_MONITORING',
  HIGH_RISK_OTHER = 'HIGH_RISK_OTHER',
  HIGH_RISK_POPULATIONS = 'HIGH_RISK_POPULATIONS',
  UNCATEGORIZED = 'UNCATEGORIZED'
}

export const isMersMacroSampleFrameType = (value: string): value is MersMacroSampleFrameType => Object.values(MersMacroSampleFrameType).some((element) => element === value);

export const mersMacroSampleFrameTypeToTextMap = {
  [MersMacroSampleFrameType.GENERAL_POPULATION]: 'The General Population',
  [MersMacroSampleFrameType.HIGH_RISK_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS]: 'High Risk Populations (Occupationally Exposed to Camels)',
  [MersMacroSampleFrameType.HIGH_RISK_NOT_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS]: 'High Risk Populations (Non-Occupationally Exposed)',
  [MersMacroSampleFrameType.HIGH_RISK_HEALTHCARE_WORKERS]: 'High Risk Populations (Healthcare Workers)',
  [MersMacroSampleFrameType.HIGH_RISK_CLINICAL_MONITORING]: 'High Risk Populations (Suspected Cases or Contacts)',
  [MersMacroSampleFrameType.HIGH_RISK_OTHER]: 'High Risk Populations (Other)',
  [MersMacroSampleFrameType.HIGH_RISK_POPULATIONS]: 'High Risk Populations',
  [MersMacroSampleFrameType.UNCATEGORIZED]: 'Uncategorized',
}

const apiMersMacroSampleFrameTypeToDomainTypeMap = {
  [MersMacroSampleFrameTypeForApi.GeneralPopulation]: MersMacroSampleFrameType.GENERAL_POPULATION,
  [MersMacroSampleFrameTypeForApi.HighRiskNotOccupationallyExposedToDromedaryCamels]: MersMacroSampleFrameType.HIGH_RISK_NOT_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS,
  [MersMacroSampleFrameTypeForApi.HighRiskOccupationallyExposedToDromedaryCamels]: MersMacroSampleFrameType.HIGH_RISK_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS,
  [MersMacroSampleFrameTypeForApi.HighRiskHealthcareWorkers]: MersMacroSampleFrameType.HIGH_RISK_HEALTHCARE_WORKERS,
  [MersMacroSampleFrameTypeForApi.HighRiskOther]: MersMacroSampleFrameType.HIGH_RISK_OTHER,
  [MersMacroSampleFrameTypeForApi.HighRiskClinicalMonitoring]: MersMacroSampleFrameType.HIGH_RISK_CLINICAL_MONITORING,
  [MersMacroSampleFrameTypeForApi.Uncategorized]: MersMacroSampleFrameType.UNCATEGORIZED,
}

const mersMacroSampleFrameToSortOrderMap = {
  [MersMacroSampleFrameType.HIGH_RISK_POPULATIONS]: 1,
  [MersMacroSampleFrameType.HIGH_RISK_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS]: 2,
  [MersMacroSampleFrameType.HIGH_RISK_NOT_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS]: 3,
  [MersMacroSampleFrameType.HIGH_RISK_HEALTHCARE_WORKERS]: 4,
  [MersMacroSampleFrameType.HIGH_RISK_CLINICAL_MONITORING]: 5,
  [MersMacroSampleFrameType.HIGH_RISK_OTHER]: 6,
  [MersMacroSampleFrameType.GENERAL_POPULATION]: 7,
  [MersMacroSampleFrameType.UNCATEGORIZED]: 8,
}

const mersMacroSampleFramePriorityMap = {
  [MersMacroSampleFrameType.HIGH_RISK_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS]: 1,
  [MersMacroSampleFrameType.HIGH_RISK_HEALTHCARE_WORKERS]: 2,
  [MersMacroSampleFrameType.HIGH_RISK_CLINICAL_MONITORING]: 3,
  [MersMacroSampleFrameType.HIGH_RISK_OTHER]: 4,
  [MersMacroSampleFrameType.GENERAL_POPULATION]: 5,
  [MersMacroSampleFrameType.HIGH_RISK_POPULATIONS]: 6,
  [MersMacroSampleFrameType.HIGH_RISK_NOT_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS]: 7,
  [MersMacroSampleFrameType.UNCATEGORIZED]: 8,
}

export const MersMacroSampleFramesProvider = (props: MersMacroSampleFramesProviderProps) => {
  const [ macroSampleFrames, _setMacroSampleFrames ] = useState<MersMacroSampleFramesContextType['macroSampleFrames']>([]);
  const [ allHumanSampleFrames, setAllHumanSampleFrames ] = useState<string[]>([]);
  const { data } = useMersMacroSampleFrames();
  const { data: primaryEstimates } = useMersPrimaryEstimates();

  const setMacroSampleFrames = useCallback((newMacroSampleFrames: typeof macroSampleFrames) => {
    const sortedNewMacroSampleFrames = newMacroSampleFrames
      .sort((macroSampleFrameA, macroSampleFrameB) => (
        mersMacroSampleFrameToSortOrderMap[macroSampleFrameA.macroSampleFrame] > mersMacroSampleFrameToSortOrderMap[macroSampleFrameB.macroSampleFrame]
          ? 1
          : -1
      ));

    _setMacroSampleFrames(sortedNewMacroSampleFrames);
  }, [ _setMacroSampleFrames ]);

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
              .filter((macroSampleFrame) => macroSampleFrame.macroSampleFrame === MersMacroSampleFrameTypeForApi.HighRiskOther)
              .flatMap((macroSampleFrame) => macroSampleFrame.sampleFrames),
            ...data.mersMacroSampleFrames
              .filter((macroSampleFrame) => macroSampleFrame.macroSampleFrame === MersMacroSampleFrameTypeForApi.HighRiskHealthcareWorkers)
              .flatMap((macroSampleFrame) => macroSampleFrame.sampleFrames),
            ...data.mersMacroSampleFrames
              .filter((macroSampleFrame) => macroSampleFrame.macroSampleFrame === MersMacroSampleFrameTypeForApi.HighRiskClinicalMonitoring)
              .flatMap((macroSampleFrame) => macroSampleFrame.sampleFrames),
            ...data.mersMacroSampleFrames
              .filter((macroSampleFrame) => macroSampleFrame.macroSampleFrame === MersMacroSampleFrameTypeForApi.HighRiskOccupationallyExposedToDromedaryCamels)
              .flatMap((macroSampleFrame) => macroSampleFrame.sampleFrames),
          ])
        }
      ]);
    }
  }, [ macroSampleFrames, setMacroSampleFrames, data ]);

  useEffect(() => {
    if(!!primaryEstimates && primaryEstimates?.mersPrimaryEstimates.length > 0 && allHumanSampleFrames.length === 0) {
      const allHumanSampleFrames = uniq(primaryEstimates.mersPrimaryEstimates
        .flatMap((primaryEstimate) => (
          primaryEstimate.primaryEstimateInfo.__typename === 'PrimaryHumanMersSeroprevalenceEstimateInformation' || 
          primaryEstimate.primaryEstimateInfo.__typename === 'PrimaryHumanMersViralEstimateInformation'
        ) ? primaryEstimate.primaryEstimateInfo.sampleFrames : [])
        .filter((sampleFrame): sampleFrame is NonNullable<typeof sampleFrame> => sampleFrame !== undefined && sampleFrame !== null)
      )

      setAllHumanSampleFrames(allHumanSampleFrames);
    }
  }, [ allHumanSampleFrames, setAllHumanSampleFrames, primaryEstimates ]);

  const adjustMacroSampleFrame = useCallback((input: AdjustMacroSampleFrameInput) => {
    let macroSampleFramesToNotRecalculate = macroSampleFrames
      .filter((macroSampleFrame) => macroSampleFrame.macroSampleFrame !== input.macroSampleFrame)

    let recalculatedMacroSampleFrameValues: typeof macroSampleFrames = [{
      macroSampleFrame: input.macroSampleFrame,
      sampleFrames: input.newSampleFrames
    }]

    const macroSampleFrameValuesWithoutRecalculatingTheHighRiskGroup = [
      ...macroSampleFramesToNotRecalculate,
      ...recalculatedMacroSampleFrameValues
    ]

    if(
      input.macroSampleFrame !== MersMacroSampleFrameType.HIGH_RISK_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS &&
      input.macroSampleFrame !== MersMacroSampleFrameType.HIGH_RISK_CLINICAL_MONITORING &&
      input.macroSampleFrame !== MersMacroSampleFrameType.HIGH_RISK_HEALTHCARE_WORKERS
    ) {
      setMacroSampleFrames(macroSampleFrameValuesWithoutRecalculatingTheHighRiskGroup);

      return;
    }

    macroSampleFramesToNotRecalculate = macroSampleFramesToNotRecalculate
      .filter((macroSampleFrame) => macroSampleFrame.macroSampleFrame !== MersMacroSampleFrameType.HIGH_RISK_POPULATIONS);

    recalculatedMacroSampleFrameValues = [
      ...recalculatedMacroSampleFrameValues,
      {
        macroSampleFrame: MersMacroSampleFrameType.HIGH_RISK_POPULATIONS,
        sampleFrames: uniq(macroSampleFrameValuesWithoutRecalculatingTheHighRiskGroup
          .filter(({ macroSampleFrame }) => (
            macroSampleFrame === MersMacroSampleFrameType.HIGH_RISK_OCCUPATIONALLY_EXPOSED_TO_DROMEDARY_CAMELS ||
            macroSampleFrame === MersMacroSampleFrameType.HIGH_RISK_OTHER ||
            macroSampleFrame === MersMacroSampleFrameType.HIGH_RISK_CLINICAL_MONITORING ||
            macroSampleFrame === MersMacroSampleFrameType.HIGH_RISK_HEALTHCARE_WORKERS
          ))
          .flatMap((macroSampleFrame) => macroSampleFrame.sampleFrames)
        )
      }
    ] 

    setMacroSampleFrames([
      ...macroSampleFramesToNotRecalculate,
      ...recalculatedMacroSampleFrameValues
    ]);

    return;
  }, [ setMacroSampleFrames, macroSampleFrames ])
  
  const getMacroSampleFramesForSampleFrame = useCallback((sampleFrame: string) => {
    return macroSampleFrames
      .map(({ macroSampleFrame, sampleFrames }) => ({
        macroSampleFrame,
        sampleFrames,
        included: sampleFrames.includes(sampleFrame)
      }))
      .filter(({ included }) => included === true)
      .sort((macroSampleFrameA, macroSampleFrameB) => (
        mersMacroSampleFramePriorityMap[macroSampleFrameA.macroSampleFrame] > mersMacroSampleFramePriorityMap[macroSampleFrameB.macroSampleFrame]
          ? 1
          : -1
      ))
      .map(({ macroSampleFrame }) => macroSampleFrame)
  }, [ macroSampleFrames ]);

  return (
    <MersMacroSampleFramesContext.Provider
      value={{
        macroSampleFrames,
        allHumanSampleFrames,
        adjustMacroSampleFrame,
        getMacroSampleFramesForSampleFrame
      }}
    >
      {props.children}
    </MersMacroSampleFramesContext.Provider>
  );
}