"use client";
import React, { createContext } from "react";
import { MonthlySarsCov2CountryInformationQuery } from "@/gql/graphql";
import { useMonthlySarsCov2CountryInformation } from "@/hooks/sarscov2/useMonthlySarsCov2CountryInformation";

interface MonthlySarsCov2CountryInformationContextType {
  monthlySarsCov2CountryInformation: MonthlySarsCov2CountryInformationQuery | undefined;
}

const initialMonthlySarsCov2CountryInformationContext = {
  monthlySarsCov2CountryInformation: undefined
};

export const MonthlySarsCov2CountryInformationContext = createContext<
  MonthlySarsCov2CountryInformationContextType
>(initialMonthlySarsCov2CountryInformationContext);

interface MonthlySarsCov2CountryInformationProviderProps {
  children: React.ReactNode;
}

export const MonthlySarsCov2CountryInformationProvider = (props: MonthlySarsCov2CountryInformationProviderProps) => {
  const { data } = useMonthlySarsCov2CountryInformation();

  return (
    <MonthlySarsCov2CountryInformationContext.Provider
      value={{
        monthlySarsCov2CountryInformation: data
      }}
    >
      {props.children}
    </MonthlySarsCov2CountryInformationContext.Provider>
  );
}