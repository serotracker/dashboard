import React from "react";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/components/customs/getQueryClient";
import { request } from 'graphql-request';
import { notFound } from 'next/navigation'
import { GenericPathogenPageLayout } from "../generic-pathogen-page-layout";
import { SarsCov2Providers } from "@/contexts/pathogen-context/pathogen-contexts/sarscov2/sc2-context";
import { sarsCov2Filters } from "@/hooks/sarscov2/useSarsCov2Filters";
import { monthlySarsCov2CountryInformation } from "@/hooks/sarscov2/useMonthlySarsCov2CountryInformation";
import { sarsCov2EstimatesPartitionKeys } from "@/hooks/sarscov2/useSarsCov2DataPartitionKeys";
import { monthlySarsCov2CountryInformationPartitionKeys } from "@/hooks/sarscov2/useMonthlySarsCov2CountryInformationPartitionKeys";
import { AllMonthlySarsCov2CountryInformationPartitionKeysQuery, AllSarsCov2EstimatePartitionKeysQuery } from "@/gql/graphql";
import { partitionedSarsCov2Estimates } from "@/hooks/sarscov2/useSarsCov2DataPartitioned";
import { partitionedMonthlySarsCov2CountryInformation } from "@/hooks/sarscov2/useMonthlySarsCov2CountryInformationPartitioned";

export default async function SarsCov2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["monthlySarsCov2CountryInformation"],
    queryFn: () => request(process.env.NEXT_PUBLIC_PREVIEW_API_GRAPHQL_URL ?? '', monthlySarsCov2CountryInformation)
  });
  await queryClient.prefetchQuery({
    queryKey: ["sarsCov2FilterOptions"],
    queryFn: () => request(process.env.NEXT_PUBLIC_PREVIEW_API_GRAPHQL_URL ?? '', sarsCov2Filters)
  });
  await queryClient.prefetchQuery({
    queryKey: ["sarsCov2DataPartitionKeys"],
    queryFn: () => request(process.env.NEXT_PUBLIC_PREVIEW_API_GRAPHQL_URL ?? '', sarsCov2EstimatesPartitionKeys)
  });
  await queryClient.prefetchQuery({
    queryKey: ["monthlySarsCov2CountryInformationPartitionKeys"],
    queryFn: () => request(process.env.NEXT_PUBLIC_PREVIEW_API_GRAPHQL_URL ?? '', monthlySarsCov2CountryInformationPartitionKeys)
  });

  const allSarsCov2DataPartitionKeys = queryClient.getQueryData<AllSarsCov2EstimatePartitionKeysQuery>(['sarsCov2DataPartitionKeys'])?.allSarsCov2EstimatePartitionKeys ?? [];

  await Promise.all(allSarsCov2DataPartitionKeys.map((partitionKey) => 
    queryClient.prefetchQuery({
      queryKey: ["partitionedSarsCov2Estimates", partitionKey.toString()],
      queryFn: () => request(
        process.env.NEXT_PUBLIC_PREVIEW_API_GRAPHQL_URL ?? '',
        partitionedSarsCov2Estimates,
        { input: { partitionKey } }
      ),
    })
  ))

  const allMonthlySarsCov2CountryInformationPartitionKeys = queryClient.getQueryData<AllMonthlySarsCov2CountryInformationPartitionKeysQuery>(['monthlySarsCov2CountryInformationPartitionKeys'])?.allMonthlySarsCov2CountryInformationPartitionKeys ?? [];

  await Promise.all(allMonthlySarsCov2CountryInformationPartitionKeys.map((partitionKey) => 
    queryClient.prefetchQuery({
      queryKey: ["partitionedMonthlySarsCov2CountryInformation", partitionKey.toString()],
      queryFn: () => request(
        process.env.NEXT_PUBLIC_PREVIEW_API_GRAPHQL_URL ?? '',
        partitionedMonthlySarsCov2CountryInformation,
        { input: { partitionKey } }
      ),
    })
  ))

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
