"use client"
import { distinctBackgroundColoursMap, typedObjectFromEntries } from "@/lib/utils";
import { pipe } from "fp-ts/lib/function";
import React, { useMemo, createContext, useContext, useEffect } from "react";

export type CountryDataContextType = Array<{
  countryName: string,
  countryAlphaTwoCode: string,
  countryAlphaThreeCode: string
}>

const initialCountryDataContext: CountryDataContextType = []

export const CountryDataContext = createContext<CountryDataContextType>(initialCountryDataContext);

interface CountryInformationContextType {
  countryAlphaTwoCodeToCountryNameMap: Record<string, string | undefined>;
  countryAlphaThreeCodeToCountryNameMap: Record<string, string | undefined>;
  countryNameToColourClassnameMap: Record<string, string | undefined>;
}

const initialCountryInformationContext: CountryInformationContextType = {
  countryAlphaTwoCodeToCountryNameMap: {},
  countryAlphaThreeCodeToCountryNameMap: {},
  countryNameToColourClassnameMap: {}
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

  const countryNameToColourClassnameMap: Record<string, string | undefined> = useMemo(() => pipe(
    countryData,
    (context) => context
      .map((element, index) => ({
        ...element,
        colourClassname: distinctBackgroundColoursMap[index % Object.keys(distinctBackgroundColoursMap).length]
      }))
      .filter((element): element is Omit<typeof element, 'colourClassname'> & {
        colourClassname: NonNullable<typeof element['colourClassname']>
      } => !!element.colourClassname)
      .map((element): [string, string] => [element.countryName, element.colourClassname]),
    (context) => typedObjectFromEntries(context)
  ), [ countryData ]);

  return (
    <CountryInformationContext.Provider
      value={{
        countryAlphaTwoCodeToCountryNameMap,
        countryAlphaThreeCodeToCountryNameMap,
        countryNameToColourClassnameMap
      }}
    >
      {props.children}
    </CountryInformationContext.Provider>
  );
}
