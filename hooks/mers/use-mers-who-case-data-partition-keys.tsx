import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { MersWhoCaseDataPartitionKeysQuery } from "@/gql/graphql";

export const mersWhoCaseDataPartitionKeys = gql`
  query mersWhoCaseDataPartitionKeys {
    mersWhoCaseDataPartitionKeys
  }
`

export function useMersWhoCaseDataPartitionKeys() {
  return useQuery<MersWhoCaseDataPartitionKeysQuery>({
    queryKey: ["mersWhoCaseDataPartitionKeys"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', mersWhoCaseDataPartitionKeys)
  });
} 