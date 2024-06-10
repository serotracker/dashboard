import { arbovirusDataStatistics, arbovirusDataStatisticsQueryKey } from "@/hooks/arbovirus/useArboStatistics";
import getQueryClient from "./getQueryClient";
import request from "graphql-request";
import { ArbovirusDataStatistics, ArbovirusDataStatisticsQuery } from "@/gql/graphql";

export function formatNumber(num?: number) {
    return (
      num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') ?? 0
      );
}

async function ArboStats() {
    const queryClient = getQueryClient();

    const arboDataStats = await queryClient.fetchQuery<ArbovirusDataStatisticsQuery>({
      queryKey: [arbovirusDataStatisticsQueryKey],
      queryFn: () =>
        request(
          process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? "",
          arbovirusDataStatistics
        ),
    });

    return (
      <h3 className="flex text-background bg-white rounded-md px-16 justify-center p-8 whitespace-nowrap">
          We have data from {formatNumber(arboDataStats.arbovirusDataStatistics.patricipantCount)} Participants accross {formatNumber(arboDataStats.arbovirusDataStatistics.estimateCount)} Estimates from {formatNumber(arboDataStats.arbovirusDataStatistics.sourceCount)} Sources spanning {formatNumber(arboDataStats.arbovirusDataStatistics.countryCount)} countries and territories
      </h3>
    )
}

export default ArboStats;