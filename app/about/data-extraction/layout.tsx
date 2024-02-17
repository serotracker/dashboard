import { AboutPageSidebarOption } from "../about-page-sidebar";
import { AboutPageBaseLayout } from "../base-layout";

export default async function DataExtractionPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  <AboutPageBaseLayout currentSidebarOption={AboutPageSidebarOption.DATA_EXTRACTION}>
    {children}
  </AboutPageBaseLayout>;
}
