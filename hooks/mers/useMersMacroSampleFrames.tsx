import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { MersMacroSampleFramesQuery } from "@/gql/graphql";

export const mersMacroSampleFrames = gql`
  query mersMacroSampleFrames {
    mersMacroSampleFrames {
      __typename
      id
      macroSampleFrame
      sampleFrames
    }
  }
`

export const useMersMacroSampleFrames = () => {
  return useQuery<MersMacroSampleFramesQuery>({
    queryKey: ["mersMacroSampleFrames"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', mersMacroSampleFrames)
  });
}
