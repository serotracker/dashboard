"use client"
import React, { useMemo, useCallback, createContext, Context, useContext } from "react";
import { typedGroupBy, typedObjectEntries, typedObjectFromEntries } from "@/lib/utils";
import * as RadixUIToast from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";
import { Toast } from "@/components/customs/toast";
import { Breakpoint, useBreakpoint } from "@/hooks/useBreakpoint";
import { PathogenContextType } from "./pathogen-context";
import { UseQueryResult } from "@tanstack/react-query";

type CountryDataContextType = Array<{
  countryName: string,
  countryAlphaTwoCode: string,
  countryAlphaThreeCode: string
}>

const initialCountryDataContext: CountryDataContextType = []

export const CountryDataContext = createContext<CountryDataContextType>(initialCountryDataContext);

interface CountryInformationContextType {
  countryAlphaTwoCodeToCountryNameMap: Record<string, string | undefined>;
  countryAlphaThreeCodeToCountryNameMap: Record<string, string | undefined>;
}

const initialCountryInformationContext: CountryInformationContextType = {
  countryAlphaTwoCodeToCountryNameMap: {},
  countryAlphaThreeCodeToCountryNameMap: {}
}

export const CountryInformationContext = createContext<CountryInformationContextType>(initialCountryInformationContext);

interface CountryInformationProviderProps {
  children: React.ReactNode,
}

export function CountryInformationProvider(props: CountryInformationProviderProps) {
  const countryData = useContext(CountryDataContext);

  const countryAlphaTwoCodeToCountryNameMap = useMemo(() => 
    countryData.reduce((accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.countryAlphaTwoCode]: currentValue.countryName
    }), {}),
    [countryData]
  );

  const countryAlphaThreeCodeToCountryNameMap = useMemo(() => 
    countryData.reduce((accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.countryAlphaThreeCode]: currentValue.countryName
    }), {}),
    [countryData]
  );

  return (
    <CountryInformationContext.Provider
      value={{
        countryAlphaTwoCodeToCountryNameMap,
        countryAlphaThreeCodeToCountryNameMap
      }}
    >
      {props.children}
    </CountryInformationContext.Provider>
  );
}
