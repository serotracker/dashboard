"use client"

import { useArboDataStatistics } from "@/hooks/useArboStatistics";

export function formatNumber(num?: number) {
    return (
      <b className="px-1">{num?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') ?? 0}</b>
      );
}

function ArboStats() {
    const arboDataStats = useArboDataStatistics();

    return (
        <h3 className="flex text-background bg-white rounded-md px-16 justify-center p-8 whitespace-nowrap">
          We have data from {formatNumber(arboDataStats.data?.arbovirusDataStatistics.patricipantCount)} Participants accross {formatNumber(arboDataStats.data?.arbovirusDataStatistics.estimateCount)} Estimates from {formatNumber(arboDataStats.data?.arbovirusDataStatistics.sourceCount)} Sources spanning {formatNumber(arboDataStats.data?.arbovirusDataStatistics.countryCount)} countries and territories
      </h3>
    )
}

export default ArboStats;