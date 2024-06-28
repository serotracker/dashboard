"use client";
import React, { createContext, useMemo } from "react";
import { Month, MonthlySarsCov2CountryInformationQuery } from "@/gql/graphql";
import { useMonthlySarsCov2CountryInformation } from "@/hooks/sarscov2/useMonthlySarsCov2CountryInformation";
import { groupByArray } from "@/lib/utils";

export type LookupOptimizedSarsCov2CountryInformation = Array<{
  alphaTwoCode: string,
  data: Array<{
    year: number,
    data: Array<{
      month: string,
      data: Array<Omit<
        MonthlySarsCov2CountryInformationQuery['monthlySarsCov2CountryInformation'][number],
        'alphaTwoCode'|'year'|'month'
      >>
    }>
  }>
}>;

interface MonthlySarsCov2CountryInformationContextType {
  monthlySarsCov2CountryInformation: MonthlySarsCov2CountryInformationQuery | undefined;
  lookupOptimizedSarsCov2CountryInformation: LookupOptimizedSarsCov2CountryInformation | undefined;
}

const initialMonthlySarsCov2CountryInformationContext = {
  monthlySarsCov2CountryInformation: undefined,
  lookupOptimizedSarsCov2CountryInformation: undefined
};

export const MonthlySarsCov2CountryInformationContext = createContext<
  MonthlySarsCov2CountryInformationContextType
>(initialMonthlySarsCov2CountryInformationContext);

interface MonthlySarsCov2CountryInformationProviderProps {
  children: React.ReactNode;
}

export const MonthlySarsCov2CountryInformationProvider = (props: MonthlySarsCov2CountryInformationProviderProps) => {
  const { data } = useMonthlySarsCov2CountryInformation();

  const lookupOptimizedSarsCov2CountryInformation = useMemo(() => {
    if(data === undefined) {
      return undefined;
    }  
    
    return groupByArray(
      data.monthlySarsCov2CountryInformation.map((data) => ({
        ...data,
        year: data.year.toString(),
      })),
      "alphaTwoCode"
    ).map(({ alphaTwoCode, data }) => ({
      alphaTwoCode,
      data: groupByArray(data, "year").map(({ year, data }) => ({
        year: parseInt(year),
        data: groupByArray(data, "month")
      })),
    }));
  }, [data])

  return (
    <MonthlySarsCov2CountryInformationContext.Provider
      value={{
        monthlySarsCov2CountryInformation: data,
        lookupOptimizedSarsCov2CountryInformation
      }}
    >
      {props.children}
    </MonthlySarsCov2CountryInformationContext.Provider>
  );
}