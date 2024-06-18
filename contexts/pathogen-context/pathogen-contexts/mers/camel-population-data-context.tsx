"use client";
import React, { createContext, useMemo } from "react";
import uniq from 'lodash/uniq'
import { useFaoYearlyCamelPopulationData } from "@/hooks/mers/useFaoYearlyCamelPopulationData";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { typedObjectFromEntries } from "@/lib/utils";

interface GetLatestCamelPopulationEstimateByCountryInput {
  countryAlphaThreeCode: string;
}

interface CamelPopulationDataContextType {
  yearlyFaoCamelPopulationData: FaoYearlyCamelPopulationDataEntry[] | undefined;
  getLatestCamelPopulationEstimateByCountry: (input: GetLatestCamelPopulationEstimateByCountryInput) => FaoYearlyCamelPopulationDataEntry | undefined;
}

const initialCamelPopulationDataContext = {
  yearlyFaoCamelPopulationData: undefined,
  getLatestCamelPopulationEstimateByCountry: () => undefined
};

export const CamelPopulationDataContext = createContext<
  CamelPopulationDataContextType
>(initialCamelPopulationDataContext);

interface CamelPopulationDataProviderProps {
  children: React.ReactNode;
}

export const CamelPopulationDataProvider = (props: CamelPopulationDataProviderProps) => {
  const { yearlyFaoCamelPopulationData } = useFaoYearlyCamelPopulationData();

  const latestFaoCamelPopulationDataPointByCountryAlphaThreeCode: Record<string, FaoYearlyCamelPopulationDataEntry | undefined> = useMemo(() => {
    if( yearlyFaoCamelPopulationData === undefined) {
      return {}
    }

    const allCountryAlphaThreeCodes = uniq(yearlyFaoCamelPopulationData.map((element) => element.countryAlphaThreeCode));

    const sortedYearlyFaoCamelPopulationData = [...yearlyFaoCamelPopulationData].sort((a, b) => b.year - a.year);

    return typedObjectFromEntries(allCountryAlphaThreeCodes
      .map((alphaThreeCode) => [
        alphaThreeCode,
        sortedYearlyFaoCamelPopulationData
          .filter((element) => element.countryAlphaThreeCode === alphaThreeCode)
          .at(0)
      ])
    )
  }, [yearlyFaoCamelPopulationData])

  return (
    <CamelPopulationDataContext.Provider
      value={{
        yearlyFaoCamelPopulationData: yearlyFaoCamelPopulationData,
        getLatestCamelPopulationEstimateByCountry: ({ countryAlphaThreeCode }) =>
          latestFaoCamelPopulationDataPointByCountryAlphaThreeCode[countryAlphaThreeCode]
      }}
    >
      {props.children}
    </CamelPopulationDataContext.Provider>
  );
}