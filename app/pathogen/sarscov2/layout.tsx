import React from "react";
import { SarsCov2Providers, Hydrate } from "@/contexts/sarscov2-context/sarscov2-context";
import { dehydrate } from "@tanstack/query-core";
import getQueryClient from "@/components/customs/getQueryClient";
import { notFound } from 'next/navigation'

export default async function ArboLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  //TODO: this segment is technically repeated in useSarsCov2Data.tsx. It should be refactored to be DRY.
  console.time("prefetchQuerySero");
  await queryClient.prefetchQuery({
    queryKey: ["SarsCov2Records"],
    queryFn: () =>
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sarscov2/records`, { cache: 'no-store' }).then(
        (response) => response.json(),
      ),
  });
  await queryClient.prefetchQuery({
    queryKey: ["SarsCov2Filters"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sarscov2/filter_options`).then(
        (response) => response.json()
      ),
  });
  console.timeEnd("prefetchQuerySero");
  
  const dehydratedState = dehydrate(queryClient);

  if(!process.env.NEXT_PUBLIC_SARS_COV_2_TRACKER_ENABLED) {
    return notFound();
  }

  return (
    <div
      className={
        "grid gap-4 grid-cols-12 grid-rows-2 grid-flow-col w-full h-full overflow-hidden p-4 border-box"
      }
    >
      <SarsCov2Providers>
        <Hydrate state={dehydratedState}>{children}</Hydrate>
      </SarsCov2Providers>
    </div>
  );
}
