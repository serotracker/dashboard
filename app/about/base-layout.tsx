import { AboutPageSidebar } from "./about-page-sidebar";
import { notFound } from "next/navigation";

export enum AboutPageSidebarOption {
  DATA_EXTRACTION = "DATA_EXTRACTION",
  FAQ = "FAQ",
  THE_TEAM = "THE_TEAM",
}

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
        {props.children}
      </div>
    </div>
  );
}