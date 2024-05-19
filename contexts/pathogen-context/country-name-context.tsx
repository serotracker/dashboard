"use client"
import React, { useMemo, useCallback, createContext, Context } from "react";
import { typedGroupBy, typedObjectEntries, typedObjectFromEntries } from "@/lib/utils";
import * as RadixUIToast from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";
import { Toast } from "@/components/customs/toast";
import { Breakpoint, useBreakpoint } from "@/hooks/useBreakpoint";
import { PathogenContextType } from "./pathogen-context";
import { UseQueryResult } from "@tanstack/react-query";

interface CountryNameContextType {
  countryAlphaTwoCodeToCountryInformationMap: Record<string, {
    countryName: string,
    countryAlphaTwoCode: string,
    countryAlphaThreeCode: string
  } | undefined>,
  countryAlphaThreeCodeToCountryInformationMap: Record<string, {
    countryName: string,
    countryAlphaTwoCode: string,
    countryAlphaThreeCode: string
  } | undefined>
}

const initialToastContext: CountryNameContextType = {
  countryAlphaTwoCodeToCountryInformationMap: {},
  countryAlphaThreeCodeToCountryInformationMap: {}
}

export const CountryNameContext = createContext<CountryNameContextType>(initialToastContext);

interface CountryNameProviderProps {
  children: React.ReactNode,
  getCountryData: () => Array<{countryName: string, countryAlphaTwoCode: string, countryAlphaThreeCode: string}>
}

export function CountryNameProvider(props: CountryNameProviderProps) {
  const countryData = useMemo(() => props.getCountryData(), []);

  const countryAlphaTwoCodeToCountryInformationMap = useMemo(() => 
    countryData.reduce((accumulator, currentValue) => ({...accumulator, [currentValue.countryAlphaTwoCode]: {
      countryName: currentValue.countryName,
      countryAlphaTwoCode: currentValue.countryAlphaTwoCode,
      countryAlphaThreeCode: currentValue.countryAlphaThreeCode
    }}), {}),
    [countryData]
  );

  const countryAlphaThreeCodeToCountryInformationMap = useMemo(() => 
    countryData.reduce((accumulator, currentValue) => ({...accumulator, [currentValue.countryAlphaThreeCode]: {
      countryName: currentValue.countryName,
      countryAlphaTwoCode: currentValue.countryAlphaTwoCode,
      countryAlphaThreeCode: currentValue.countryAlphaThreeCode
    }}), {}),
    [countryData]
  );

  return (
    <CountryNameContext.Provider
      value={{
        countryAlphaTwoCodeToCountryInformationMap,
        countryAlphaThreeCodeToCountryInformationMap
      }}
    >
      {props.children}
    </CountryNameContext.Provider>
  );
}
