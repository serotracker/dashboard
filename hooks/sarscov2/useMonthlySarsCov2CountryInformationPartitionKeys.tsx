import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { AllMonthlySarsCov2CountryInformationPartitionKeysQuery } from "@/gql/graphql";

export const monthlySarsCov2CountryInformationPartitionKeys = gql`
  query allMonthlySarsCov2CountryInformationPartitionKeys {
    allMonthlySarsCov2CountryInformationPartitionKeys
  }
`

export function useMonthlySarsCov2CountryInformationPartitionKeys() {
  return useQuery<AllMonthlySarsCov2CountryInformationPartitionKeysQuery>({
    queryKey: ["monthlySarsCov2CountryInformationPartitionKeys"],
    queryFn: () => request('https://iit-backend-v2-git-issue-370-add-partitioned-aad1f1-serotracker.vercel.app/api/graphql' ?? '', monthlySarsCov2CountryInformationPartitionKeys)
  });
}