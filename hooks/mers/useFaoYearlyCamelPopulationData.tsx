import { useMemo } from "react";
import { useFaoYearlyCamelPopulationDataPartitioned } from "./useFaoYearlyCamelPopulationDataPartitioned";
import { useFaoYearlyCamelPopulationDataPartitionKeys } from "./useFaoYearlyCamelPopulationDataPartitionKeys";

export const useFaoYearlyCamelPopulationData = () => {
  const { data: partitionKeyData } = useFaoYearlyCamelPopulationDataPartitionKeys();
  const dataArray = useFaoYearlyCamelPopulationDataPartitioned({ partitionKeys: partitionKeyData?.yearlyFaoCamelPopulationDataPartitionKeys ?? [] })

  const yearlyFaoCamelPopulationData = useMemo(() => {
    if(dataArray.length > 0 && dataArray.every((element) => !!element.data)) {
      return dataArray
        .flatMap((element) => element.data?.partitionedYearlyFaoCamelPopulationData.yearlyFaoCamelPopulationData ?? [])
        // TODO: Sean Kenny - Remove this silly hack when we can re-introduce country highlighting for these two countries.
        .filter((element) => element.countryAlphaThreeCode !== 'EGY' && element.countryAlphaThreeCode !== 'IND');

    }
  }, [ dataArray ])

  return {
    yearlyFaoCamelPopulationData
  }
}
