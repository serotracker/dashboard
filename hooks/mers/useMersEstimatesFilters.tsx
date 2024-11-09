import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { MersEstimatesFilterOptionsQuery } from "@/gql/graphql";

export const mersEstimatesFilterOptions = gql`
  query mersEstimatesFilterOptions {
    mersEstimatesFilterOptions {
      sourceType
      ageGroup
      assay
      specimenType
      sex
      isotypes
      samplingMethod
      geographicScope
      animalDetectionSettings
      animalPurpose
      animalSpeciesV2
      animalImportedOrLocal
      sampleFrame
      testProducer
      testValidation
      antigen
      exposureToCamels
      clade
    }
  }
`

export function useMersEstimatesFilterOptions() {
  return useQuery<MersEstimatesFilterOptionsQuery>({
    queryKey: ["mersEstimatesFilterOptions"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', mersEstimatesFilterOptions)
  });
} 