import { useArboEnviromentalSuitabilityData } from "@/hooks/arbovirus/useArboEnviromentalSuitabilityData";
import { pipe } from "fp-ts/lib/function";
import { createContext, useMemo } from "react";

export enum ArbovirusEnvironmentalSuitabilityMaps {
  ZIKA = 'ZIKA',
  DENGUE_2015 = 'DENGUE_2015',
  DENGUE_2050 = 'DENGUE_2050'
}

export interface ArbovirusEnvironmentalSuitabilityCountryDataContextType {
  arbovirusEnvironmentalSuitabilityCountryData: Array<{
    environmentalSuitabilityMap: ArbovirusEnvironmentalSuitabilityMaps;
    countryAlphaThreeCode: string;
    data: {
      minimumValue: number;
      maximumValue: number;
      valueRange: number;
      meanValue: number;
      medianValue: number;
      ninetyPercentOfValuesAreBelowThisValue: number;
    }
  }>
}

const initialArbovirusEnvironmentalSuitabilityCountryDataContext = {
  arbovirusEnvironmentalSuitabilityCountryData: [],
};

export const ArbovirusEnvironmentalSuitabilityCountryDataContext = createContext<
  ArbovirusEnvironmentalSuitabilityCountryDataContextType
>(initialArbovirusEnvironmentalSuitabilityCountryDataContext);

interface ArbovirusEnvironmentalSuitabilityMapCountryDataProviderProps {
  children: React.ReactNode;
}

export const ArbovirusEnvironmentalSuitabilityCountryDataProvider = (props: ArbovirusEnvironmentalSuitabilityMapCountryDataProviderProps) => {
  const { data } = useArboEnviromentalSuitabilityData();

  const arbovirusEnvironmentalSuitabilityCountryData = useMemo(() => pipe(
    data?.arbovirusEnviromentalSuitabilityData ?? [],
    (queryData) => queryData.flatMap((dataPoint) => [{
      environmentalSuitabilityMap: ArbovirusEnvironmentalSuitabilityMaps.ZIKA,
      countryAlphaThreeCode: dataPoint.countryAlphaThreeCode,
      data: {
        minimumValue: dataPoint.zikaData.minimumValue,
        maximumValue: dataPoint.zikaData.maximumValue,
        valueRange: dataPoint.zikaData.valueRange,
        meanValue: dataPoint.zikaData.meanValue,
        medianValue: dataPoint.zikaData.medianValue,
        ninetyPercentOfValuesAreBelowThisValue: dataPoint.zikaData.ninetyPercentOfValuesAreBelowThisValue
      }
    }, {
      environmentalSuitabilityMap: ArbovirusEnvironmentalSuitabilityMaps.DENGUE_2015,
      countryAlphaThreeCode: dataPoint.countryAlphaThreeCode,
      data: {
        minimumValue: dataPoint.dengue2015Data.minimumValue,
        maximumValue: dataPoint.dengue2015Data.maximumValue,
        valueRange: dataPoint.dengue2015Data.valueRange,
        meanValue: dataPoint.dengue2015Data.meanValue,
        medianValue: dataPoint.dengue2015Data.medianValue,
        ninetyPercentOfValuesAreBelowThisValue: dataPoint.dengue2015Data.ninetyPercentOfValuesAreBelowThisValue
      }
    }, {
      environmentalSuitabilityMap: ArbovirusEnvironmentalSuitabilityMaps.DENGUE_2050,
      countryAlphaThreeCode: dataPoint.countryAlphaThreeCode,
      data: {
        minimumValue: dataPoint.dengue2050Data.minimumValue,
        maximumValue: dataPoint.dengue2050Data.maximumValue,
        valueRange: dataPoint.dengue2050Data.valueRange,
        meanValue: dataPoint.dengue2050Data.meanValue,
        medianValue: dataPoint.dengue2050Data.medianValue,
        ninetyPercentOfValuesAreBelowThisValue: dataPoint.dengue2050Data.ninetyPercentOfValuesAreBelowThisValue
      }
    }])
  ), [ data ])
  return (
    <ArbovirusEnvironmentalSuitabilityCountryDataContext.Provider
      value={{
        arbovirusEnvironmentalSuitabilityCountryData
      }}
    >
      {props.children}
    </ArbovirusEnvironmentalSuitabilityCountryDataContext.Provider>
  );
}