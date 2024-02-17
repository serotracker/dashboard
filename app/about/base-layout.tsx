import { AboutPageSidebar, AboutPageSidebarOption } from "./about-page-sidebar";
import { notFound } from "next/navigation";

interface AboutPageBaseLayoutProps {
  currentSidebarOption: AboutPageSidebarOption,
  children: React.ReactNode;
}

export const AboutPageBaseLayout = (props: AboutPageBaseLayoutProps): React.ReactNode => {
  if(process.env.NEXT_PUBLIC_WEBSITE_REDESIGN_ENABLED !== 'true') {
    return notFound();
  }

  return (
    <div className="grid col-span-12 grid-cols-12 grid-rows-2 grid-flow-col w-full h-full">
      <div className="col-span-2 h-full row-span-2">
        <AboutPageSidebar currentSidebarOption={props.currentSidebarOption} />
      </div>
      <div className="col-span-10 h-full row-span-2">
        <p> data extraction page </p>;
      </div>
    </div>
  );
}