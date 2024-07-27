import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { MersPrimaryEstimatesQuery } from "@/gql/graphql";

export const mersPrimaryEstimates = gql`
  query mersPrimaryEstimates {
    mersPrimaryEstimates {
      __typename
      id
      estimateId
      primaryEstimateInfo {
        ... on PrimaryHumanMersSeroprevalenceEstimateInformation {
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
          samplingStartDate
          samplingEndDate
          sensitivity
          sensitivity95CILower
          sensitivity95CIUpper
          sensitivityDenominator
          specificity
          specificity95CILower
          specificity95CIUpper
          specificityDenominator
          sampleDenominator
          sampleNumerator
          assay
          specimenType
          sex
          isotypes
          seroprevalence
          seroprevalence95CILower
          seroprevalence95CIUpper
          samplingMethod
          geographicScope
          testProducer
          testValidation
          sampleFrame
          ageGroup
        }
        ... on PrimaryHumanMersViralEstimateInformation {
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
          samplingStartDate
          samplingEndDate
          sensitivity
          sensitivity95CILower
          sensitivity95CIUpper
          sensitivityDenominator
          specificity
          specificity95CILower
          specificity95CIUpper
          specificityDenominator
          sampleDenominator
          sampleNumerator
          assay
          specimenType
          sex
          isotypes
          positivePrevalence
          positivePrevalence95CILower
          positivePrevalence95CIUpper
          samplingMethod
          geographicScope
          testProducer
          testValidation
          sampleFrame
          ageGroup
        }
        ... on PrimaryAnimalMersSeroprevalenceEstimateInformation {
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
          samplingStartDate
          samplingEndDate
          sensitivity
          sensitivity95CILower
          sensitivity95CIUpper
          sensitivityDenominator
          specificity
          specificity95CILower
          specificity95CIUpper
          specificityDenominator
          sampleDenominator
          sampleNumerator
          assay
          specimenType
          sex
          isotypes
          seroprevalence
          seroprevalence95CILower
          seroprevalence95CIUpper
          samplingMethod
          geographicScope
          testProducer
          testValidation
          animalType
          animalSpecies
          animalDetectionSettings
          animalPurpose
          animalImportedOrLocal
        }
        ... on PrimaryAnimalMersViralEstimateInformation {
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
          samplingStartDate
          samplingEndDate
          sensitivity
          sensitivity95CILower
          sensitivity95CIUpper
          sensitivityDenominator
          specificity
          specificity95CILower
          specificity95CIUpper
          specificityDenominator
          sampleDenominator
          sampleNumerator
          assay
          specimenType
          sex
          isotypes
          positivePrevalence
          positivePrevalence95CILower
          positivePrevalence95CIUpper
          samplingMethod
          geographicScope
          testProducer
          testValidation
          animalType
          animalSpecies
          animalDetectionSettings
          animalPurpose
          animalImportedOrLocal
        }
      }
      geographicalAreaSubestimates {
        __typename
        id
        estimateId
        estimateInfo {
          ... on MersViralSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            positivePrevalence
            positivePrevalence95CILower
            positivePrevalence95CIUpper
          }
          ... on MersSeroprevalenceSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            seroprevalence
            seroprevalence95CILower
            seroprevalence95CIUpper
          }
        }
        city
        state
        country
        countryAlphaTwoCode
        countryAlphaThreeCode
        latitude
        longitude
        whoRegion
        unRegion
        geographicScope
      }
      ageGroupSubestimates {
        ... on HumanMersAgeGroupSubEstimate {
          __typename
          id
          estimateId
          estimateInfo {
            ... on MersViralSubEstimateInformation {
              __typename
              sampleDenominator
              sampleNumerator
              positivePrevalence
              positivePrevalence95CILower
              positivePrevalence95CIUpper
            }
            ... on MersSeroprevalenceSubEstimateInformation {
              __typename
              sampleDenominator
              sampleNumerator
              seroprevalence
              seroprevalence95CILower
              seroprevalence95CIUpper
            }
          }
          ageGroup
        }
        ... on AnimalMersAgeGroupSubEstimate {
          __typename
          id
          estimateId
          estimateInfo {
            ... on MersViralSubEstimateInformation {
              __typename
              sampleDenominator
              sampleNumerator
              positivePrevalence
              positivePrevalence95CILower
              positivePrevalence95CIUpper
            }
            ... on MersSeroprevalenceSubEstimateInformation {
              __typename
              sampleDenominator
              sampleNumerator
              seroprevalence
              seroprevalence95CILower
              seroprevalence95CIUpper
            }
          }
          animalAgeGroup
        }
      }
      testUsedSubestimates {
        __typename
        id
        estimateId
        estimateInfo {
          ... on MersViralSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            positivePrevalence
            positivePrevalence95CILower
            positivePrevalence95CIUpper
          }
          ... on MersSeroprevalenceSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            seroprevalence
            seroprevalence95CILower
            seroprevalence95CIUpper
          }
        }
        assay
      }
      animalSpeciesSubestimates {
        __typename
        id
        estimateId
        estimateInfo {
          ... on MersViralSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            positivePrevalence
            positivePrevalence95CILower
            positivePrevalence95CIUpper
          }
          ... on MersSeroprevalenceSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            seroprevalence
            seroprevalence95CILower
            seroprevalence95CIUpper
          }
        }
        animalSpecies
      }
      sexSubestimates {
        __typename
        id
        estimateId
        estimateInfo {
          ... on MersViralSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            positivePrevalence
            positivePrevalence95CILower
            positivePrevalence95CIUpper
          }
          ... on MersSeroprevalenceSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            seroprevalence
            seroprevalence95CILower
            seroprevalence95CIUpper
          }
        }
        sex
      }
    }
  }
`

export function useMersPrimaryEstimates() {
  return useQuery<MersPrimaryEstimatesQuery>({
    queryKey: ["mersPrimaryEstimates"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', mersPrimaryEstimates)
  });
}
