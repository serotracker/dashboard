import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { ArbovirusEstimatesQueryQuery } from "@/gql/graphql";

export const arbovirusEstimatesQuery = gql`
  query arbovirusEstimatesQuery {
    arbovirusEstimates {
      ageGroup
      ageMaximum
      ageMinimum
      antibodies
      antigen
      assay
      assayOther
      city
      state
      country
      countryAlphaTwoCode
      countryAlphaThreeCode
      createdAt
      estimateId
      id
      inclusionCriteria
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
    }
  }
`

export function useArboData() {
  return useQuery<ArbovirusEstimatesQueryQuery>({
    queryKey: ["arbovirusEstimatesQuery"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', arbovirusEstimatesQuery)
  });
}
