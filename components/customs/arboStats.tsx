"use client"

import { useArboDataStatistics } from "@/hooks/useArboStatistics";

function ArboStats() {
    const arboDataStats = useArboDataStatistics();

    return (
        <h3 className="flex text-background bg-white rounded-md px-16 justify-center p-8 whitespace-nowrap">
          {`We have data from ${arboDataStats.data?.arbovirusDataStatistics.patricipantCount ?? 0} Participants accross ${arboDataStats.data?.arbovirusDataStatistics.estimateCount ?? 0} Estimates from ${arboDataStats.data?.arbovirusDataStatistics.sourceCount ?? 0} Sources spanning ${arboDataStats.data?.arbovirusDataStatistics.countryCount ?? 0} countries and territories`}
      </h3>
    )
}

export default ArboStats;