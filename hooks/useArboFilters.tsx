import { gql, useQuery } from "@apollo/client";

const arbovirusFiltersQuery = gql`
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
  return useQuery(arbovirusFiltersQuery, {ssr: true});
}
