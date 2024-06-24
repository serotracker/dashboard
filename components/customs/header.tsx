"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import ListItem from "@/components/customs/list-item";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DashboardSectionId } from "@/app/pathogen/generic-pathogen-dashboard-page";
import { CircleHelp } from "lucide-react";
import { DashboardType } from "@/app/app-header-and-main";

type NavMenuItem = {
  title: string;
  href: string;
  description: string;
};

interface GenerateNavItemsInput {
  route: string;
  pathogenName: string;
}

const generateDashboardNavItems = (input: GenerateNavItemsInput): NavMenuItem[] => [
  {
    title: "Dashboard",
    href: `/pathogen/${input.route}/dashboard#${DashboardSectionId.MAP}`,
    description: `A dashboard for ${input.pathogenName} seroprevalence data`,
  },
  {
    title: "Data",
    href: `/pathogen/${input.route}/dashboard#${DashboardSectionId.TABLE}`,
    description: `View or download our entire ${input.pathogenName} dataset`,
  },
  {
    title: "Visualizations",
    href: `/pathogen/${input.route}/dashboard#${DashboardSectionId.VISUALIZATIONS}`,
    description: `A collection of visualizations for our ${input.pathogenName} dataset`,
  },
]

const sc2TrackerNavItems: NavMenuItem[] = generateDashboardNavItems({
  route: 'sarscov2',
  pathogenName: 'Sars Cov 2'
});

const arbotrackerNavItems: NavMenuItem[] = generateDashboardNavItems({
  route: 'arbovirus',
  pathogenName: 'arbovirus'
})

const mersNavItems: NavMenuItem[] = generateDashboardNavItems({
  route: 'mers',
  pathogenName: 'MERS'
})

const aboutNavItems: NavMenuItem[] = [
  {
    title: "About Our Data",
    href: "/about/about-our-data",
    description: "The process used to extract the data",
  },
  {
    title: "FAQ",
    href: "/about/faq",
    description:
      "A list of frequently asked questions regarding the data, systematic review and organization",
  },
  {
    title: "SeroTracker Team",
    href: "/about/the-team",
    description:
      "A list of our team members, alumni, stakeholders and other partners",
  },
];

interface TabGroupProps {
  title: string;
  navItems: NavMenuItem[];
}

function TabGroup(props: TabGroupProps) {
  return (
    <div className="flex flex-col w-full lg:w-1/2 px-2 mb-2 md:mb-0">
      <h2 className="mb-2">{props.title}</h2>
      <ul className="flex flex-row space-x-2">
        {props.navItems.map((navItem: NavMenuItem) => (
          <ListItem
            key={`${props.title}-${navItem.title}`}
            title={navItem.title}
            href={navItem.href}
          >
            {navItem.description}
          </ListItem>
        ))}
      </ul>
    </div>
  );
}

interface EnabledHeaderHelpButtonConfiguration {
  enabled: true;
  onHelpButtonClick: () => void;
}

interface DisabledHeaderHelpButtonConfiguration {
  enabled: false;
}

type HeaderHelpButtonConfiguration = 
  | EnabledHeaderHelpButtonConfiguration
  | DisabledHeaderHelpButtonConfiguration;

interface HeaderProps {
  dashboardType: DashboardType;
  helpButtonConfiguration: HeaderHelpButtonConfiguration
}

export const Header = (props: HeaderProps) => {
  const { dashboardType, helpButtonConfiguration } = props;
  const [titleSuffixColor, setTitleSuffixColor] = useState("text-background");
  const [headerBgColor, setHeaderBgColor] = useState("bg-background delay-150");

  const titleSuffix = useMemo(() => {
    if(dashboardType === DashboardType.ARBOVIRUS) {
      return "Arbo";
    }
    if(dashboardType === DashboardType.SARS_COV_2) {
      return "SC2";
    }
    if(dashboardType === DashboardType.MERS) {
      return "MERS";
    }

    return "Sero";
  }, [ dashboardType ]);

  const helpButtonHoverColour = useMemo(() => {
    if(dashboardType === DashboardType.ARBOVIRUS) {
      return 'hover:bg-arbovirusHover';
    }
    if(dashboardType === DashboardType.SARS_COV_2) {
      return 'hover:bg-sc2virusHover';
    }
    if(dashboardType === DashboardType.MERS) {
      return 'hover:bg-mersHover';
    }

    return 'hover:bg-gray-100';
  }, [ dashboardType ]);

  const helpButton = useMemo(() => {
    if(helpButtonConfiguration.enabled === true) {
      return (
        <button
          className={cn(
            "rounded-full p-1",
            helpButtonHoverColour
          )}
          onClick={() => helpButtonConfiguration.onHelpButtonClick()}
          aria-label="Open help modal"
        >
          <CircleHelp />
        </button>
      )
    }

    return null;
  }, [ helpButtonConfiguration, helpButtonHoverColour ]);

  return (
    <header
      className={cn(
        "flex items-center justify-between transition-colors duration-300 h-14 w-screen px-2 text-white overflow-hidden fixed z-10",
        headerBgColor
      )}
    >
      <div className="cursor-pointer pl-2">
        <Link href={"/"} className="flex items-center text-h1">
          <h2>
            <span
              className={cn(
                "p-1 mr-1 bg-white rounded-md transition-colors duration-300",
                titleSuffixColor
              )}
            >
              {titleSuffix}
            </span>
            Tracker
          </h2>
        </Link>
      </div>
      <NavigationMenu className="z-50">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent">
              Trackers
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 flex flex-col lg:flex-row justify-center w-full">
                {process.env.NEXT_PUBLIC_SARS_COV_2_TRACKER_ENABLED && (
                  <TabGroup
                    title={"SC2Tracker"}
                    navItems={sc2TrackerNavItems}
                  />
                )}
                <TabGroup
                  title={"Arbotracker"}
                  navItems={arbotrackerNavItems}
                />
                {process.env.NEXT_PUBLIC_MERS_TRACKER_ENABLED && (
                  <TabGroup
                    title={"MERSTracker"}
                    navItems={mersNavItems}
                  />
                )}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent">
              About
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 flex justify-center w-full">
                <TabGroup title={"About"} navItems={aboutNavItems} />
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {helpButton}
        </NavigationMenuList>
        <NavigationMenuViewport
          className={cn("transition-colors duration-300", headerBgColor)}
        />
      </NavigationMenu>
    </header>
  );
};
