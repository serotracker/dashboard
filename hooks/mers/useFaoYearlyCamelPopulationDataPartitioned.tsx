import { useQueries } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { PartitionedYearlyFaoCamelPopulationDataQuery, PartitionedYearlyFaoCamelPopulationDataQueryVariables } from "@/gql/graphql";

export type FaoYearlyCamelPopulationDataEntry = PartitionedYearlyFaoCamelPopulationDataQuery['partitionedYearlyFaoCamelPopulationData']['yearlyFaoCamelPopulationData'][number];

export const partitionedFaoYearlyCamelPopulationData = gql`
  query partitionedYearlyFaoCamelPopulationData($input: PartitionedYearlyFaoCamelPopulationDataInput!) {
    partitionedYearlyFaoCamelPopulationData(input: $input) {
      partitionKey
      yearlyFaoCamelPopulationData {
        id
        countryAlphaThreeCode
        year
        camelCount
        camelCountPerCapita
        note
      }
    }
  }
`

interface UseFaoYearlyCamelPopulationDataPartitionedInput {
  partitionKeys: number[];
}

export function useFaoYearlyCamelPopulationDataPartitioned(input: UseFaoYearlyCamelPopulationDataPartitionedInput) {
  return useQueries({
    queries: input.partitionKeys.map(( partitionKey ) =>  ({
      queryKey: ["partitionedFaoYearlyCamelPopulationData", partitionKey.toString()],
      queryFn: () => request<PartitionedYearlyFaoCamelPopulationDataQuery, PartitionedYearlyFaoCamelPopulationDataQueryVariables>(
        process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '',
        partitionedFaoYearlyCamelPopulationData,
        { input: { partitionKey } }
      ),
    }))
  });
}