import { useQueries } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { PartitionedFaoMersEventsQuery, PartitionedFaoMersEventsQueryVariables } from "@/gql/graphql";

export type FaoMersEvent = 
  | Omit<
    Extract<PartitionedFaoMersEventsQuery['partitionedFaoMersEvents']['mersEvents'][number], { __typename: 'AnimalMersEvent'}>,
    'animalSpeciesV2'
  > & {
    animalSpecies: Extract<PartitionedFaoMersEventsQuery['partitionedFaoMersEvents']['mersEvents'][number], { __typename: 'AnimalMersEvent'}>['animalSpeciesV2']
  }
  | Extract<PartitionedFaoMersEventsQuery['partitionedFaoMersEvents']['mersEvents'][number], { __typename: 'HumanMersEvent' }>;

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
          unRegion
          observationDate
          reportDate
          animalType
          animalSpeciesV2
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
          unRegion
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