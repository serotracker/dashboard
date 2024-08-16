import { useMemo } from "react";
import { MersEstimate, MersEvent } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { MersDiagnosisStatus } from "@/gql/graphql";

interface UseMersMapDataPointsInput {
  filteredData: MersEstimate[];
  faoMersEventData: MersEvent[];
  estimateDataShown: boolean;
  eventDataShown: boolean;
}

export const useMersMapDataPoints = (input: UseMersMapDataPointsInput) => {
  const { filteredData, faoMersEventData, estimateDataShown, eventDataShown } = input;

  const dataPoints = useMemo(() => {
    const mersEstimateData = filteredData
      .map((element) => ({
        ...element,
        country: element.primaryEstimateInfo.country,
        countryAlphaThreeCode: element.primaryEstimateInfo.countryAlphaThreeCode,
        countryAlphaTwoCode: element.primaryEstimateInfo.countryAlphaTwoCode,
        latitude: element.primaryEstimateInfo.latitude,
        longitude: element.primaryEstimateInfo.longitude,
        primaryEstimateInfoTypename: element.primaryEstimateInfo.__typename
      }));
    const mersEventData = faoMersEventData
      .map((element) => ({
        ...element,
        country: element.country.name,
        countryAlphaThreeCode: element.country.alphaThreeCode,
        countryAlphaTwoCode: element.country.alphaTwoCode,
        primaryEstimateInfoTypename: 'N/A'
      }))
      .filter((element) => element.diagnosisStatus === MersDiagnosisStatus.Confirmed);


    return [
      ...(estimateDataShown ? mersEstimateData : []),
      ...(eventDataShown ? mersEventData : [])
    ];
  }, [ filteredData, faoMersEventData, estimateDataShown, eventDataShown ]);
  
  return {
    dataPoints
  }
}