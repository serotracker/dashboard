import { useMemo } from "react";
import { useFaoYearlyCamelPopulationDataPartitioned } from "./useFaoYearlyCamelPopulationDataPartitioned";
import { useFaoYearlyCamelPopulationDataPartitionKeys } from "./useFaoYearlyCamelPopulationDataPartitionKeys";

export const useFaoYearlyCamelPopulationData = () => {
  const { data: partitionKeyData } = useFaoYearlyCamelPopulationDataPartitionKeys();
  const dataArray = useFaoYearlyCamelPopulationDataPartitioned({ partitionKeys: partitionKeyData?.yearlyFaoCamelPopulationDataPartitionKeys ?? [] })

  const yearlyFaoCamelPopulationData = useMemo(() => {
    if(dataArray.length > 0 && dataArray.every((element) => !!element.data)) {
      return dataArray.flatMap((element) => element.data?.partitionedYearlyFaoCamelPopulationData.yearlyFaoCamelPopulationData ?? [])
    }
  }, [ dataArray ])

  return {
    yearlyFaoCamelPopulationData
  }
}
