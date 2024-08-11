import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { ArbovirusEnviromentalSuitabilityDataQueryQuery } from "@/gql/graphql";

export const arbovirusEnviromentalSuitabilityDataQuery = gql`
  query arbovirusEnviromentalSuitabilityDataQuery {
    arbovirusEnviromentalSuitabilityData {
      __typename
      id
      countryAlphaThreeCode
      zikaData {
        __typename
        minimumValue
        maximumValue
        valueRange
        meanValue
        medianValue
        ninetyPercentOfValuesAreBelowThisValue
      }
      dengue2015Data {
        __typename
        minimumValue
        maximumValue
        valueRange
        meanValue
        medianValue
        ninetyPercentOfValuesAreBelowThisValue
      }
      dengue2050Data {
        __typename
        minimumValue
        maximumValue
        valueRange
        meanValue
        medianValue
        ninetyPercentOfValuesAreBelowThisValue
      }
    }
  }
`

export function useArboEnviromentalSuitabilityData() {
  return useQuery<ArbovirusEnviromentalSuitabilityDataQueryQuery>({
    queryKey: ["arbovirusEnviromentalSuitabilityDataQuery"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', arbovirusEnviromentalSuitabilityDataQuery)
  });
}
