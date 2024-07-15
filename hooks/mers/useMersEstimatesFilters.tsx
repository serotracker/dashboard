import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { MersEstimatesFilterOptionsQuery } from "@/gql/graphql";

export const mersEstimatesFilterOptions = gql`
  query mersEstimatesFilterOptions {
    mersEstimatesFilterOptions {
      sourceType
    }
  }
`

export function useMersEstimatesFilterOptions() {
  return useQuery<MersEstimatesFilterOptionsQuery>({
    queryKey: ["mersEstimatesFilterOptions"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', mersEstimatesFilterOptions)
  });
} 