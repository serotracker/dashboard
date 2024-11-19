import { useMersEstimatesFilterOptions } from "@/hooks/mers/useMersEstimatesFilters";
import { useMersPrimaryEstimates } from "@/hooks/mers/useMersPrimaryEstimates";
import uniq from "lodash/uniq";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export enum MersAssayClassification {
  SCREENING = 'SCREENING',
  CONFIRMATORY = 'CONFIRMATORY',
  NAAT_ASSAY = 'NAAT_ASSAY',
  UNCATEGORIZED = 'UNCATEGORIZED'
}

export const isMersAssayClassification = (value: string): value is MersAssayClassification => 
  Object.values(MersAssayClassification).some((element) => element === value);

export const mersAssayClassificationToTextMap = {
  [MersAssayClassification.UNCATEGORIZED]: 'Assay - Uncategorized',
  [MersAssayClassification.CONFIRMATORY]: 'Immunoassay - Confirmatory',
  [MersAssayClassification.NAAT_ASSAY]: 'NAAT Assay',
  [MersAssayClassification.SCREENING]: 'Immunoassay - Screening',
}

export const mersAssaySortOrderMap = {
  [MersAssayClassification.CONFIRMATORY]: 1,
  [MersAssayClassification.SCREENING]: 2,
  [MersAssayClassification.NAAT_ASSAY]: 3,
  [MersAssayClassification.UNCATEGORIZED]: 4
}

const mersAssayClassificationPriorityMap = {
  [MersAssayClassification.SCREENING]: 1,
  [MersAssayClassification.CONFIRMATORY]: 2,
  [MersAssayClassification.NAAT_ASSAY]: 3,
  [MersAssayClassification.UNCATEGORIZED]: 4
}

type AssayAdjustmentFunction = (input: {
  classification: MersAssayClassification.SCREENING | MersAssayClassification.CONFIRMATORY | MersAssayClassification.NAAT_ASSAY,
  assays: string[]
}) => void;

interface MersAssayClassificationContextType {
  allAssays: string[];
  assayClassifications: Array<{
    classification: MersAssayClassification;
    assays: string[];
  }>
  getAssayClassificationsForAssay: (assay: string) => MersAssayClassification[];
  adjustAssayClassification: AssayAdjustmentFunction;
}

const initialMersAssayClassificationContext: MersAssayClassificationContextType = {
  allAssays: [],
  assayClassifications: [],
  getAssayClassificationsForAssay: () => [],
  adjustAssayClassification: () => {}
};

export const MersAssayClassificationContext = createContext<
  MersAssayClassificationContextType
>(initialMersAssayClassificationContext);

interface MersAssayClassificationProviderProps {
  children: React.ReactNode;
}

export const MersAssayClassificationProvider = (props: MersAssayClassificationProviderProps) => {
  const [ assayClassifications, _setAssayClassifications ] = useState([{
    classification: MersAssayClassification.CONFIRMATORY,
    assays: ['PRNT', 'Pseudoparticle Neutralization', 'Virus Neutralization', 'Microneutralization']
  }, {
    classification: MersAssayClassification.SCREENING,
    assays: ['ELISA', 'Immunofluorescence', 'Protein microarray']
  }, {
    classification: MersAssayClassification.NAAT_ASSAY,
    assays: ['RT-LAMP', 'RT-PCR']
  }]);
  const [ allAssays, setAllAssays ] = useState<string[]>([]);

  const { data: primaryEstimates } = useMersPrimaryEstimates();

  const setAssayClassifications = useCallback((newArrayClassifications: typeof assayClassifications) => {
    _setAssayClassifications(newArrayClassifications
      .sort((classificationA, classificationB) => (
        mersAssaySortOrderMap[classificationA.classification] > mersAssaySortOrderMap[classificationB.classification]
          ? 1
          : -1
      ))
    )
  }, [ _setAssayClassifications ])

  useEffect(() => {
    if(!!primaryEstimates && primaryEstimates?.mersPrimaryEstimates.length > 0 && allAssays.length === 0) {
      const assayData = uniq(primaryEstimates.mersPrimaryEstimates
        .flatMap((primaryEstimate) => primaryEstimate.primaryEstimateInfo.assay)
      )

      setAllAssays(assayData);
    }
  }, [ allAssays, setAllAssays, primaryEstimates ]);

  const getAssayClassificationsForAssay = useCallback((assay: string) => {
    return assayClassifications
      .map(({ classification, assays }) => ({
        classification,
        assays,
        included: assays.includes(assay)
      }))
      .filter(({ included }) => included === true)
      .sort((classificationA, classificationB) => (
        mersAssayClassificationPriorityMap[classificationA.classification] > mersAssayClassificationPriorityMap[classificationB.classification]
          ? 1
          : -1
      ))
      .map(({ classification }) => classification)
  }, [ assayClassifications ]);

  const adjustAssayClassification: AssayAdjustmentFunction = useCallback(({ classification, assays }) => {
    setAssayClassifications([
      ...assayClassifications.filter((element) => element.classification !== classification),
      { classification, assays }
    ])
  }, [ assayClassifications, setAssayClassifications ]);

  return (
    <MersAssayClassificationContext.Provider
      value={{
        allAssays,
        assayClassifications,
        getAssayClassificationsForAssay,
        adjustAssayClassification
      }}
    >
      {props.children}
    </MersAssayClassificationContext.Provider>
  );
}