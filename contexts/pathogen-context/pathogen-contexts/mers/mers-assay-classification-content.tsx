import { useMersEstimatesFilterOptions } from "@/hooks/mers/useMersEstimatesFilters";
import { createContext, useCallback, useMemo, useState } from "react";

export enum MersAssayClassification {
  SCREENING = 'SCREENING',
  CONFIRMATORY = 'CONFIRMATORY',
  UNCATEGORIZED = 'UNCATEGORIZED'
}

export const isMersAssayClassification = (value: string): value is MersAssayClassification => 
  Object.values(MersAssayClassification).some((element) => element === value);

export const mersAssayClassificationToTextMap = {
  [MersAssayClassification.UNCATEGORIZED]: 'Uncategorized',
  [MersAssayClassification.CONFIRMATORY]: 'Confirmatory',
  [MersAssayClassification.SCREENING]: 'Screening',
}

const mersAssayClassificationPriorityMap = {
  [MersAssayClassification.SCREENING]: 1,
  [MersAssayClassification.CONFIRMATORY]: 2,
  [MersAssayClassification.UNCATEGORIZED]: 3
}

interface MersAssayClassificationContextType {
  assayClassifications: Array<{
    classification: MersAssayClassification;
    assays: string[];
  }>
  getAssayClassificationsForAssay: (assay: string) => MersAssayClassification[];
}

const initialMersAssayClassificationContext: MersAssayClassificationContextType = {
  assayClassifications: [],
  getAssayClassificationsForAssay: () => []
};

export const MersAssayClassificationContext = createContext<
  MersAssayClassificationContextType
>(initialMersAssayClassificationContext);

interface MersAssayClassificationProviderProps {
  children: React.ReactNode;
}

export const MersAssayClassificationProvider = (props: MersAssayClassificationProviderProps) => {
  const [ assayClassifications, setAssayClassifications ] = useState([{
    classification: MersAssayClassification.SCREENING,
    assays: ['ELISA', 'Immunofluorescence', 'Protein microarray']
  }, {
    classification: MersAssayClassification.CONFIRMATORY,
    assays: ['PRNT', 'Pseudoparticle Neutralization', 'Virus Neutralization', 'Microneutralization']
  }]);

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

  return (
    <MersAssayClassificationContext.Provider
      value={{
        assayClassifications,
        getAssayClassificationsForAssay
      }}
    >
      {props.children}
    </MersAssayClassificationContext.Provider>
  );
}