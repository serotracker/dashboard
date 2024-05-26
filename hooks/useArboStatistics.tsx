import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { ArbovirusDataStatistics } from "@/gql/graphql";

export const arbovirusDataStatistics = gql`
  query arbovirusDataStatistics {
    arbovirusDataStatistics {
        patricipantCount,
        sourceCount,
        estimateCount,
        countryCount
    }
  }
`

export const arbovirusDataStatisticsQueryKey = "arbovirusDataStatistics";

export function useArboDataStatistics() {
  return useQuery<ArbovirusDataStatistics>({
    queryKey: [arbovirusDataStatisticsQueryKey],
    queryFn: () => request(process.env.NEXT_PUBLIC_PREVIEW_API_GRAPHQL_URL ?? '', arbovirusDataStatistics)
  });
}
