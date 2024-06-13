"use client";
import { createContext, useEffect, useMemo } from "react";
import { PathogenContextActionType, PathogenContextState, PathogenContextType, PathogenDataFetcherProps, PathogenProviders } from "../../pathogen-context";
import { MersEstimatesQuery } from "@/gql/graphql";
import { CountryDataContext } from "../../country-information-context";
import { useMersData } from "@/hooks/mers/useMersData";
import { useMersFilters } from "@/hooks/mers/useMersFilters";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";

const initialMersContextState = {
  filteredData: [],
  faoMersEventData: [],
  selectedFilters: {},
  dataFiltered: false,
}

export type MersEstimate = MersEstimatesQuery['mersEstimates'][number];
type MersContextState = PathogenContextState<MersEstimate> & {
  faoMersEventData: FaoMersEvent[];
};
type MersContextType = PathogenContextType<MersEstimate, MersContextState>;

export const MersContext = createContext<MersContextType>({
  ...initialMersContextState,
  dispatch: (obj) => {
    console.debug("dispatch not initialized", obj);
  },
});

const MersDataFetcher = (props: PathogenDataFetcherProps<MersEstimate, MersContextState>): React.ReactNode => {
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