import { useQueries } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { 
  PartitionedSarsCov2EstimatesQuery,
  PartitionedSarsCov2EstimatesQueryVariables
} from "@/gql/graphql";

export const partitionedSarsCov2Estimates = gql`
  query partitionedSarsCov2Estimates($input: PartitionedSarsCov2EstimatesInput!) {
    partitionedSarsCov2Estimates(input: $input) {
      partitionKey
      sarsCov2Estimates {
        antibodies
        isotypes
        isWHOUnityAligned
        testType
        sourceType
        riskOfBias
        populationGroup
        studyType
        sex
        ageGroup
        country
        countryAlphaTwoCode
        countryAlphaThreeCode
        whoRegion
        unRegion
        gbdSuperRegion
        gbdSubRegion
        state
        county
        studyName
        scope
        city
        id
        latitude
        longitude
        samplingStartDate
        samplingEndDate
        samplingMidDate
        publicationDate
        countryPeopleVaccinatedPerHundred
        countryPeopleFullyVaccinatedPerHundred
        countryPositiveCasesPerMillionPeople
        denominatorValue
        numeratorValue
        seroprevalence
        estimateName
        url
      }
    }
  }
`

interface UseSarsCov2DataPartitionedInput {
  partitionKeys: number[];
}

export function useSarsCov2DataPartitioned(input: UseSarsCov2DataPartitionedInput) {
  return useQueries({
    queries: input.partitionKeys.map(( partitionKey ) =>  ({
      queryKey: ["partitionedSarsCov2Estimates", partitionKey.toString()],
      queryFn: () => request<PartitionedSarsCov2EstimatesQuery, PartitionedSarsCov2EstimatesQueryVariables>(
        process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '',
        partitionedSarsCov2Estimates,
        { input: { partitionKey } }
      ),
    }))
  });
}