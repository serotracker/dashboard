import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { MersEstimates_V2Query } from "@/gql/graphql";

export const mersEstimates_V2 = gql`
  query mersEstimates_V2 {
    mersEstimates_V2 {
      ... on HumanMersEstimate {
        __typename
        id
        type
        seroprevalence
        estimateId
        city
        state
        country
        countryAlphaTwoCode
        countryAlphaThreeCode
        latitude
        longitude
        whoRegion
        unRegion
        firstAuthorFullName
        sourceUrl
        sourceType
        sourceTitle
        insitutution
      }
      ... on AnimalMersEstimate {
        __typename
        id
        type
        seroprevalence
        estimateId
        city
        state
        country
        countryAlphaTwoCode
        countryAlphaThreeCode
        latitude
        longitude
        whoRegion
        unRegion
        firstAuthorFullName
        sourceUrl
        sourceType
        sourceTitle
        insitutution
      }
    }
  }
`

export function useMersData() {
  return useQuery<MersEstimates_V2Query>({
    queryKey: ["mersEstimates_V2"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', mersEstimates_V2)
  });
}
