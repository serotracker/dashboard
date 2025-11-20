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
          district
          country
          countryAlphaTwoCode
          countryAlphaThreeCode
          studyInclusionCriteria
          studyExclusionCriteria
          studyDesign
          latitude
          longitude
          whoRegion
          unRegion
          firstAuthorFullName
          sourcePublicationYear
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
          seroprevalenceCalculated95CILower
          seroprevalenceCalculated95CIUpper
          samplingMethod
          geographicScope
          testProducer
          testValidation
          socioeconomicStatus
          exposureToCamels
          antigen
          testProducerOther
          testValidatedOn
          positiveCutoff
          symptomPrevalenceOfPositives
          symptomDefinition
          sequencingDone
          clade
          accessionNumbers
          genomeSequenced
          sampleFrames
          ageGroup
          humanCountriesOfTravel {
            name
            alphaTwoCode
            alphaThreeCode
          }
        }
        ... on PrimaryHumanMersViralEstimateInformation {
          __typename
          id
          type
          estimateId
          city
          state
          district
          country
          countryAlphaTwoCode
          countryAlphaThreeCode
          studyInclusionCriteria
          studyExclusionCriteria
          studyDesign
          latitude
          longitude
          whoRegion
          unRegion
          firstAuthorFullName
          sourcePublicationYear
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
          positivePrevalenceCalculated95CILower
          positivePrevalenceCalculated95CIUpper
          samplingMethod
          geographicScope
          testProducer
          testValidation
          socioeconomicStatus
          exposureToCamels
          antigen
          testProducerOther
          testValidatedOn
          positiveCutoff
          symptomPrevalenceOfPositives
          symptomDefinition
          sequencingDone
          clade
          accessionNumbers
          genomeSequenced
          sampleFrames
          ageGroup
          humanCountriesOfTravel {
            name
            alphaTwoCode
            alphaThreeCode
          }
        }
        ... on PrimaryAnimalMersSeroprevalenceEstimateInformation {
          __typename
          id
          type
          estimateId
          city
          state
          district
          country
          countryAlphaTwoCode
          countryAlphaThreeCode
          studyInclusionCriteria
          studyExclusionCriteria
          studyDesign
          latitude
          longitude
          whoRegion
          unRegion
          firstAuthorFullName
          sourcePublicationYear
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
          seroprevalenceCalculated95CILower
          seroprevalenceCalculated95CIUpper
          samplingMethod
          geographicScope
          testProducer
          testValidation
          socioeconomicStatus
          exposureToCamels
          antigen
          testProducerOther
          testValidatedOn
          positiveCutoff
          symptomPrevalenceOfPositives
          symptomDefinition
          sequencingDone
          clade
          accessionNumbers
          genomeSequenced
          animalType
          animalSpecies
          animalDetectionSettings
          animalPurpose
          animalImportedOrLocal
          animalAgeGroup 
          animalCountriesOfImport {
            name
            alphaTwoCode
            alphaThreeCode
          }
        }
        ... on PrimaryAnimalMersViralEstimateInformation {
          __typename
          id
          type
          estimateId
          city
          state
          district
          country
          countryAlphaTwoCode
          countryAlphaThreeCode
          studyInclusionCriteria
          studyExclusionCriteria
          studyDesign
          latitude
          longitude
          whoRegion
          unRegion
          firstAuthorFullName
          sourcePublicationYear
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
          positivePrevalenceCalculated95CILower
          positivePrevalenceCalculated95CIUpper
          samplingMethod
          geographicScope
          testProducer
          testValidation
          socioeconomicStatus
          exposureToCamels
          antigen
          testProducerOther
          testValidatedOn
          positiveCutoff
          symptomPrevalenceOfPositives
          symptomDefinition
          sequencingDone
          clade
          accessionNumbers
          genomeSequenced
          animalType
          animalSpecies
          animalDetectionSettings
          animalPurpose
          animalImportedOrLocal
          animalAgeGroup 
          animalCountriesOfImport {
            name
            alphaTwoCode
            alphaThreeCode
          }
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
            positivePrevalenceCalculated95CILower
            positivePrevalenceCalculated95CIUpper
          }
          ... on MersSeroprevalenceSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            seroprevalence
            seroprevalence95CILower
            seroprevalence95CIUpper
            seroprevalenceCalculated95CILower
            seroprevalenceCalculated95CIUpper
          }
        }
        city
        state
        district
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
              positivePrevalenceCalculated95CILower
              positivePrevalenceCalculated95CIUpper
            }
            ... on MersSeroprevalenceSubEstimateInformation {
              __typename
              sampleDenominator
              sampleNumerator
              seroprevalence
              seroprevalence95CILower
              seroprevalence95CIUpper
              seroprevalenceCalculated95CILower
              seroprevalenceCalculated95CIUpper
            }
          }
          ageGroup
          ageGroupLabel
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
              positivePrevalenceCalculated95CILower
              positivePrevalenceCalculated95CIUpper
            }
            ... on MersSeroprevalenceSubEstimateInformation {
              __typename
              sampleDenominator
              sampleNumerator
              seroprevalence
              seroprevalence95CILower
              seroprevalence95CIUpper
              seroprevalenceCalculated95CILower
              seroprevalenceCalculated95CIUpper
            }
          }
          animalAgeGroup
          animalAgeGroupLabel
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
            positivePrevalenceCalculated95CILower
            positivePrevalenceCalculated95CIUpper
          }
          ... on MersSeroprevalenceSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            seroprevalence
            seroprevalence95CILower
            seroprevalence95CIUpper
            seroprevalenceCalculated95CILower
            seroprevalenceCalculated95CIUpper
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
            positivePrevalenceCalculated95CILower
            positivePrevalenceCalculated95CIUpper
          }
          ... on MersSeroprevalenceSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            seroprevalence
            seroprevalence95CILower
            seroprevalence95CIUpper
            seroprevalenceCalculated95CILower
            seroprevalenceCalculated95CIUpper
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
            positivePrevalenceCalculated95CILower
            positivePrevalenceCalculated95CIUpper
          }
          ... on MersSeroprevalenceSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            seroprevalence
            seroprevalence95CILower
            seroprevalence95CIUpper
            seroprevalenceCalculated95CILower
            seroprevalenceCalculated95CIUpper
          }
        }
        sex
      }
      timeFrameSubestimates {
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
            positivePrevalenceCalculated95CILower
            positivePrevalenceCalculated95CIUpper
          }
          ... on MersSeroprevalenceSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            seroprevalence
            seroprevalence95CILower
            seroprevalence95CIUpper
            seroprevalenceCalculated95CILower
            seroprevalenceCalculated95CIUpper
          }
        }
        samplingStartDate
        samplingEndDate
      }
      sampleTypeSubestimates {
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
            positivePrevalenceCalculated95CILower
            positivePrevalenceCalculated95CIUpper
          }
          ... on MersSeroprevalenceSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            seroprevalence
            seroprevalence95CILower
            seroprevalence95CIUpper
            seroprevalenceCalculated95CILower
            seroprevalenceCalculated95CIUpper
          }
        }
        specimenType
      }
      occupationSubestimates {
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
            positivePrevalenceCalculated95CILower
            positivePrevalenceCalculated95CIUpper
          }
          ... on MersSeroprevalenceSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            seroprevalence
            seroprevalence95CILower
            seroprevalence95CIUpper
            seroprevalenceCalculated95CILower
            seroprevalenceCalculated95CIUpper
          }
        }
        occupation
        sampleFrames
        exposureToCamels
      }
      animalSourceLocationSubestimates {
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
            positivePrevalenceCalculated95CILower
            positivePrevalenceCalculated95CIUpper
          }
          ... on MersSeroprevalenceSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            seroprevalence
            seroprevalence95CILower
            seroprevalence95CIUpper
            seroprevalenceCalculated95CILower
            seroprevalenceCalculated95CIUpper
          }
        }
        animalImportedOrLocal
        animalCountriesOfImport {
          name
          alphaTwoCode
          alphaThreeCode
        }
      }
      animalSamplingContextSubestimates {
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
            positivePrevalenceCalculated95CILower
            positivePrevalenceCalculated95CIUpper
          }
          ... on MersSeroprevalenceSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            seroprevalence
            seroprevalence95CILower
            seroprevalence95CIUpper
            seroprevalenceCalculated95CILower
            seroprevalenceCalculated95CIUpper
          }
        }
        animalDetectionSettings
      }
      camelExposureLevelSubestimates {
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
            positivePrevalenceCalculated95CILower
            positivePrevalenceCalculated95CIUpper
          }
          ... on MersSeroprevalenceSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            seroprevalence
            seroprevalence95CILower
            seroprevalence95CIUpper
            seroprevalenceCalculated95CILower
            seroprevalenceCalculated95CIUpper
          }
        }
        details
        sampleFrames
        exposureToCamels
      }
      nomadismSubestimates {
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
            positivePrevalenceCalculated95CILower
            positivePrevalenceCalculated95CIUpper
          }
          ... on MersSeroprevalenceSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            seroprevalence
            seroprevalence95CILower
            seroprevalence95CIUpper
            seroprevalenceCalculated95CILower
            seroprevalenceCalculated95CIUpper
          }
        }
        details
      }
      humanCountriesOfTravelSubestimates {
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
            positivePrevalenceCalculated95CILower
            positivePrevalenceCalculated95CIUpper
          }
          ... on MersSeroprevalenceSubEstimateInformation {
            __typename
            sampleDenominator
            sampleNumerator
            seroprevalence
            seroprevalence95CILower
            seroprevalence95CIUpper
            seroprevalenceCalculated95CILower
            seroprevalenceCalculated95CIUpper
          }
        }
        humanCountriesOfTravel {
          name
          alphaTwoCode
          alphaThreeCode
        }
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
