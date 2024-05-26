import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { SarsCov2EstimatesQuery } from "@/gql/graphql";

export const sarsCov2Estimates = gql`
  query sarsCov2Estimates {
    sarsCov2Estimates {
      antibodies
      isotypes
      isWHOUnityAligned
      testType
      sourceType
      riskOfBias
      populationGroup
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
    }
  }
`

export function useNewSarsCov2Data() {
  return useQuery<SarsCov2EstimatesQuery>({
    queryKey: ["sarsCov2Estimates"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', sarsCov2Estimates)
  });
}
