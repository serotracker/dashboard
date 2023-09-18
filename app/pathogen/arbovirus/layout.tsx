import React, { cache } from "react";
import { ArboProviders, Hydrate } from "@/contexts/arbo-context";
import { dehydrate } from "@tanstack/query-core";
import getQueryClient from "@/components/customs/getQueryClient";

export default async function ArboLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["ArbovirusRecords"],
    queryFn: () =>
      fetch("http://127.0.0.1:5000/data_provider/records/arbo").then(
        (response) => response.json(),
      ),
  });
  await queryClient.prefetchQuery({
    queryKey: ["ArbovirusVisualizations"],
    queryFn: () =>
      fetch(
        "http://127.0.0.1:5000/data_provider/data_provider/arbo/visualizations",
      ).then((response) => response.json()),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <div
      className={
        "grid gap-4 grid-cols-12 grid-rows-2 grid-flow-col w-full h-full overflow-hidden"
      }
    >
      <ArboProviders>
        <Hydrate state={dehydratedState}>{children}</Hydrate>
      </ArboProviders>
    </div>
  );
}
