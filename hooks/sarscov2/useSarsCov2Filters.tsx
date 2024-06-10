import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { SarsCov2FilterOptionsQuery } from "@/gql/graphql";

export const sarsCov2Filters = gql`
  query sarsCov2FilterOptions {
    sarsCov2FilterOptions {
      ageGroup
      scope
      sourceType
      riskOfBias
      unRegion
      whoRegion
      antibodies
      isotypes
      testType
      countryIdentifiers {
        name
        alphaTwoCode
        alphaThreeCode
      }
    }
  }
`

export function useSarsCov2Filters() {
  return useQuery<SarsCov2FilterOptionsQuery>({
    queryKey: ["sarsCov2FilterOptions"],
    queryFn: () => request('https://iit-backend-v2-git-issue-370-add-partitioned-aad1f1-serotracker.vercel.app/api/graphql' ?? '', sarsCov2Filters)
  });
}
