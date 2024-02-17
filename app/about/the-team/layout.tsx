import { AboutPageSidebarOption } from "../about-page-sidebar";
import { AboutPageBaseLayout } from "../base-layout";

export default async function TheTeamPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  <AboutPageBaseLayout currentSidebarOption={AboutPageSidebarOption.THE_TEAM}>
    {children}
  </AboutPageBaseLayout>;
}
