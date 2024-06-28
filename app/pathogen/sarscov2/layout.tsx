import React from "react";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/components/customs/getQueryClient";
import { request } from 'graphql-request';
import { notFound } from 'next/navigation'
import { GenericPathogenPageLayout } from "../generic-pathogen-page-layout";
import { SarsCov2Providers } from "@/contexts/pathogen-context/pathogen-contexts/sc2-context";
import { sarsCov2Estimates } from "@/hooks/sarscov2/useSarsCov2Data";
import { sarsCov2Filters } from "@/hooks/sarscov2/useSarsCov2Filters";
import { monthlySarsCov2CountryInformation } from "@/hooks/sarscov2/useMonthlySarsCov2CountryInformation";

export default async function SarsCov2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["sarsCov2Estimates"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', sarsCov2Estimates)
  });
  await queryClient.prefetchQuery({
    queryKey: ["monthlySarsCov2CountryInformation"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', monthlySarsCov2CountryInformation)
  });
  await queryClient.prefetchQuery({
    queryKey: ["sarsCov2FilterOptions"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', sarsCov2Filters)
  });

  const dehydratedState = dehydrate(queryClient);

  if(!process.env.NEXT_PUBLIC_SARS_COV_2_TRACKER_ENABLED) {
    return notFound();
  }

  return (
    <GenericPathogenPageLayout>
      <SarsCov2Providers>
        <Hydrate state={dehydratedState}>{children}</Hydrate>
      </SarsCov2Providers>
    </GenericPathogenPageLayout>
  );
}
