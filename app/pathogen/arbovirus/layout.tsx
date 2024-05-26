import React from "react";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/components/customs/getQueryClient";
import { request } from 'graphql-request';
import { arbovirusEstimatesQuery } from "@/hooks/useArboData";
import { arbovirusFiltersQuery } from "@/hooks/useArboFilters";
import { ArboProviders } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";
import { GenericPathogenPageLayout } from "../generic-pathogen-page-layout";

export default async function ArboLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["arbovirusEstimatesQuery"],
    queryFn: () => request('http://99.79.39.159:3000/api/graphql' ?? '', arbovirusEstimatesQuery)
  });
  await queryClient.prefetchQuery({
    queryKey: ["arbovirusFiltersQuery"],
    queryFn: () => request('http://99.79.39.159:3000/api/graphql' ?? '', arbovirusFiltersQuery)
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <GenericPathogenPageLayout>
      <ArboProviders>
        <Hydrate state={dehydratedState}>{children}</Hydrate>
      </ArboProviders>
    </GenericPathogenPageLayout>
  );
}
