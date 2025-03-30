import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { AllGroupedArbovirusEstimatePartitionKeysQueryQuery } from "@/gql/graphql";

export const allGroupedArbovirusEstimatePartitionKeysQuery = gql`
  query allGroupedArbovirusEstimatePartitionKeysQuery {
    allGroupedArbovirusEstimatePartitionKeys
  }
`

export function useAllGroupedArbovirusEstimatePartitionKeys() {
  return useQuery<AllGroupedArbovirusEstimatePartitionKeysQueryQuery>({
    queryKey: ["groupedArbovirusEstimatePartitionKeys"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', allGroupedArbovirusEstimatePartitionKeysQuery)
  });
}