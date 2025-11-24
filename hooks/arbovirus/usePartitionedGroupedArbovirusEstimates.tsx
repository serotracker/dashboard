import { useQueries } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { PartitionedGroupedArbovirusEstimatesQueryQuery, PartitionedGroupedArbovirusEstimatesQueryQueryVariables } from "@/gql/graphql";

export const partitionedGroupedArbovirusEstimatesQuery = gql`
  query partitionedGroupedArbovirusEstimatesQuery($input: PartitionedGroupedArbovirusEstimatesInput!) {
    partitionedGroupedArbovirusEstimates(input: $input) {
      partitionKey
      arboEstimates {
        id
        shownEstimates {
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
          country
          district
          countryAlphaTwoCode
          countryAlphaThreeCode
          createdAt
          estimateId
          id
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
          sex
          sourceSheetId
          sourceSheetName
          unRegion
          url
          whoRegion
          studyPopulation
          studySpecies
        }
        hiddenEstimates {
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
          country
          district
          countryAlphaTwoCode
          countryAlphaThreeCode
          createdAt
          estimateId
          id
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
          sex
          sourceSheetId
          sourceSheetName
          unRegion
          url
          whoRegion
          studyPopulation
          studySpecies
          groupingVariable
        }
      }
    }
  }
`

interface UsePartitionedGroupedArbovirusEstimatesInput {
  partitionKeys: number[];
}

export function usePartitionedGroupedArbovirusEstimates(input: UsePartitionedGroupedArbovirusEstimatesInput) {
  return useQueries({
    queries: input.partitionKeys.map(( partitionKey ) =>  ({
      queryKey: ["partitionedGroupedArbovirusEstimates", partitionKey.toString()],
      queryFn: () => request<PartitionedGroupedArbovirusEstimatesQueryQuery, PartitionedGroupedArbovirusEstimatesQueryQueryVariables>(
        process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '',
        partitionedGroupedArbovirusEstimatesQuery,
        { input: { partitionKey } }
      ),
    }))
  });
}