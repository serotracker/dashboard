import React, { cache } from "react";
import { SarsCov2Providers, Hydrate } from "@/contexts/sarscov2-context";
import { dehydrate } from "@tanstack/query-core";
import getQueryClient from "@/components/customs/getQueryClient";
import { customCache } from "@/cache/sarscov2";

export default async function ArboLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  //TODO: this segment is technically repeated in useSarsCov2Data.tsx. It should be refactored to be DRY.
  await queryClient.prefetchQuery({
    queryKey: ["SarsCov2Records"],
    queryFn: async () => {
      if (customCache.records && customCache.records.length > 0) {
        console.log("using cached data")
        return customCache.records;
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sarscov2/records`, { cache: 'no-store' });
        const data = await response.json();
        customCache.records = data;
        return data;
      }
    },
    cacheTime: 0
  });
  
  const dehydratedState = dehydrate(queryClient);

  return (
    <div
      className={
        "grid gap-4 grid-cols-12 grid-rows-2 grid-flow-col w-full h-full overflow-hidden"
      }
    >
      <SarsCov2Providers>
        <Hydrate state={dehydratedState}>{children}</Hydrate>
      </SarsCov2Providers>
    </div>
  );
}
