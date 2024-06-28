import { useMemo } from "react";
import { useSarsCov2DataPartitionKeys } from "./useSarsCov2DataPartitionKeys";
import { useSarsCov2DataPartitioned } from "./useSarsCov2DataPartitioned";

export const useSarsCov2Data = () => {
  const { data: partitionKeyData } = useSarsCov2DataPartitionKeys();
  const dataArray = useSarsCov2DataPartitioned({ partitionKeys: partitionKeyData?.allSarsCov2EstimatePartitionKeys ?? [] })

  const sarsCov2Estimates = useMemo(() => {
    if(dataArray.length > 0 && dataArray.every((element) => !!element.data)) {
      return dataArray.flatMap((element) => element.data?.partitionedSarsCov2Estimates.sarsCov2Estimates ?? [])
    }
  }, [ dataArray ])

  return {
    sarsCov2Estimates
  }
}