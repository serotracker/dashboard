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
    queryFn: () => request('http://99.79.39.159:3000/api/graphql' ?? '', arbovirusDataStatistics)
  });
}
