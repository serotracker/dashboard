import { useMemo } from "react";
import { useMersWhoCaseDataPartitioned } from "./use-mers-who-case-data-partitioned";
import { useMersWhoCaseDataPartitionKeys } from "./use-mers-who-case-data-partition-keys";

export const useMersWhoCaseData = () => {
  const { data: partitionKeyData } = useMersWhoCaseDataPartitionKeys();
  const dataArray = useMersWhoCaseDataPartitioned({ partitionKeys: partitionKeyData?.mersWhoCaseDataPartitionKeys ?? [] })

  const mersWhoCaseData = useMemo(() => {
    if(dataArray.length > 0 && dataArray.every((element) => !!element.data)) {
      return dataArray.flatMap((element) => element.data?.mersWhoCaseData.mersWhoCaseData ?? [])
    }
  }, [ dataArray ])

  return {
    mersWhoCaseData
  }
}
