import { NavigationSidebar } from "@/components/ui/navigation-sidebar/navigation-sidebar";
import { AboutPageSidebarOption } from "./base-layout";

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