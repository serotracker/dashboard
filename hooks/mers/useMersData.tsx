import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { MersEstimates_V2Query } from "@/gql/graphql";

export const mersEstimates_V2 = gql`
  query mersEstimates_V2 {
    mersEstimates_V2 {
      ... on HumanMersEstimate {
        __typename
        id
        type
        estimateId
        city
        state
        country
        countryAlphaTwoCode
        countryAlphaThreeCode
        studyInclusionCriteria
        studyExclusionCriteria
        latitude
        longitude
        whoRegion
        unRegion
        firstAuthorFullName
        sourceUrl
        sourceType
        sourceTitle
        insitutution
        seroprevalence
        ageGroup
      }
      ... on HumanMersViralEstimate {
        __typename
        id
        type
        estimateId
        city
        state
        country
        countryAlphaTwoCode
        countryAlphaThreeCode
        studyInclusionCriteria
        studyExclusionCriteria
        latitude
        longitude
        whoRegion
        unRegion
        firstAuthorFullName
        sourceUrl
        sourceType
        sourceTitle
        insitutution
        positivePrevalence
        ageGroup
      }
      ... on AnimalMersEstimate {
        __typename
        id
        type
        estimateId
        city
        state
        country
        countryAlphaTwoCode
        countryAlphaThreeCode
        studyInclusionCriteria
        studyExclusionCriteria
        latitude
        longitude
        whoRegion
        unRegion
        firstAuthorFullName
        sourceUrl
        sourceType
        sourceTitle
        insitutution
        seroprevalence
        animalType
        animalSpecies
      }
      ... on AnimalMersViralEstimate {
        __typename
        id
        type
        estimateId
        city
        state
        country
        countryAlphaTwoCode
        countryAlphaThreeCode
        studyInclusionCriteria
        studyExclusionCriteria
        latitude
        longitude
        whoRegion
        unRegion
        firstAuthorFullName
        sourceUrl
        sourceType
        sourceTitle
        insitutution
        positivePrevalence
        animalType
        animalSpecies
      }
    }
  }
`

export function useMersData() {
  return useQuery<MersEstimates_V2Query>({
    queryKey: ["mersEstimates_V2"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', mersEstimates_V2)
  });
}
