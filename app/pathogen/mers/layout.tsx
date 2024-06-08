import React from "react";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/components/customs/getQueryClient";
import { request } from 'graphql-request';
import { notFound } from 'next/navigation'
import { GenericPathogenPageLayout } from "../generic-pathogen-page-layout";
import { mersEstimates } from "@/hooks/mers/useMersData";
import { MersProviders } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { mersFilters } from "@/hooks/mers/useMersFilters";

export default async function MersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["mersEstimates"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', mersEstimates)
  });
  await queryClient.prefetchQuery({
    queryKey: ["mersFilterOptions"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', mersFilters)
  });

  const dehydratedState = dehydrate(queryClient);

  if(!process.env.NEXT_PUBLIC_MERS_TRACKER_ENABLED) {
    return notFound();
  }

  return (
    <GenericPathogenPageLayout>
      <MersProviders>
        <Hydrate state={dehydratedState}>{children}</Hydrate>
      </MersProviders>
    </GenericPathogenPageLayout>
  );
}
