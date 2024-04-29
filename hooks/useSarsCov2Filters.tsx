import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { SarsCov2FilterOptionsQuery } from "@/gql/graphql";

export const sarsCov2Filters = gql`
  query sarsCov2FilterOptions {
    sarsCov2FilterOptions {
      ageGroup
      country
      sourceType
      riskOfBias
      unRegion
      whoRegion
      antibodies
      isotypes
      testType
    }
  }
`

export function useSarsCov2Filters() {
  return useQuery<SarsCov2FilterOptionsQuery>({
    queryKey: ["sarsCov2FilterOptions"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', sarsCov2Filters)
  });
}
