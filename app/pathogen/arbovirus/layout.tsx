import React from "react";
import { ArboProviders } from "@/contexts/arbo-context";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/components/customs/getQueryClient";

export default async function ArboLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  console.log(process.env.NEXT_PUBLIC_API_BASE_URL)

  await queryClient.prefetchQuery({
    queryKey: ["ArbovirusRecords"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/arbo/records`, { cache: 'no-store' }).then(
        (response) => response.json(),
      ),
  });
  await queryClient.prefetchQuery({
    queryKey: ["ArbovirusVisualizations"],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/data_provider/arbo/visualizations`,
        { cache: 'no-store' }).then((response) => response.json()),
  });
  await queryClient.prefetchQuery({
    queryKey: ["ArbovirusFilters"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/arbo/filter_options`, { cache: 'no-store' }).then(
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
      <ArboProviders>
        <Hydrate state={dehydratedState}>{children}</Hydrate>
      </ArboProviders>
    </div>
  );
}
