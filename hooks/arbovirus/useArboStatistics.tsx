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
    queryFn: () => request('https://iit-backend-v2-git-issue-370-add-partitioned-aad1f1-serotracker.vercel.app/api/graphql' ?? '', arbovirusDataStatistics)
  });
}
