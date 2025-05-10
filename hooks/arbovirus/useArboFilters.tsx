import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { GroupedArbovirusEstimateFilterOptionsQueryQuery } from "@/gql/graphql";

export const groupedArbovirusEstimateFilterOptionsQuery = gql`
  query groupedArbovirusEstimateFilterOptionsQuery {
    groupedArbovirusEstimateFilterOptions {
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
  const { data: rawData, ...result } = useQuery<GroupedArbovirusEstimateFilterOptionsQueryQuery>({
    queryKey: ["groupedArbovirusEstimateFilterOptionsQuery"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', groupedArbovirusEstimateFilterOptionsQuery)
  });

  const oropoucheEnabled = process.env.NEXT_PUBLIC_OROPOUCHE_ENABLED === 'true';

  const data = useMemo(() => {
    if(!rawData) {
      return rawData
    }

    if(oropoucheEnabled === false ) {
      return {
        ...rawData,
        arbovirusFilterOptions: {
          ...rawData.groupedArbovirusEstimateFilterOptions,
          pathogen: rawData.groupedArbovirusEstimateFilterOptions.pathogen.filter((pathogen) => pathogen !== 'OROV')
        }
      }
    }

    return {
      ...rawData,
      arbovirusFilterOptions: rawData.groupedArbovirusEstimateFilterOptions
    }
  }, [ rawData, oropoucheEnabled ]);

  return {
    result,
    data
  }
}
