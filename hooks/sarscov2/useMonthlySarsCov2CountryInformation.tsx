import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { MonthlySarsCov2CountryInformationQuery } from "@/gql/graphql";

export const monthlySarsCov2CountryInformation = gql`
  query monthlySarsCov2CountryInformation {
    monthlySarsCov2CountryInformation {
      population
      peopleVaccinatedPerHundred
      peopleFullyVaccinatedPerHundred
      positiveCasesPerMillionPeople
      alphaTwoCode
      alphaThreeCode
      month
      year
      whoRegion
      unRegion
      gbdSuperRegion
      gbdSubRegion
    }
  }
`

export function useMonthlySarsCov2CountryInformation() {
  return useQuery<MonthlySarsCov2CountryInformationQuery>({
    queryKey: ["monthlySarsCov2CountryInformation"],
    queryFn: () => request('https://iit-backend-v2-git-issue-370-add-partitioned-aad1f1-serotracker.vercel.app/api/graphql' ?? '', monthlySarsCov2CountryInformation)
  });
}
