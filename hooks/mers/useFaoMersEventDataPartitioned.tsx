import { useQueries } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { PartitionedFaoMersEventsQuery, PartitionedFaoMersEventsQueryVariables } from "@/gql/graphql";

export type FaoMersEvent = PartitionedFaoMersEventsQuery['partitionedFaoMersEvents']['mersEvents'][number];

export const partitionedFaoMersEvents = gql`
  query partitionedFaoMersEvents($input: PartitionedFaoMersEventsInput!) {
    partitionedFaoMersEvents(input: $input) {
      partitionKey
      mersEvents {
        ... on AnimalMersEvent {
          __typename
          id
          type
          diagnosisStatus
          diagnosisSource
          country {
            name
            alphaTwoCode
            alphaThreeCode
          }
          state
          city
          latitude
          longitude
          whoRegion
          observationDate
          reportDate
          animalType
          animalSpecies
        }
        ... on HumanMersEvent {
          __typename
          id
          type
          diagnosisStatus
          diagnosisSource
          country {
            name
            alphaTwoCode
            alphaThreeCode
          }
          state
          city
          latitude
          longitude
          whoRegion
          observationDate
          reportDate
          humansAffected
          humanDeaths
        }
      }
    }
  }
`

interface UseFaoMersEventDataPartitionedInput {
  partitionKeys: number[];
}

export function useFaoMersEventDataPartitioned(input: UseFaoMersEventDataPartitionedInput) {
  return useQueries({
    queries: input.partitionKeys.map(( partitionKey ) =>  ({
      queryKey: ["partitionedFaoMersEvents", partitionKey.toString()],
      queryFn: () => request<PartitionedFaoMersEventsQuery, PartitionedFaoMersEventsQueryVariables>(
        process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '',
        partitionedFaoMersEvents,
        { input: { partitionKey } }
      ),
    }))
  });
}