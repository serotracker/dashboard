import getQueryClient from "@/components/customs/getQueryClient";
import { request } from 'graphql-request';
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { groupedTeamMembersQuery } from "@/hooks/useGroupedTeamMemberData";
import { AboutPageProvider } from "./about-page-context";
import { AboutPageSidebar } from "./about-page-sidebar";
import { notFound } from "next/navigation";

export default async function AboutPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["groupedTeamMembersQuery"],
    queryFn: () => request(process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? '', groupedTeamMembersQuery)
  });

  const dehydratedState = dehydrate(queryClient);

  if(process.env.NEXT_PUBLIC_WEBSITE_REDESIGN_ENABLED !== 'true') {
    return notFound();
  }
  
  return (
    <AboutPageProvider>
      <Hydrate state={dehydratedState}>
        <div className="grid col-span-12 grid-cols-12 grid-rows-2 grid-flow-col w-full h-full">
          <div className="col-span-2 h-full row-span-2">
            <AboutPageSidebar />
          </div>
          <div className="col-span-10 h-full row-span-2 overflow-y-scroll">
            {children}
          </div>
        </div>
      </Hydrate>
    </AboutPageProvider>
  );
}