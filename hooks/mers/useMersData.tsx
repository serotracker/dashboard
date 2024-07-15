import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { MersEstimatesQuery } from "@/gql/graphql";

export const mersEstimates = gql`
  query mersEstimates {
    mersEstimates {
      __typename
      id
      seroprevalence
      estimateId
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
`

export function useMersData() {
  return useQuery<MersEstimatesQuery>({
    queryKey: ["mersEstimates"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', mersEstimates)
  });
}
