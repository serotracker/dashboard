import { useQueries } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import {
  PartitionedMonthlySarsCov2CountryInformationQuery,
  PartitionedMonthlySarsCov2CountryInformationQueryVariables
} from "@/gql/graphql";

export const partitionedMonthlySarsCov2CountryInformation = gql`
  query partitionedMonthlySarsCov2CountryInformation($input: PartitionedMonthlySarsCov2CountryInformationInput!) {
    partitionedMonthlySarsCov2CountryInformation(input: $input) {
      partitionKey
      monthlySarsCov2CountryInformation {
        population
        peopleVaccinatedPerHundred
        peopleFullyVaccinatedPerHundred
        positiveCasesPerMillionPeople
        alphaTwoCode
        alphaThreeCode
        whoRegion
        unRegion
        gbdSuperRegion
        gbdSubRegion
        month
        year
      }
    }
  }
`

interface UseMonthlySarsCov2CountryInformationPartitionedInput {
  partitionKeys: number[];
}

export function useMonthlySarsCov2CountryInformationPartitioned(input: UseMonthlySarsCov2CountryInformationPartitionedInput) {
  return useQueries({
    queries: input.partitionKeys.map(( partitionKey ) =>  ({
      queryKey: ["partitionedMonthlySarsCov2CountryInformation", partitionKey.toString()],
      queryFn: () => request<PartitionedMonthlySarsCov2CountryInformationQuery, PartitionedMonthlySarsCov2CountryInformationQueryVariables>(
        process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '',
        partitionedMonthlySarsCov2CountryInformation,
        { input: { partitionKey } }
      ),
    }))
  });
}