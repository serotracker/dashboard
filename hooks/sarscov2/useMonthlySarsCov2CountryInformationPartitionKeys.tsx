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
    queryFn: () => request(process.env.NEXT_PUBLIC_PREVIEW_API_GRAPHQL_URL ?? '', monthlySarsCov2CountryInformationPartitionKeys)
  });
}