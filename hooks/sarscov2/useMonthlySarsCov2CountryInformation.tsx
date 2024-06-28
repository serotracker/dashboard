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
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', monthlySarsCov2CountryInformation)
  });
}
