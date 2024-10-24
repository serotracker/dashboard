import { Arbovirus } from "@/gql/graphql";
import { pipe } from "fp-ts/lib/function";
import { createContext, useContext, useMemo } from "react";
import { ArboContext } from "./arbo-context";
import uniq from "lodash/uniq";
import { filterArbovirusToSortOrderMap } from "@/components/customs/filters/available-filters";

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
  const { filteredData } = useContext(ArboContext);

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