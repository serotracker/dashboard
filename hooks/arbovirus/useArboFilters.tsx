import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { ArbovirusFilterOptionsQuery } from "@/gql/graphql";

export const arbovirusFiltersQuery = gql`
  query arbovirusFilterOptions {
    arbovirusFilterOptions {
      ageGroup
      antibody
      assay
      pathogen
      pediatricAgeGroup
      producer
      sampleFrame
      serotype
      sex
      unRegion
      whoRegion
      countryIdentifiers {
        name
        alphaTwoCode
        alphaThreeCode
      }
      studyPopulation
    }
  }
`

export function useArboFilters() {
  const { data: rawData, ...result } = useQuery<ArbovirusFilterOptionsQuery>({
    queryKey: ["arbovirusFiltersQuery"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', arbovirusFiltersQuery)
  });

  const oropoucheEnabled = process.env.NEXT_PUBLIC_OROPOUCHE_ENABLED === 'true';

  const data = useMemo(() => (rawData && oropoucheEnabled === false) ? {
    ...rawData,
    arbovirusFilterOptions: {
      ...rawData.arbovirusFilterOptions,
      pathogen: rawData.arbovirusFilterOptions.pathogen.filter((pathogen) => pathogen !== 'OROV')
    }
  } : rawData, [ rawData, oropoucheEnabled ]);

  return {
    result,
    data
  }
}
