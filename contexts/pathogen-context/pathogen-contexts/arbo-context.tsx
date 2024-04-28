"use client";
import { createContext } from "react";
import { PathogenContextType, PathogenProviders } from "../pathogen-context";

const initialArboContextState = {
  filteredData: [],
  selectedFilters: {
    ["pathogen"]: ["DENV", "ZIKV", "CHIKV", "YF", "WNV", "MAYV"],
  },
  dataFiltered: false,
}

export const ArboContext = createContext<PathogenContextType>({
  ...initialArboContextState,
  dispatch: (obj) => {
    console.debug("dispatch not initialized", obj);
  },
});

interface ArboProvidersProps {
  children: React.ReactNode;
}

export const ArboProviders = (props: ArboProvidersProps) => {
  return (
    <PathogenProviders
      children={props.children}
      initialState={initialArboContextState}
      context={ArboContext}
    />
  )
}