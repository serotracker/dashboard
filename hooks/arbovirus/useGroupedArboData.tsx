import { useMemo } from 'react'
import { Arbovirus } from "@/gql/graphql";
import { useAllUnravelledGroupedArbovirusEstimatePartitionKeys } from './useAllUnravelledGroupedArbovirusEstimatePartitionKeys';
import { usePartitionedUnravelledGroupedArbovirusEstimates } from './usePartitionedUnravelledArbovirusEstimates';
import { ArbovirusEstimate } from '@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context';

export function useGroupedArboData() {
  const { data: partitionKeyData } = useAllUnravelledGroupedArbovirusEstimatePartitionKeys();
  const dataArray = usePartitionedUnravelledGroupedArbovirusEstimates({ partitionKeys: partitionKeyData?.allUnravelledGroupedArbovirusEstimatePartitionKeys ?? [] })

  const groupedArbovirusEstimates = useMemo(() => {
    if(dataArray.length > 0 && dataArray.every((element) => !!element.data)) {
      return dataArray.flatMap((element) => element.data.partitionedUnravelledGroupedArbovirusEstimates.arboEstimates ?? [])
    }
  }, [ dataArray ])

  const oropoucheEnabled = process.env.NEXT_PUBLIC_OROPOUCHE_ENABLED === 'true';

  const data = useMemo(() => {
    const flattenedData = groupedArbovirusEstimates?.map((groupedArbovirusEstimate) => ({
      ...groupedArbovirusEstimate,
      isPrimaryEstimate: groupedArbovirusEstimate.shown,
    }));

    if(!flattenedData) {
      return flattenedData
    }

    if(!oropoucheEnabled) {
      return { arbovirusEstimates: flattenedData.filter((estimate) => estimate.pathogen !== Arbovirus.Orov) };
    }

    return { arbovirusEstimates: flattenedData };
  }, [ groupedArbovirusEstimates, oropoucheEnabled ]);

  return {
    data,
  }
}
