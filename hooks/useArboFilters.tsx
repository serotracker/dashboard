import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';

export const arbovirusFiltersQuery = gql`
  query arbovirusFilterOptions {
    arbovirusFilterOptions {
      ageGroup
      antibody
      assay
      country
      pathogen
      pediatricAgeGroup
      producer
      sampleFrame
      sex
      unRegion
      whoRegion
    }
  }
`

export function useArboFilters() {
  return useQuery<any>({
    queryKey: ["arbovirusFiltersQuery"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', arbovirusFiltersQuery)
  });
}
