"use client";
import { createContext, useEffect, useMemo } from "react";
import { pipe } from "fp-ts/lib/function";
import { PathogenContextActionType, PathogenContextState, PathogenContextType, PathogenDataFetcherProps, PathogenProviders } from "../../pathogen-context";
import { CountryDataContext } from "../../country-information-context";
import { useMersFilters } from "@/hooks/mers/useMersFilters";
import { FaoMersEvent } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { useFaoMersEventData } from "@/hooks/mers/useFaoMersEventData";
import { CamelPopulationDataProvider } from "./camel-population-data-context";
import { filterData } from "../../filter-update-steps/apply-new-selected-filters";
import { addActionToSelectedFilters } from "../../filter-update-steps/add-action-to-selected-filters";
import { adjustMapPosition } from "../../filter-update-steps/adjust-map-position";
import { useMersPrimaryEstimates } from "@/hooks/mers/useMersPrimaryEstimates";
import { MersPrimaryEstimatesQuery } from "@/gql/graphql";
import { filterMersEstimates } from "./mers-data-filtering";

const initialMersContextState = {
  filteredData: [],
  faoMersEventData: [],
  selectedFilters: {
    ["__typename"]: [
      "PrimaryHumanMersSeroprevalenceEstimateInformation",
      "PrimaryHumanMersViralEstimateInformation",
      "PrimaryAnimalMersSeroprevalenceEstimateInformation",
      "PrimaryAnimalMersViralEstimateInformation",
      "AnimalMersEvent",
      "HumanMersEvent"
    ],
  },
  dataFiltered: false,
}

export type MersSubEstimateInformation = MersEstimate['ageGroupSubestimates'][number]['estimateInfo'];
export type MersViralSubEstimateInformation = Extract<MersSubEstimateInformation, {__typename: 'MersViralSubEstimateInformation'}>;
export type MersSeroprevalenceSubEstimateInformation = Extract<MersSubEstimateInformation, {__typename: 'MersSeroprevalenceSubEstimateInformation'}>;
export type MersAgeGroupSubEstimate = MersEstimate['ageGroupSubestimates'][number];
export type HumanMersAgeGroupSubEstimate = Extract<MersEstimate['ageGroupSubestimates'][number], {__typename: 'HumanMersAgeGroupSubEstimate'}>;
export type AnimalMersAgeGroupSubEstimate = Extract<MersEstimate['ageGroupSubestimates'][number], {__typename: 'AnimalMersAgeGroupSubEstimate'}>;

export const isHumanMersAgeGroupSubEstimate = (subestimate: MersAgeGroupSubEstimate): subestimate is HumanMersAgeGroupSubEstimate =>
  subestimate.__typename === 'HumanMersAgeGroupSubEstimate';

export const isAnimalMersAgeGroupSubEstimate = (subestimate: MersAgeGroupSubEstimate): subestimate is AnimalMersAgeGroupSubEstimate =>
  subestimate.__typename === 'AnimalMersAgeGroupSubEstimate';

export const isMersViralSubEstimateInformation = (subestimateInformation: MersSubEstimateInformation): subestimateInformation is MersViralSubEstimateInformation =>
  subestimateInformation.__typename === 'MersViralSubEstimateInformation';

export const isMersSeroprevalenceSubEstimateInformation = (subestimateInformation: MersSubEstimateInformation): subestimateInformation is MersSeroprevalenceSubEstimateInformation =>
  subestimateInformation.__typename === 'MersSeroprevalenceSubEstimateInformation';

type MersSeroprevalenceEstimateWithAdditionalFields = Omit<
  MersPrimaryEstimatesQuery['mersPrimaryEstimates'][number],
  'sexSubestimates'
> & {
  sexSubestimates: Array<MersPrimaryEstimatesQuery['mersPrimaryEstimates'][number]['sexSubestimates'][number] & {
    markedAsFiltered: boolean;
  }>
}

export type HumanMersSeroprevalenceEstimate = Omit<MersSeroprevalenceEstimateWithAdditionalFields, 'primaryEstimateInfo'> & {
  primaryEstimateInfo: Extract<MersSeroprevalenceEstimateWithAdditionalFields['primaryEstimateInfo'], { __typename: 'PrimaryHumanMersSeroprevalenceEstimateInformation'}>
};
export type AnimalMersSeroprevalenceEstimate = Omit<MersSeroprevalenceEstimateWithAdditionalFields, 'primaryEstimateInfo'> & {
  primaryEstimateInfo: Extract<MersSeroprevalenceEstimateWithAdditionalFields['primaryEstimateInfo'], { __typename: 'PrimaryAnimalMersSeroprevalenceEstimateInformation'}>
}
export type AnimalMersViralEstimate = Omit<MersSeroprevalenceEstimateWithAdditionalFields, 'primaryEstimateInfo'> & {
  primaryEstimateInfo: Extract<MersSeroprevalenceEstimateWithAdditionalFields['primaryEstimateInfo'], { __typename: 'PrimaryAnimalMersViralEstimateInformation'}>
}
export type HumanMersViralEstimate = Omit<MersSeroprevalenceEstimateWithAdditionalFields, 'primaryEstimateInfo'> & {
  primaryEstimateInfo: Extract<MersSeroprevalenceEstimateWithAdditionalFields['primaryEstimateInfo'], { __typename: 'PrimaryHumanMersViralEstimateInformation'}>
}
export const isHumanMersSeroprevalenceEstimate = (estimate: MersEstimate): estimate is HumanMersSeroprevalenceEstimate =>
  estimate.primaryEstimateInfo.__typename === 'PrimaryHumanMersSeroprevalenceEstimateInformation';
