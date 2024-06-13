import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { MersFilterOptionsQuery } from "@/gql/graphql";

export const mersFilters = gql`
  query mersFilterOptions {
    mersFilterOptions {
      countryIdentifiers {
        name
        alphaTwoCode
        alphaThreeCode
      }
      whoRegion
    }
  }
`

export function useMersFilters() {
  return useQuery<MersFilterOptionsQuery>({
    queryKey: ["mersFilterOptions"],
    queryFn: () => request(process.env.NEXT_PUBLIC_PREVIEW_API_GRAPHQL_URL ?? '', mersFilters)
  });
}
