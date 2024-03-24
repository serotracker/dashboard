import getQueryClient from "@/components/customs/getQueryClient";
import { notFound } from "next/navigation";
import request from "graphql-request";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { groupedTeamMembers } from "@/hooks/useGroupedTeamMemberData";
import { AboutPageProvider } from "./about-page-context";
import { NavigationSidebar } from "@/components/ui/navigation-sidebar/navigation-sidebar";

export enum AboutPageSidebarOption {
  DATA_EXTRACTION = "DATA_EXTRACTION",
  FAQ = "FAQ",
  THE_TEAM = "THE_TEAM",
}

interface AboutPageBaseLayoutProps {
  currentSidebarOption: AboutPageSidebarOption;
  children: React.ReactNode;
}

export default async function AboutPageBaseLayout (props: AboutPageBaseLayoutProps) {
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

  if (process.env.NEXT_PUBLIC_ABOUT_PAGE_ENABLED !== "true") {
    return notFound();
  }

  return (
    <AboutPageProvider>
      <Hydrate state={dehydratedState}>
        <div className="grid col-span-12 grid-cols-12 grid-rows-2 grid-flow-col w-full h-full">
          <div className="col-span-2 h-full row-span-2">
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
                  label: "The Team",
                  route: "/about/the-team",
                  value: AboutPageSidebarOption.THE_TEAM,
                },
              ]}
            />
            ;
          </div>
          <div className="col-span-8 h-full row-span-2 overflow-y-scroll p-12">
              {props.children}
          </div>
        </div>
      </Hydrate>
    </AboutPageProvider>
  );
};
