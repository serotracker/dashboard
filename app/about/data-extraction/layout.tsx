import { AboutPageBaseLayout, AboutPageSidebarOption } from "../base-layout";

export default async function DataExtractionPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AboutPageBaseLayout currentSidebarOption={AboutPageSidebarOption.DATA_EXTRACTION}>
      {children}
    </AboutPageBaseLayout>
  );
}
