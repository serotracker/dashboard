import getQueryClient from "@/components/customs/getQueryClient";
import request from "graphql-request";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { groupedTeamMembers } from "@/hooks/useGroupedTeamMemberData";
import { AboutPageProvider } from "./about-page-context";
import { NavigationSidebar } from "@/components/ui/navigation-sidebar/navigation-sidebar";
import { AppHeaderAndMain } from "../app-header-and-main";

enum AboutPageSidebarOption {
  DATA_EXTRACTION = "DATA_EXTRACTION",
  FAQ = "FAQ",
  SEROTRACKER_TEAM = "SEROTRACKER_TEAM",
}

export interface AboutPageBaseLayoutProps {
  children: React.ReactNode;
}


export default async function AboutPageBaseLayout(props: AboutPageBaseLayoutProps) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["groupedTeamMembersQuery"],
    queryFn: () =>
      request(
        process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? "",
        groupedTeamMembers
      ),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <AppHeaderAndMain>
      <AboutPageProvider>
        <HydrationBoundary state={dehydratedState}>
          <div className="flex flex-col lg:grid lg:col-span-12 lg:grid-cols-12 lg:grid-rows-2 lg:grid-flow-col w-full h-full">
            <div className="lg:col-span-2 lg:h-full lg:row-span-2 border-b border-background lg:border-b-0">
              <NavigationSidebar
                options={[
                  {
                    label: "About Our Data",
                    route: "/about/about-our-data",
                    value: AboutPageSidebarOption.DATA_EXTRACTION,
                  },
                  {
                    label: "FAQ",
                    route: "/about/faq",
                    value: AboutPageSidebarOption.FAQ,
                  },
                  {
                    label: "SeroTracker Team",
                    route: "/about/the-team",
                    value: AboutPageSidebarOption.SEROTRACKER_TEAM,
                  },
                ]}
              />
            </div>
            <div className="lg:col-span-8 h-full lg:row-span-2 overflow-y-scroll p-12">
              {props.children}
            </div>
          </div>
        </HydrationBoundary>
      </AboutPageProvider>
    </AppHeaderAndMain>
  );
};
