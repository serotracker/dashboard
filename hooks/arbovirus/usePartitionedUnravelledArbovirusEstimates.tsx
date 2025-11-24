import { useQueries } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { PartitionedUnravelledGroupedArbovirusEstimatesQuery, PartitionedUnravelledGroupedArbovirusEstimatesQueryVariables } from "@/gql/graphql";

export const partitionedUnravelledGroupedArbovirusEstimates = gql`
  query partitionedUnravelledGroupedArbovirusEstimates($input: PartitionedUnravelledGroupedArbovirusEstimatesInput!) {
    partitionedUnravelledGroupedArbovirusEstimates(input: $input) {
      partitionKey
      arboEstimates {
        id
        shown
        groupId
        estimateType
        ageGroup
        ageMaximum
        ageMinimum
        antibodies
        antigen
        assay
        assayOther
        geographicScope
        city
        state
        district
        country
        countryAlphaTwoCode
        countryAlphaThreeCode
        createdAt
        estimateId
        inclusionCriteria
        studyDesign
        latitude
        longitude
        pathogen
        pediatricAgeGroup
        producer
        producerOther
        sameFrameTargetGroup
        sampleEndDate
        sampleFrame
        sampleNumerator
        sampleSize
        sampleStartDate
        seroprevalence
        seroprevalenceStudy95CILower
        seroprevalenceStudy95CIUpper
        seroprevalenceCalculated95CILower
        seroprevalenceCalculated95CIUpper
        serotype
        groupingVariable
        sex
        sourceSheetId
        sourceSheetName
        unRegion
        url
        whoRegion
        studyPopulation
        studySpecies
      }
    }
  }
`

interface UsePartitionedGroupedArbovirusEstimatesInput {
  partitionKeys: number[];
}

export function usePartitionedUnravelledGroupedArbovirusEstimates(input: UsePartitionedGroupedArbovirusEstimatesInput) {
  return useQueries({
    queries: input.partitionKeys.map(( partitionKey ) =>  ({
      queryKey: ["partitionedUnravelledGroupedArbovirusEstimates", partitionKey.toString()],
      queryFn: () => request<PartitionedUnravelledGroupedArbovirusEstimatesQuery, PartitionedUnravelledGroupedArbovirusEstimatesQueryVariables>(
        process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '',
        partitionedUnravelledGroupedArbovirusEstimates,
        { input: { partitionKey } }
      ),
    }))
  });
}