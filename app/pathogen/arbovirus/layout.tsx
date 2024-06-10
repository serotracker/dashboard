import React from "react";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/components/customs/getQueryClient";
import { request } from 'graphql-request';
import { arbovirusEstimatesQuery } from "@/hooks/arbovirus/useArboData";
import { arbovirusFiltersQuery } from "@/hooks/arbovirus/useArboFilters";
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
    queryFn: () => request('https://iit-backend-v2-git-issue-370-add-partitioned-aad1f1-serotracker.vercel.app/api/graphql' ?? '', arbovirusEstimatesQuery)
  });
  await queryClient.prefetchQuery({
    queryKey: ["arbovirusFiltersQuery"],
    queryFn: () => request('https://iit-backend-v2-git-issue-370-add-partitioned-aad1f1-serotracker.vercel.app/api/graphql' ?? '', arbovirusFiltersQuery)
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
