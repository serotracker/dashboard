import { Arbovirus } from "@/gql/graphql";
import { createContext, useContext, useMemo } from "react";
import uniq from "lodash/uniq";
import { filterArbovirusToSortOrderMap } from "@/components/customs/filters/available-filters";
import { useGroupedArbovirusEstimateData } from "@/app/pathogen/arbovirus/use-arbo-primary-estimate-data";

export interface ArbovirusAvailablePathogensContextType {
  availablePathogens: Arbovirus[];
}

const initialArbovirusAvailablePathogensContext = {
  availablePathogens: [],
};

export const ArbovirusAvailablePathogensContext = createContext<
  ArbovirusAvailablePathogensContextType
>(initialArbovirusAvailablePathogensContext);

interface ArbovirusAvailablePathogensProviderProps {
  children: React.ReactNode;
}

export const ArbovirusAvailablePathogensProvider = (props: ArbovirusAvailablePathogensProviderProps) => {
  const { filteredData } = useGroupedArbovirusEstimateData().primaryEstimateData;

  const availablePathogens = useMemo(() => {
    return uniq(filteredData.map((dataPoint) => dataPoint.pathogen))
      .sort((pathogenA, pathogenB) => filterArbovirusToSortOrderMap[pathogenA] - filterArbovirusToSortOrderMap[pathogenB])
  }, [ filteredData ]);

  return (
    <ArbovirusAvailablePathogensContext.Provider
      value={{
        availablePathogens
      }}
    >
      {props.children}
    </ArbovirusAvailablePathogensContext.Provider>
  );
}