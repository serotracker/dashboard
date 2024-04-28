"use client";
import { createContext } from "react";
import { PathogenContextType, PathogenProviders } from "../pathogen-context";

const initialSarsCov2ContextState = {
  filteredData: [],
  selectedFilters: {},
  dataFiltered: false,
}

export const SarsCov2Context = createContext<PathogenContextType>({
  ...initialSarsCov2ContextState,
  dispatch: (obj) => {
    console.debug("dispatch not initialized", obj);
  },
});

interface SarsCov2ProvidersProps {
  children: React.ReactNode;
}

export const SarsCov2Providers = (props: SarsCov2ProvidersProps) => {
  return (
    <PathogenProviders
      children={props.children}
      initialState={initialSarsCov2ContextState}
      context={SarsCov2Context}
    />
  )
}