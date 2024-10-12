import { useQueries } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { MersWhoCaseDataQuery, MersWhoCaseDataQueryVariables } from "@/gql/graphql";

export type MersWhoCaseDataEntry = MersWhoCaseDataQuery['mersWhoCaseData']['mersWhoCaseData'][number];

export const mersWhoCaseData = gql`
  query mersWhoCaseData($input: MersWhoCaseDataInput!) {
    mersWhoCaseData(input: $input) {
      partitionKey
      mersWhoCaseData {
        id
        country {
          alphaThreeCode
          alphaTwoCode
          name
        }
        positiveCasesReported
        whoRegion
        unRegion
      }
    }
  }
`

interface UseMersWhoCaseDataPartitioned {
  partitionKeys: number[];
}

export function useMersWhoCaseDataPartitioned(input: UseMersWhoCaseDataPartitioned) {
  return useQueries({
    queries: input.partitionKeys.map(( partitionKey ) =>  ({
      queryKey: ["mersWhoCaseData", partitionKey.toString()],
      queryFn: () => request<MersWhoCaseDataQuery, MersWhoCaseDataQueryVariables>(
        process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '',
        mersWhoCaseData,
        { input: { partitionKey } }
      ),
    }))
  });
}