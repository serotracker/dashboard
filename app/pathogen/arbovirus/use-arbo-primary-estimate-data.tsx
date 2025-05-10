import { ArboContext } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { ArbovirusGroupingVariable } from "@/gql/graphql";
import { useContext, useMemo } from "react";

export const useGroupedArbovirusEstimateData = () => {
  const state = useContext(ArboContext);

  const ageGroupEstimateData = useMemo(() => {
    return {
      ...state,
      filteredData: state.filteredData.filter((estimate) => estimate.groupingVariable === ArbovirusGroupingVariable.Age),
    }
  }, [ state ]);

  const primaryEstimateData = useMemo(() => {
    return {
      ...state,
      filteredData: state.filteredData.filter((estimate) => estimate.isPrimaryEstimate),
    }
  }, [ state ]);

  return {
    ageGroupEstimateData,
    primaryEstimateData,
  }
}