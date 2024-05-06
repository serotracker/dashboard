"use client";
import { createContext, useEffect } from "react";
import { PathogenContextActionType, PathogenContextType, PathogenDataFetcherProps, PathogenProviders } from "../pathogen-context";
import { useNewSarsCov2Data } from "@/hooks/useNewSarsCov2Data";
import { SarsCov2EstimatesQuery } from "@/gql/graphql";

const initialSarsCov2ContextState = {
  filteredData: [],
  selectedFilters: {},
  dataFiltered: false,
}

export type SarsCov2Estimate = SarsCov2EstimatesQuery['sarsCov2Estimates'][number];

export const SarsCov2Context = createContext<PathogenContextType<SarsCov2Estimate>>({
  ...initialSarsCov2ContextState,
  dispatch: (obj) => {
    console.debug("dispatch not initialized", obj);
  },
});

const SarsCov2DataFetcher = (props: PathogenDataFetcherProps<SarsCov2Estimate>): React.ReactNode => {
  const { data } = useNewSarsCov2Data();

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

interface SarsCov2ProvidersProps {
  children: React.ReactNode;
}

export const SarsCov2Providers = (props: SarsCov2ProvidersProps) => {
  return (
    <PathogenProviders
      children={props.children}
      initialState={initialSarsCov2ContextState}
      context={SarsCov2Context}
      mapId={"sarsCov2Map"}
      dataFetcher={SarsCov2DataFetcher}
    />
  )
}