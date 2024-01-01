import React from "react";
import { ArboProviders } from "@/contexts/arbo-context";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/components/customs/getQueryClient";
import { useQuery } from "@tanstack/react-query";
import { gql } from "@apollo/client";
import { request } from 'graphql-request';
import { arbovirusEstimatesQuery } from "@/hooks/useArboData";
import { arbovirusFiltersQuery } from "@/hooks/useArboFilters";

export default async function ArboLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["arbovirusEstimatesQuery"],
    queryFn: () => request('https://iit-backend-v2.vercel.app/api/graphql', arbovirusEstimatesQuery)
  });
  await queryClient.prefetchQuery({
    queryKey: ["arbovirusFiltersQuery"],
    queryFn: () => request('https://iit-backend-v2.vercel.app/api/graphql', arbovirusFiltersQuery)
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div
      className={
        "grid gap-4 grid-cols-12 grid-rows-2 grid-flow-col w-full h-full overflow-hidden p-4 border-box"
      }
    >
      <ArboProviders>
        <Hydrate state={dehydratedState}>{children}</Hydrate>
      </ArboProviders>
    </div>
  );
}
