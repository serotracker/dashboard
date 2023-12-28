import { gql, useQuery } from "@apollo/client";

const arbovirusEstimatesQuery = gql`
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
  return useQuery(arbovirusEstimatesQuery, {ssr: true});
}
