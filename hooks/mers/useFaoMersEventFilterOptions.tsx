import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { FaoMersEventFilterOptionsQuery } from "@/gql/graphql";

export const faoMersEventFilterOptions = gql`
  query faoMersEventFilterOptions {
    faoMersEventFilterOptions {
      diagnosisSource
      animalType
      animalSpeciesV2
    }
  }
`

export function useFaoMersEventFilterOptions() {
  return useQuery<FaoMersEventFilterOptionsQuery>({
    queryKey: ["faoMersEventFilterOptions"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', faoMersEventFilterOptions)
  });
} 