export const isAnimalMersSeroprevalenceEstimate = (estimate: MersEstimate): estimate is AnimalMersSeroprevalenceEstimate =>
  estimate.primaryEstimateInfo.__typename === 'PrimaryAnimalMersSeroprevalenceEstimateInformation';
export const isAnimalMersViralEstimate = (estimate: MersEstimate): estimate is AnimalMersViralEstimate =>
  estimate.primaryEstimateInfo.__typename === 'PrimaryAnimalMersViralEstimateInformation';
export const isHumanMersViralEstimate = (estimate: MersEstimate): estimate is HumanMersViralEstimate =>
  estimate.primaryEstimateInfo.__typename === 'PrimaryHumanMersViralEstimateInformation';

export const isMersSeroprevalenceEstimate = (estimate: MersEstimate): estimate is MersSeroprevalenceEstimate =>
  isHumanMersSeroprevalenceEstimate(estimate) || isAnimalMersSeroprevalenceEstimate(estimate);

export const isHumanMersEstimate = (estimate: MersEstimate): estimate is HumanMersEstimate =>
  isHumanMersSeroprevalenceEstimate(estimate) || isHumanMersViralEstimate(estimate);

export const isAnimalMersEstimate = (estimate: MersEstimate): estimate is AnimalMersEstimate =>
  isAnimalMersSeroprevalenceEstimate(estimate) || isAnimalMersViralEstimate(estimate);

export const isMersViralEstimate = (estimate: MersEstimate): estimate is MersViralEstimate =>
  isAnimalMersViralEstimate(estimate) || isHumanMersViralEstimate(estimate);

export type MersSeroprevalenceEstimate =
  | HumanMersSeroprevalenceEstimate
  | AnimalMersSeroprevalenceEstimate;
export type MersViralEstimate = 
  | HumanMersViralEstimate
  | AnimalMersViralEstimate;
export type HumanMersEstimate =
  | HumanMersSeroprevalenceEstimate
  | HumanMersViralEstimate;
export type AnimalMersEstimate =
  | AnimalMersSeroprevalenceEstimate
  | AnimalMersViralEstimate;

export type MersEstimate = 
  | MersSeroprevalenceEstimate
  | MersViralEstimate;

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
  const { data } = useMersPrimaryEstimates();
  const { faoMersEvents } = useFaoMersEventData()

  useEffect(() => {
    if (
      !!data
      && !!faoMersEvents
      && props.state.filteredData.length === 0
      && !props.state.dataFiltered
    ) {
      props.dispatch({
        type: PathogenContextActionType.INITIAL_DATA_FETCH,
        payload: {
          data: {
            mersEstimates: data.mersPrimaryEstimates.map((primaryEstimate) => ({
              ...primaryEstimate,
              sexSubestimates: primaryEstimate.sexSubestimates.map((subestimate) => ({
                ...subestimate,
                markedAsFiltered: false
              }))
            })),
            faoMersEventData: faoMersEvents
          }
        }
      });
    }
  }, [data, faoMersEvents]);

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
      initialState={initialMersContextState}
      countryDataProvider={CountryDataProvider}
      context={MersContext}
      mapId={"mersMap"}
      filterUpdateHandlerOverride={(filterUpdateData) => pipe(
        filterUpdateData,
        addActionToSelectedFilters,
        adjustMapPosition,
        ((filterUpdateData) => ({
          ...filterUpdateData,
          state: {
            ...filterUpdateData.state,
            filteredData: filterMersEstimates({
              mersEstimates: filterUpdateData.action.payload.data.mersEstimates,
              selectedFilters: filterUpdateData.state.selectedFilters
            }).filteredMersEstimates,
            faoMersEventData: filterData(
              filterUpdateData.action.payload.data.faoMersEventData.map((event: any) => ({
                ...event,
                countryAlphaTwoCode: event.country.alphaTwoCode,
                countryAlphaThreeCode: event.country.alphaThreeCode,
              })),
              filterUpdateData.state.selectedFilters
            ),
            dataFiltered: true,
          },
        }))
      ).state}
      initialDataFetchHandlerOverride={({ state, action, initialState }) => ({
        ...state,
        filteredData: action.payload.data.mersEstimates,
        faoMersEventData: action.payload.data.faoMersEventData,
        selectedFilters: initialState.selectedFilters,
        dataFiltered: false,
      })}
      filterResetHandlerOverride={({ state, action }) => ({
        ...state,
        filteredData: filterMersEstimates({
          mersEstimates: action.payload.data.mersEstimates,
          selectedFilters: initialMersContextState.selectedFilters
        }).filteredMersEstimates,
        faoMersEventData: filterData(
          action.payload.data.faoMersEventData,
          initialMersContextState.selectedFilters
        ),
        selectedFilters: initialMersContextState.selectedFilters,
        dataFiltered: false,
      })}
      dataFetcher={MersDataFetcher}
    >
      <CamelPopulationDataProvider>
        {props.children}
      </CamelPopulationDataProvider>
    </PathogenProviders>
  )
}