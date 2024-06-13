import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { AllFaoMersEventPartitionKeysQuery } from "@/gql/graphql";

export const faoMersEventPartitionKeys = gql`
  query allFaoMersEventPartitionKeys {
    allFaoMersEventPartitionKeys
  }
`

export function useFaoMersEventDataPartitionKeys() {
  return useQuery<AllFaoMersEventPartitionKeysQuery>({
    queryKey: ["faoMersEventPartitionKeys"],
    queryFn: () => request(process.env.NEXT_PUBLIC_PREVIEW_API_GRAPHQL_URL ?? '', faoMersEventPartitionKeys)
  });
} 