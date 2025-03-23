import { useMemo } from 'react'
import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { Arbovirus, ArbovirusEstimateType, GroupedArbovirusEstimatesQueryQuery } from "@/gql/graphql";

export const groupedArbovirusEstimatesQuery = gql`
  query groupedArbovirusEstimatesQuery {
    groupedArbovirusEstimates {
      id
      shownEstimates {
        estimateType
        ageGroup
        ageMaximum
        ageMinimum
        antibodies
        antigen
        assay
        assayOther
        city
        state
        country
        countryAlphaTwoCode
        countryAlphaThreeCode
        createdAt
        estimateId
        id
        inclusionCriteria
        latitude
        longitude
        pathogen
        pediatricAgeGroup
        producer
        producerOther
        sameFrameTargetGroup
        sampleEndDate
        sampleFrame
        sampleNumerator
        sampleSize
        sampleStartDate
        seroprevalence
        seroprevalenceStudy95CILower
        seroprevalenceStudy95CIUpper
        seroprevalenceCalculated95CILower
        seroprevalenceCalculated95CIUpper
        serotype
        sex
        sourceSheetId
        sourceSheetName
        unRegion
        url
        whoRegion
        studyPopulation
        studySpecies
      }
      hiddenEstimates {
        estimateType
        ageGroup
        ageMaximum
        ageMinimum
        antibodies
        antigen
        assay
        assayOther
        city
        state
        country
        countryAlphaTwoCode
        countryAlphaThreeCode
        createdAt
        estimateId
        id
        inclusionCriteria
        latitude
        longitude
        pathogen
        pediatricAgeGroup
        producer
        producerOther
        sameFrameTargetGroup
        sampleEndDate
        sampleFrame
        sampleNumerator
        sampleSize
        sampleStartDate
        seroprevalence
        seroprevalenceStudy95CILower
        seroprevalenceStudy95CIUpper
        seroprevalenceCalculated95CILower
        seroprevalenceCalculated95CIUpper
        serotype
        sex
        sourceSheetId
        sourceSheetName
        unRegion
        url
        whoRegion
        studyPopulation
        studySpecies
        groupingVariable
      }
    }
  }
`

export function useGroupedArboData() {
  const { data: rawData, ...result } = useQuery<GroupedArbovirusEstimatesQueryQuery>({
    queryKey: ["groupedArbovirusEstimatesQuery"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', groupedArbovirusEstimatesQuery)
  });

  const oropoucheEnabled = process.env.NEXT_PUBLIC_OROPOUCHE_ENABLED === 'true';

  const data = useMemo(() => {
    const flattenedData = rawData?.groupedArbovirusEstimates.flatMap((groupedArbovirusEstimate) => [
      ...groupedArbovirusEstimate.shownEstimates.map((estimate) => ({
        ...estimate,
        includedInMap: true,
      })),
      ...groupedArbovirusEstimate.hiddenEstimates.map((estimate) => ({
        ...estimate,
        includedInMap: false,
      })),
    ]);

    if(!flattenedData) {
      return flattenedData
    }

    if(!oropoucheEnabled) {
      return { arbovirusEstimates: flattenedData.filter((estimate) => estimate.pathogen !== Arbovirus.Orov) };
    }

    return { arbovirusEstimates: flattenedData };
  }, [ rawData, oropoucheEnabled ]);

  return {
    result,
    data
  }
}
