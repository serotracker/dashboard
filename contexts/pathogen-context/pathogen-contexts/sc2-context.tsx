"use client";
import { createContext, useEffect, useMemo } from "react";
import { PathogenContextActionType, PathogenContextState, PathogenContextType, PathogenDataFetcherProps, PathogenProviders } from "../pathogen-context";
import { useSarsCov2Data } from "@/hooks/useSarsCov2Data";
import { SarsCov2EstimatesQuery } from "@/gql/graphql";
import { useSarsCov2Filters } from "@/hooks/useSarsCov2Filters";
import { CountryDataContext } from "../country-information-context";

const initialSarsCov2ContextState = {
  filteredData: [],
  selectedFilters: {
    ["scope"]: ["National", "Regional", "Local"],
  },
  dataFiltered: false,
}

export type SarsCov2Estimate = SarsCov2EstimatesQuery['sarsCov2Estimates'][number];
type SarsCov2ContextState = PathogenContextState<SarsCov2Estimate>;
type SarsCov2ContextType = PathogenContextType<SarsCov2Estimate, SarsCov2ContextState>;

export const SarsCov2Context = createContext<SarsCov2ContextType>({
  ...initialSarsCov2ContextState,
  dispatch: (obj) => {
    console.debug("dispatch not initialized", obj);
  },
});

const SarsCov2DataFetcher = (props: PathogenDataFetcherProps<SarsCov2Estimate, SarsCov2ContextState>): React.ReactNode => {
  const { data } = useSarsCov2Data();

  useEffect(() => {
    if (!!data && props.state.filteredData.length === 0 && !props.state.dataFiltered) {
      props.dispatch({
        type: PathogenContextActionType.INITIAL_DATA_FETCH,
        payload: { data: data.sarsCov2Estimates },
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
  const { data: filterData } = useSarsCov2Filters();
  const value = useMemo(() =>
    filterData?.sarsCov2FilterOptions.countryIdentifiers.map(({
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

interface SarsCov2ProvidersProps {
  children: React.ReactNode;
}

export const SarsCov2Providers = (props: SarsCov2ProvidersProps) => {
  return (
    <PathogenProviders
      children={props.children}
      initialState={initialSarsCov2ContextState}
      countryDataProvider={CountryDataProvider}
      context={SarsCov2Context}
      mapId={"sarsCov2Map"}
      dataFetcher={SarsCov2DataFetcher}
    />
  )
}