import getQueryClient from "@/components/customs/getQueryClient";
import { request } from 'graphql-request';
import { Hydrate, QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query";
import { groupedTeamMembersQuery } from "@/hooks/useGroupedTeamMemberData";

export default async function AboutPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        cacheTime: Infinity,
      },
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["groupedTeamMembersQuery"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', groupedTeamMembersQuery)
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={dehydratedState}>{children}</Hydrate>
      </QueryClientProvider>
    </div>
  );
}