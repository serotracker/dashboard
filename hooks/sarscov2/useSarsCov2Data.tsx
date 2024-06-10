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
      estimateName
      url
    }
  }
`

export function useSarsCov2Data() {
  return useQuery<SarsCov2EstimatesQuery>({
    queryKey: ["sarsCov2Estimates"],
    queryFn: () => request('https://iit-backend-v2-git-issue-370-add-partitioned-aad1f1-serotracker.vercel.app/api/graphql' ?? '', sarsCov2Estimates)
  });
}
