import React from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/components/customs/getQueryClient";
import { request } from 'graphql-request';
import { arbovirusEstimatesQuery } from "@/hooks/arbovirus/useArboData";
import { groupedArbovirusEstimatesQuery } from "@/hooks/arbovirus/useGroupedArboData";
import { arbovirusFiltersQuery } from "@/hooks/arbovirus/useArboFilters";
import { ArboProviders } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { GenericPathogenPageLayout } from "../generic-pathogen-page-layout";
import { arbovirusEnviromentalSuitabilityDataQuery } from "@/hooks/arbovirus/useArboEnviromentalSuitabilityData";

export default async function ArboLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["arbovirusEstimatesQuery"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', arbovirusEstimatesQuery)
  });
  await queryClient.prefetchQuery({
    queryKey: ["groupedArbovirusEstimatesQuery"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', groupedArbovirusEstimatesQuery)
  });
  await queryClient.prefetchQuery({
    queryKey: ["arbovirusFiltersQuery"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', arbovirusFiltersQuery)
  });
  await queryClient.prefetchQuery({
    queryKey: ["arbovirusEnviromentalSuitabilityDataQuery"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', arbovirusEnviromentalSuitabilityDataQuery)
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <GenericPathogenPageLayout>
      <ArboProviders>
        <HydrationBoundary state={dehydratedState}>
          {children}
        </HydrationBoundary>
      </ArboProviders>
    </GenericPathogenPageLayout>
  );
}
