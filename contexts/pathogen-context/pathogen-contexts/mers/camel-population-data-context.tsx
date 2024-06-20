"use client";
import React, { createContext, useMemo } from "react";
import uniq from 'lodash/uniq'
import { useFaoYearlyCamelPopulationData } from "@/hooks/mers/useFaoYearlyCamelPopulationData";
import { FaoYearlyCamelPopulationDataEntry } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { typedObjectFromEntries } from "@/lib/utils";

interface CamelPopulationDataContextType {
  yearlyFaoCamelPopulationData: FaoYearlyCamelPopulationDataEntry[] | undefined;
  latestFaoCamelPopulationDataPointsByCountry: FaoYearlyCamelPopulationDataEntry[] | undefined;
}

const initialCamelPopulationDataContext = {
  yearlyFaoCamelPopulationData: undefined,
  latestFaoCamelPopulationDataPointsByCountry: undefined,
};

export const CamelPopulationDataContext = createContext<
  CamelPopulationDataContextType
>(initialCamelPopulationDataContext);

interface CamelPopulationDataProviderProps {
  children: React.ReactNode;
}

export const CamelPopulationDataProvider = (props: CamelPopulationDataProviderProps) => {
  const { yearlyFaoCamelPopulationData } = useFaoYearlyCamelPopulationData();

  const latestFaoCamelPopulationDataPointsByCountry = useMemo(() => {
    if( yearlyFaoCamelPopulationData === undefined) {
      return undefined;
    }

    const allCountryAlphaThreeCodes = uniq(yearlyFaoCamelPopulationData.map((element) => element.countryAlphaThreeCode));

    const sortedYearlyFaoCamelPopulationData = [...yearlyFaoCamelPopulationData].sort((a, b) => b.year - a.year);

    return allCountryAlphaThreeCodes
      .map((alphaThreeCode) => sortedYearlyFaoCamelPopulationData
        .filter((element) => element.countryAlphaThreeCode === alphaThreeCode)
        .at(0)
      )
      .filter(<T extends unknown>(element: T | undefined): element is T => !!element)
  }, [yearlyFaoCamelPopulationData]);

  return (
    <CamelPopulationDataContext.Provider
      value={{
        yearlyFaoCamelPopulationData: yearlyFaoCamelPopulationData,
        latestFaoCamelPopulationDataPointsByCountry,
      }}
    >
      {props.children}
    </CamelPopulationDataContext.Provider>
  );
}