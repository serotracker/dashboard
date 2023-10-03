import React, { cache } from "react";
import { SarsCov2Providers, Hydrate } from "@/contexts/sarscov2-context";
import { dehydrate } from "@tanstack/query-core";
import getQueryClient from "@/components/customs/getQueryClient";

export default async function ArboLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["SarsCov2Records"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sarscov2/records`).then(
        (response) => response.json(),
      ),
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
