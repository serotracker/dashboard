"use client";
import { createContext, useEffect } from "react";
import { PathogenContextActionType, PathogenContextType, PathogenDataFetcherProps, PathogenProviders } from "../pathogen-context";
import { useArboData } from "@/hooks/useArboData";
import { useArboFilters } from "@/hooks/useArboFilters";

export type ArbovirusEstimate = any;

const initialArboContextState = {
  filteredData: [],
  selectedFilters: {
    ["pathogen"]: ["DENV", "ZIKV", "CHIKV", "YF", "WNV", "MAYV"],
  },
  dataFiltered: false,
}

export const ArboContext = createContext<PathogenContextType<ArbovirusEstimate>>({
  ...initialArboContextState,
  dispatch: (obj) => {
    console.debug("dispatch not initialized", obj);
  },
});

const ArboDataFetcher = (props: PathogenDataFetcherProps<ArbovirusEstimate>): React.ReactNode => {
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
      //getCountryData={() => useArboFilters().data?.arbovirusFilterOptions.countryIdentifiers.map(({
      //  name,
      //  alphaTwoCode,
      //  alphaThreeCode
      //}) => ({
      //  countryName: name,
      //  countryAlphaTwoCode: alphaTwoCode,
      //  countryAlphaThreeCode: alphaThreeCode
      //})) ?? []}
      getCountryData={() => []}
      context={ArboContext}
      mapId={'arboMap'}
      dataFetcher={ArboDataFetcher}
    />
  )
}