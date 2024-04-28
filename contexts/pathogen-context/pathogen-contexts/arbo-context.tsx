"use client";
import { createContext, useEffect } from "react";
import { PathogenContextActionType, PathogenContextType, PathogenDataFetcherProps, PathogenProviders } from "../pathogen-context";
import { useArboData } from "@/hooks/useArboData";

const initialArboContextState = {
  filteredData: [],
  selectedFilters: {
    ["pathogen"]: ["DENV", "ZIKV", "CHIKV", "YF", "WNV", "MAYV"],
  },
  dataFiltered: false,
}

export const ArboContext = createContext<PathogenContextType<any>>({
  ...initialArboContextState,
  dispatch: (obj) => {
    console.debug("dispatch not initialized", obj);
  },
});

const ArboDataFetcher = (props: PathogenDataFetcherProps<any>): React.ReactNode => {
  const dataQuery = useArboData();

  useEffect(() => {
    if (
      props.state.filteredData.length === 0 &&
      !props.state.dataFiltered &&
      "data" in dataQuery &&
      !!dataQuery.data &&
      typeof dataQuery.data === "object" &&
      "arbovirusEstimates" in dataQuery.data &&
      Array.isArray(dataQuery.data.arbovirusEstimates) &&
      dataQuery.data.arbovirusEstimates.length > 0
    ) {
      props.dispatch({
        type: PathogenContextActionType.INITIAL_DATA_FETCH,
        payload: { data: dataQuery.data.arbovirusEstimates },
      });
    }
  }, [dataQuery]);

  return (
    <>
      {props.children}
    </>
  )
}

interface ArboProvidersProps {
  children: React.ReactNode;
}

export const ArboProviders = (props: ArboProvidersProps) => {
  return (
    <PathogenProviders
      children={props.children}
      initialState={initialArboContextState}
      context={ArboContext}
      mapId={'arboMap'}
      dataFetcher={ArboDataFetcher}
    />
  )
}