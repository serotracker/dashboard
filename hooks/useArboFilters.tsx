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
      producer
      sampleFrame
      sex
      whoRegion
    }
  }
`

export function useArboFilters() {
  return useQuery<any>({
    queryKey: ["arbovirusFiltersQuery"],
    queryFn: () => request(process.env.ARBO_API_URL ?? '', arbovirusFiltersQuery)
  });
}
