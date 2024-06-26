"use client";
import { createContext, useEffect, useMemo } from "react";
import { PartitionedSarsCov2EstimatesQuery } from "@/gql/graphql";
import { useSarsCov2Filters } from "@/hooks/sarscov2/useSarsCov2Filters";
import { CountryDataContext } from "../../country-information-context";
import { MonthlySarsCov2CountryInformationProvider } from "./monthly-sarscov2-country-information-context";
import { ModelledSarsCov2SeroprevalenceProvider } from "./modelled-sarscov2-seroprevalence-context";
import { useSarsCov2Data } from "@/hooks/sarscov2/use-sars-cov2-data";
import { PathogenContextActionType, PathogenContextState, PathogenContextType, PathogenDataFetcherProps, PathogenProviders } from "../../pathogen-context";

const initialSarsCov2ContextState = {
  filteredData: [],
  selectedFilters: {
    ["scope"]: ["National", "Regional", "Local"],
  },
  dataFiltered: false,
}

export type SarsCov2Estimate = PartitionedSarsCov2EstimatesQuery['partitionedSarsCov2Estimates']['sarsCov2Estimates'][number]
type SarsCov2ContextState = PathogenContextState<SarsCov2Estimate>;
type SarsCov2ContextType = PathogenContextType<SarsCov2Estimate, SarsCov2ContextState>;

export const SarsCov2Context = createContext<SarsCov2ContextType>({
  ...initialSarsCov2ContextState,
  dispatch: (obj) => {
    console.debug("dispatch not initialized", obj);
  },
});

const SarsCov2DataFetcher = (props: PathogenDataFetcherProps<SarsCov2Estimate, SarsCov2ContextState>): React.ReactNode => {
  const { sarsCov2Estimates } = useSarsCov2Data();

  useEffect(() => {
    if (
      !!sarsCov2Estimates
      && props.state.filteredData.length === 0
      && !props.state.dataFiltered
    ) {
      props.dispatch({
        type: PathogenContextActionType.INITIAL_DATA_FETCH,
        payload: { data: sarsCov2Estimates },
      });
    }
  }, [sarsCov2Estimates]);

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
      initialState={initialSarsCov2ContextState}
      countryDataProvider={CountryDataProvider}
      context={SarsCov2Context}
      mapId={"sarsCov2Map"}
      dataFetcher={SarsCov2DataFetcher}
    >
      <ModelledSarsCov2SeroprevalenceProvider>
        <MonthlySarsCov2CountryInformationProvider>
          {props.children}
        </MonthlySarsCov2CountryInformationProvider>
      </ModelledSarsCov2SeroprevalenceProvider>
    </PathogenProviders>
  )
}