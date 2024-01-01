import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';

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
      createdAt
      estimateId
      id
      inclusionCriteria
      latitude
      longitude
      pathogen
      producer
      producerOther
      sameFrameTargetGroup
      sampleEndDate
      sampleFrame
      sampleNumerator
      sampleSize
      sampleStartDate
      seroprevalence
      sex
      sourceSheetId
      sourceSheetName
      url
      whoRegion
    }
  }
`

export function useArboData() {
  return useQuery<any>({
    queryKey: ["arbovirusEstimatesQuery"],
    queryFn: () => request('https://iit-backend-v2.vercel.app/api/graphql', arbovirusEstimatesQuery)
  });
}
