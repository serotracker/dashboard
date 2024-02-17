import { AboutPageBaseLayout, AboutPageSidebarOption } from "../base-layout";

export default async function TheTeamPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AboutPageBaseLayout currentSidebarOption={AboutPageSidebarOption.THE_TEAM}>
      {children}
    </AboutPageBaseLayout>
  );
}
