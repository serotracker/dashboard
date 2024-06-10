"use client";
import React, { createContext, useMemo } from "react";
import { PartitionedMonthlySarsCov2CountryInformationQuery } from "@/gql/graphql";
import { useMonthlySarsCov2CountryInformation } from "@/hooks/sarscov2/useMonthlySarsCov2CountryInformation";
import { groupByArray } from "@/lib/utils";
import { useMonthlySarsCov2CountryInformationPartitionKeys } from "@/hooks/sarscov2/useMonthlySarsCov2CountryInformationPartitionKeys";
import { useMonthlySarsCov2CountryInformationPartitioned } from "@/hooks/sarscov2/useMonthlySarsCov2CountryInformationPartitioned";

export type LookupOptimizedSarsCov2CountryInformation = Array<{
  alphaTwoCode: string,
  data: Array<{
    year: number,
    data: Array<{
      month: string,
      data: Array<Omit<
        PartitionedMonthlySarsCov2CountryInformationQuery[
          'partitionedMonthlySarsCov2CountryInformation'
        ]['monthlySarsCov2CountryInformation'][number],
        'alphaTwoCode'|'year'|'month'
      >>
    }>
  }>
}>;

interface MonthlySarsCov2CountryInformationContextType {
  monthlySarsCov2CountryInformation: PartitionedMonthlySarsCov2CountryInformationQuery[
    'partitionedMonthlySarsCov2CountryInformation'
  ]['monthlySarsCov2CountryInformation'] | undefined;
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

const isEveryElementInArrayDefined = <T extends unknown>(array: Array<T | undefined>): array is Array<T> =>
  array.every((element) => !!element);

export const MonthlySarsCov2CountryInformationProvider = (props: MonthlySarsCov2CountryInformationProviderProps) => {
  const { data: partitionKeyData } = useMonthlySarsCov2CountryInformationPartitionKeys();
  const partitionedData = useMonthlySarsCov2CountryInformationPartitioned({ partitionKeys: partitionKeyData?.allMonthlySarsCov2CountryInformationPartitionKeys ?? [] });

  const data = useMemo(() => partitionedData.flatMap((element) =>
    element.data?.partitionedMonthlySarsCov2CountryInformation.monthlySarsCov2CountryInformation)
  , [partitionedData])

  const lookupOptimizedSarsCov2CountryInformation = useMemo(() => {
    if(isEveryElementInArrayDefined(data)) {
      return groupByArray(
        data.map((data) => ({
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
    }
  }, [data])

  return (
    <MonthlySarsCov2CountryInformationContext.Provider
      value={{
        monthlySarsCov2CountryInformation: isEveryElementInArrayDefined(data) ? data : [],
        lookupOptimizedSarsCov2CountryInformation
      }}
    >
      {props.children}
    </MonthlySarsCov2CountryInformationContext.Provider>
  );
}