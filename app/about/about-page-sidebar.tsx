"use client"

import { useContext } from "react";
import { AboutPageSidebarOption, aboutPageSidebarContext } from "./about-page-context";
import { NavigationSidebar } from "@/components/ui/navigation-sidebar/navigation-sidebar";

export const AboutPageSidebar = (): React.ReactNode => {
  const { currentSidebarOption } = useContext(aboutPageSidebarContext)

  return <NavigationSidebar
    options={[{
      label: 'Data Extraction',
      route: '/about/data-extraction',
      value: AboutPageSidebarOption.DATA_EXTRACTION
    },{
      label: 'FAQ',
      route: '/about/faq',
      value: AboutPageSidebarOption.FAQ
    },{
      label: 'The Team',
      route: '/about/the-team',
      value: AboutPageSidebarOption.THE_TEAM
    }]}
    selectedValue={ currentSidebarOption }
  />;
}