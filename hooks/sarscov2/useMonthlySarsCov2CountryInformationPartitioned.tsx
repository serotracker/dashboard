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
        'https://iit-backend-v2-git-issue-370-add-partitioned-aad1f1-serotracker.vercel.app/api/graphql' ?? '',
        partitionedMonthlySarsCov2CountryInformation,
        { input: { partitionKey } }
      ),
    }))
  });
}