import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { AllUnravelledGroupedArbovirusEstimatePartitionKeysQuery } from "@/gql/graphql";

export const allUnravelledGroupedArbovirusEstimatePartitionKeys = gql`
  query allUnravelledGroupedArbovirusEstimatePartitionKeys {
    allUnravelledGroupedArbovirusEstimatePartitionKeys
  }
`

export function useAllUnravelledGroupedArbovirusEstimatePartitionKeys() {
  return useQuery<AllUnravelledGroupedArbovirusEstimatePartitionKeysQuery>({
    queryKey: ["allUnravelledGroupedArbovirusEstimatePartitionKeys"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', allUnravelledGroupedArbovirusEstimatePartitionKeys)
  });
}