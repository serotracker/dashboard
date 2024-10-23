import { useMemo } from 'react'
import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { Arbovirus, ArbovirusEstimatesQueryQuery, ArbovirusEstimateType } from "@/gql/graphql";

export const arbovirusEstimatesQuery = gql`
  query arbovirusEstimatesQuery {
    arbovirusEstimates {
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
    }
  }
`

export function useArboData() {
  const { data: rawData, ...result } = useQuery<ArbovirusEstimatesQueryQuery>({
    queryKey: ["arbovirusEstimatesQuery"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', arbovirusEstimatesQuery)
  });

  const oropoucheEnabled = process.env.NEXT_PUBLIC_OROPOUCHE_ENABLED === 'true';

  const data = useMemo(() => {
    if(!rawData) {
      return rawData
    }

    if(!oropoucheEnabled) {
      return {
        ...rawData,
        arbovirusEstimates: rawData.arbovirusEstimates
          .filter((element) => element.pathogen !== Arbovirus.Orov)
          .filter((element) => element.estimateType === ArbovirusEstimateType.Seroprevalence)
      }
    }

    return {
      ...rawData,
      arbovirusEstimates: rawData.arbovirusEstimates
        .filter((element) => element.estimateType === ArbovirusEstimateType.Seroprevalence)
    }
  }, [ rawData, oropoucheEnabled ]);

  return {
    result,
    data
  }
}
