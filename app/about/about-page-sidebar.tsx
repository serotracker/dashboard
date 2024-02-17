"use client"

import { useContext } from "react";
import { NavigationSidebar } from "@/components/ui/navigation-sidebar/navigation-sidebar";

export enum AboutPageSidebarOption {
  DATA_EXTRACTION = "DATA_EXTRACTION",
  FAQ = "FAQ",
  THE_TEAM = "THE_TEAM",
}

interface AboutPageSidebarProps {
  currentSidebarOption: AboutPageSidebarOption;
}

export const AboutPageSidebar = (props: AboutPageSidebarProps): React.ReactNode => {
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
    selectedValue={ props.currentSidebarOption }
  />;
}