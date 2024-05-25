import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { ArbovirusFilterOptionsQuery } from "@/gql/graphql";

export const arbovirusFiltersQuery = gql`
  query arbovirusFilterOptions {
    arbovirusFilterOptions {
      ageGroup
      antibody
      assay
      pathogen
      pediatricAgeGroup
      producer
      sampleFrame
      serotype
      sex
      unRegion
      whoRegion
      countryIdentifiers {
        name
        alphaTwoCode
        alphaThreeCode
      }
    }
  }
`

export function useArboFilters() {
  return useQuery<ArbovirusFilterOptionsQuery>({
    queryKey: ["arbovirusFiltersQuery"],
    queryFn: () => request("https://iit-backend-v2-git-made-seroprevalence-manda-7826c9-serotracker.vercel.app/api/graphql" ?? '', arbovirusFiltersQuery)
  });
}
