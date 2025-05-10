import React from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/components/customs/getQueryClient";
import { request } from 'graphql-request';
import { arbovirusEstimatesQuery } from "@/hooks/arbovirus/useArboData";
import { groupedArbovirusEstimateFilterOptionsQuery } from "@/hooks/arbovirus/useArboFilters";
import { ArboProviders } from "@/contexts/pathogen-context/pathogen-contexts/arbovirus/arbo-context";
import { GenericPathogenPageLayout } from "../generic-pathogen-page-layout";
import { arbovirusEnviromentalSuitabilityDataQuery } from "@/hooks/arbovirus/useArboEnviromentalSuitabilityData";
import { AllUnravelledGroupedArbovirusEstimatePartitionKeysQuery } from "@/gql/graphql";
import { partitionedGroupedArbovirusEstimatesQuery } from "@/hooks/arbovirus/usePartitionedGroupedArbovirusEstimates";
import { allUnravelledGroupedArbovirusEstimatePartitionKeys } from "@/hooks/arbovirus/useAllUnravelledGroupedArbovirusEstimatePartitionKeys";
import { partitionedUnravelledGroupedArbovirusEstimates } from "@/hooks/arbovirus/usePartitionedUnravelledArbovirusEstimates";

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
    queryKey: ["groupedArbovirusEstimateFilterOptionsQuery"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', groupedArbovirusEstimateFilterOptionsQuery)
  });

  await queryClient.prefetchQuery({
    queryKey: ["allUnravelledGroupedArbovirusEstimatePartitionKeys"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', allUnravelledGroupedArbovirusEstimatePartitionKeys)
  });
  const unravelledGroupedArbovirusEstimatePartitionKeys = queryClient.getQueryData<AllUnravelledGroupedArbovirusEstimatePartitionKeysQuery>(['allUnravelledGroupedArbovirusEstimatePartitionKeys'])?.allUnravelledGroupedArbovirusEstimatePartitionKeys ?? [];
  await Promise.all(unravelledGroupedArbovirusEstimatePartitionKeys.map((partitionKey) => 
    queryClient.prefetchQuery({
      queryKey: ["partitionedUnravelledGroupedArbovirusEstimates", partitionKey.toString()],
      queryFn: () => request(
        process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '',
        partitionedUnravelledGroupedArbovirusEstimates,
        { input: { partitionKey } }
      ),
    })
  ))

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
