import { arbovirusDataStatistics, arbovirusDataStatisticsQueryKey } from "@/hooks/useArboStatistics";
import getQueryClient from "./getQueryClient";
import request from "graphql-request";
import { ArbovirusDataStatistics } from "@/gql/graphql";

export function formatNumber(num?: number) {
    return (
      <b className="px-1">{num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') ?? 0}</b>
      );
}

async function ArboStats() {
    const queryClient = getQueryClient();

    const arboDataStats = await queryClient.fetchQuery<ArbovirusDataStatistics>({
      queryKey: [arbovirusDataStatisticsQueryKey],
      queryFn: () =>
        request(
          process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? "",
          arbovirusDataStatistics
        ),
    });

    return (
        <h3 className="flex text-background bg-white rounded-md px-16 justify-center p-8 whitespace-nowrap">
          We have data from {formatNumber(arboDataStats.patricipantCount)} Participants accross {formatNumber(arboDataStats.estimateCount)} Estimates from {formatNumber(arboDataStats.sourceCount)} Sources spanning {formatNumber(arboDataStats.countryCount)} countries and territories
      </h3>
    )
}

export default ArboStats;