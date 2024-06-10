import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { AllSarsCov2EstimatePartitionKeysQuery } from "@/gql/graphql";

export const sarsCov2EstimatesPartitionKeys = gql`
  query allSarsCov2EstimatePartitionKeys {
    allSarsCov2EstimatePartitionKeys
  }
`

export function useSarsCov2DataPartitionKeys() {
  return useQuery<AllSarsCov2EstimatePartitionKeysQuery>({
    queryKey: ["sarsCov2DataPartitionKeys"],
    queryFn: () => request('https://iit-backend-v2-git-issue-370-add-partitioned-aad1f1-serotracker.vercel.app/api/graphql' ?? '', sarsCov2EstimatesPartitionKeys)
  });
}