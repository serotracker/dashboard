import React from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/components/customs/getQueryClient";
import { request } from 'graphql-request';
import { notFound } from 'next/navigation'
import { GenericPathogenPageLayout } from "../generic-pathogen-page-layout";
import { mersPrimaryEstimates } from "@/hooks/mers/useMersPrimaryEstimates";
import { MersProviders } from "@/contexts/pathogen-context/pathogen-contexts/mers/mers-context";
import { mersFilters } from "@/hooks/mers/useMersFilters";
import { AllFaoMersEventPartitionKeysQuery, MersWhoCaseDataPartitionKeysQuery, YearlyFaoCamelPopulationDataPartitionKeysQuery } from "@/gql/graphql";
import { faoMersEventPartitionKeys } from "@/hooks/mers/useFaoMersEventDataPartitionKeys";
import { partitionedFaoMersEvents } from "@/hooks/mers/useFaoMersEventDataPartitioned";
import { yearlyFaoCamelPopulationDataPartitionKeys } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitionKeys";
import { partitionedYearlyFaoCamelPopulationData } from "@/hooks/mers/useFaoYearlyCamelPopulationDataPartitioned";
import { faoMersEventFilterOptions } from "@/hooks/mers/useFaoMersEventFilterOptions";
import { mersEstimatesFilterOptions } from "@/hooks/mers/useMersEstimatesFilters";
import { mersMacroSampleFrames } from "@/hooks/mers/useMersMacroSampleFrames";
import { mersWhoCaseDataPartitionKeys } from "@/hooks/mers/use-mers-who-case-data-partition-keys";
import { mersWhoCaseData } from "@/hooks/mers/use-mers-who-case-data-partitioned";

export default async function MersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["mersPrimaryEstimates"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', mersPrimaryEstimates)
  });
  await queryClient.prefetchQuery({
    queryKey: ["mersFilterOptions"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', mersFilters)
  });
  await queryClient.prefetchQuery({
    queryKey: ["mersMacroSampleFrames"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', mersMacroSampleFrames)
  });
  await queryClient.prefetchQuery({
    queryKey: ["faoMersEventFilterOptions"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', faoMersEventFilterOptions)
  });
  await queryClient.prefetchQuery({
    queryKey: ["mersEstimatesFilterOptions"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', mersEstimatesFilterOptions)
  });

  await queryClient.prefetchQuery({
    queryKey: ["faoMersEventPartitionKeys"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', faoMersEventPartitionKeys)
  });

  const allFaoMersEventPartitionKeys = queryClient.getQueryData<AllFaoMersEventPartitionKeysQuery>([
    'faoMersEventPartitionKeys'
  ])?.allFaoMersEventPartitionKeys ?? [];

  await Promise.all(allFaoMersEventPartitionKeys.map((partitionKey) => 
    queryClient.prefetchQuery({
      queryKey: ["partitionedFaoMersEvents", partitionKey.toString()],
      queryFn: () => request(
        process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '',
        partitionedFaoMersEvents,
        { input: { partitionKey } }
      ),
    })
  ))

  await queryClient.prefetchQuery({
    queryKey: ["mersWhoCaseDataPartitionKeys"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', mersWhoCaseDataPartitionKeys)
  });

  const mersWhoCaseDataPartitionKeyData = queryClient.getQueryData<MersWhoCaseDataPartitionKeysQuery>([
    'mersWhoCaseDataPartitionKeys'
  ])?.mersWhoCaseDataPartitionKeys ?? [];

  await Promise.all(mersWhoCaseDataPartitionKeyData.map((partitionKey) => 
    queryClient.prefetchQuery({
      queryKey: ["mersWhoCaseData", partitionKey.toString()],
      queryFn: () => request(
        process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '',
        mersWhoCaseData,
        { input: { partitionKey } }
      ),
    })
  ));

  await queryClient.prefetchQuery({
    queryKey: ["yearlyFaoCamelPopulationDataPartitionKeys"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', yearlyFaoCamelPopulationDataPartitionKeys)
  });

  const allYearlyFaoCamelPopulationDataPartitionKeys = queryClient.getQueryData<YearlyFaoCamelPopulationDataPartitionKeysQuery>([
    'yearlyFaoCamelPopulationDataPartitionKeys'
  ])?.yearlyFaoCamelPopulationDataPartitionKeys ?? [];

  await Promise.all(allYearlyFaoCamelPopulationDataPartitionKeys.map((partitionKey) => 
    queryClient.prefetchQuery({
      queryKey: ["partitionedYearlyFaoCamelPopulationData", partitionKey.toString()],
      queryFn: () => request(
        process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '',
        partitionedYearlyFaoCamelPopulationData,
        { input: { partitionKey } }
      ),
    })
  ))

  const dehydratedState = dehydrate(queryClient);

  if(!process.env.NEXT_PUBLIC_MERS_TRACKER_ENABLED) {
    return notFound();
  }

  return (
    <GenericPathogenPageLayout>
      <MersProviders>
        <HydrationBoundary state={dehydratedState}>
          {children}
        </HydrationBoundary>
      </MersProviders>
    </GenericPathogenPageLayout>
  );
}
