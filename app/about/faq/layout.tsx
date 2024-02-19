import { AboutPageBaseLayout, AboutPageSidebarOption } from "../base-layout";

export default async function FAQPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AboutPageBaseLayout currentSidebarOption={AboutPageSidebarOption.FAQ}>
      {children}
    </AboutPageBaseLayout>
  );
}
