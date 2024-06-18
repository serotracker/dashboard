import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { YearlyFaoCamelPopulationDataPartitionKeysQuery } from "@/gql/graphql";

export const faoCamelPopulationDataPartitionKeys = gql`
  query yearlyFaoCamelPopulationDataPartitionKeys {
    yearlyFaoCamelPopulationDataPartitionKeys
  }
`

export function useFaoYearlyCamelPopulationDataPartitionKeys() {
  return useQuery<YearlyFaoCamelPopulationDataPartitionKeysQuery>({
    queryKey: ["faoCamelPopulationDataPartitionKeys"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', faoCamelPopulationDataPartitionKeys)
  });
} 