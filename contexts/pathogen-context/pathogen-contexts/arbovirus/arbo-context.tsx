"use client";
import { createContext, useEffect, useMemo } from "react";
import { PathogenContextActionType, PathogenContextState, PathogenContextType, PathogenDataFetcherProps, PathogenProviders } from "../../pathogen-context";
import { useArboData } from "@/hooks/arbovirus/useArboData";
import { useArboFilters } from "@/hooks/arbovirus/useArboFilters";
import { CountryDataContext } from "../../country-information-context";
import { ArbovirusEstimatesQueryQuery } from "@/gql/graphql";

export type ArbovirusEstimate = ArbovirusEstimatesQueryQuery['arbovirusEstimates'][number];

const initialArboContextState = {
  filteredData: [],
  selectedFilters: {
    ["pathogen"]: ["DENV", "ZIKV", "CHIKV", "YF", "WNV", "MAYV"],
  },
  dataFiltered: false,
}

type ArbovirusContextState = PathogenContextState<ArbovirusEstimate>;
type ArbovirusContextType = PathogenContextType<ArbovirusEstimate, ArbovirusContextState>;

export const ArboContext = createContext<ArbovirusContextType>({
  ...initialArboContextState,
  dispatch: (obj) => {
    console.debug("dispatch not initialized", obj);
  },
});

const ArboDataFetcher = (props: PathogenDataFetcherProps<ArbovirusEstimate, ArbovirusContextState>): React.ReactNode => {
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

const CountryDataProvider = (props: {children: React.ReactNode}) => {
  const { data: filterData } = useArboFilters();
  const value = useMemo(() =>
    filterData?.arbovirusFilterOptions.countryIdentifiers.map(({
      name,
      alphaTwoCode,
      alphaThreeCode
    }) => ({
      countryName: name,
      countryAlphaTwoCode: alphaTwoCode,
      countryAlphaThreeCode: alphaThreeCode
    })) ?? []
  , [filterData])

  return (
    <CountryDataContext.Provider value={value}>
      {props.children}
    </CountryDataContext.Provider>
  )
}

interface ArboProvidersProps {
  children: React.ReactNode;
}

export const ArboProviders = (props: ArboProvidersProps) => {
  return (
    <PathogenProviders
      initialState={initialArboContextState}
      countryDataProvider={CountryDataProvider}
      context={ArboContext}
      mapId={'arboMap'}
      dataFetcher={ArboDataFetcher}
    >
      {props.children}
    </PathogenProviders>
  )
}