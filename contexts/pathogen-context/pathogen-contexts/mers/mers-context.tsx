"use client";
import { createContext, useEffect, useMemo } from "react";
import { PathogenContextActionType, PathogenContextType, PathogenDataFetcherProps, PathogenProviders } from "../../pathogen-context";
import { useSarsCov2Data } from "@/hooks/useSarsCov2Data";
import { MersEstimatesQuery } from "@/gql/graphql";
import { useSarsCov2Filters } from "@/hooks/useSarsCov2Filters";
import { CountryDataContext } from "../../country-information-context";
import { useMersData } from "@/hooks/mers/useMersData";
import { useMersFilters } from "@/hooks/mers/useMersFilters";

const initialMersContextState = {
  filteredData: [],
  selectedFilters: {},
  dataFiltered: false,
}

export type MersEstimate = MersEstimatesQuery['mersEstimates'][number];

export const MersContext = createContext<PathogenContextType<MersEstimate>>({
  ...initialMersContextState,
  dispatch: (obj) => {
    console.debug("dispatch not initialized", obj);
  },
});

const MersDataFetcher = (props: PathogenDataFetcherProps<MersEstimate>): React.ReactNode => {
  const { data } = useMersData();

  useEffect(() => {
    if (!!data && props.state.filteredData.length === 0 && !props.state.dataFiltered) {
      props.dispatch({
        type: PathogenContextActionType.INITIAL_DATA_FETCH,
        payload: { data: data.mersEstimates },
      });
    }
  }, [data]);

  return (
    <>
      {props.children}
    </>
  )
}

const CountryDataProvider = (props: {children: React.ReactNode}) => {
  const { data: filterData } = useMersFilters();
  const value = useMemo(() =>
    filterData?.mersFilterOptions.countryIdentifiers.map(({
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

interface MersProvidersProps {
  children: React.ReactNode;
}

export const MersProviders = (props: MersProvidersProps) => {
  return (
    <PathogenProviders
      children={props.children}
      initialState={initialMersContextState}
      countryDataProvider={CountryDataProvider}
      context={MersContext}
      mapId={"mersMap"}
      dataFetcher={MersDataFetcher}
    />
  )
}