"use client";

import React, { useEffect, useState } from "react";
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

import { ArbovirusPageSectionId } from "@/app/constants";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type navMenuItem = {
  title: string;
  href: string;
  description: string;
};

const serotrackerNavItems: navMenuItem[] = [
  {
    title: "Dashboard",
    href: "/pathogen/sarscov2/dashboard",
    description: "A dashboard for SarsCov2 seroprevalence data",
  },
  {
    title: "Data",
    href: "/pathogen/sarscov2/dashboard",
    description:
      "A collection of visualizations and tabular data tools for our collection of SarsCov2 data",
  },
  {
    title: "Visualizations",
    href: "/pathogen/sarscov2/dashboard",
    description:
      "A collection of visualizations and tabular data tools for our collection of SarsCov2 data",
  },
];

const arbotrackerNavitems: navMenuItem[] = [
  {
    title: "Dashboard",
    href: `/pathogen/arbovirus/dashboard#${ArbovirusPageSectionId.MAP}`,
    description: "A dashboard for Arbovirus seroprevalence data",
  },
  {
    title: "Analysis",
    href: `/pathogen/arbovirus/dashboard#${ArbovirusPageSectionId.TABLE}`,
    description:
      "A collection of visualizations and tabular data tools for our collection of arbovirus data",
  },
  {
    title: "Visualizations",
    href: `/pathogen/arbovirus/dashboard#${ArbovirusPageSectionId.VISUALIZATIONS}`,
    description:
      "A collection of visualizations and tabular data tools for our collection of arbovirus data",
  },
];

const aboutNavItems: navMenuItem[] = [
  {
    title: "Our Team",
    href: "/about/the-team",
    description: "A list of our team members, alumni, stakeholders and other partners",
  },
  {
    title: "Data Extraction",
    href: "/about/data-extraction",
    description:
      "The process used while extracted data",
  },
  {
    title: "FAQ",
    href: "/about/faq",
    description:
      "A list of frequently asked questions regarding the data, systematic review and organization",
  },
];

interface TabGroupProps {
  title: string;
  navItems: navMenuItem[]
}

function TabGroup(props: TabGroupProps) {
  return (
    <div className="flex flex-col w-2/4 md:2/5 px-2">
      <h2 className="mb-2">{props.title}</h2>
      <ul className="flex flex-row space-x-2">
        {props.navItems.map((navItem: navMenuItem) => (
          <ListItem key={`${props.title}-${navItem.title}`} title={navItem.title} href={navItem.href}>
            {navItem.description}
          </ListItem>
        ))}
      </ul>
    </div>
  )
}

export const Header = () => {

  const pathname = usePathname();
  const [titleSuffix, setTitleSuffix] = useState("Sero");
  const [titleSuffixColor, setTitleSuffixColor] = useState("text-background");
  const [headerBgColor, setHeaderBgColor] = useState("bg-background")


  useEffect(() => {
    if (pathname.includes('arbovirus')) {
      setTitleSuffix("Arbo");
      setTitleSuffixColor("text-arbo");
      setHeaderBgColor("bg-arbo delay-150");
    } else if (pathname.includes('sarscov2')) {
      setTitleSuffix("SC2");
      setTitleSuffixColor("text-sc2");
      setHeaderBgColor("bg-sc2 delay-150");
    } else {
      setTitleSuffix("Sero");
      setTitleSuffixColor("text-background");
      setHeaderBgColor("bg-background");
    }
  }, [pathname])

  return (
    <header className={cn("flex items-center justify-between transition-colors duration-300 h-14 w-screen px-2 text-white border-b-4 border-white overflow-hidden", headerBgColor)}>
      <div className="cursor-pointer pl-2">
        <Link href={"/"} className="flex items-center text-h1">
          <h2>
            <span className={cn("p-1 mr-1 bg-white rounded-md transition-colors duration-300", titleSuffixColor)}>{titleSuffix}</span>
            Tracker
          </h2>
        </Link>
      </div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent">Trackers</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 flex justify-center w-full">
                {process.env.SARS_COV_2_TRACKER_ENABLED &&
                  <TabGroup title={"SC2Tracker"} navItems={serotrackerNavItems}                />
                }
                <TabGroup title={"Arbotracker"} navItems={arbotrackerNavitems} />
                              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent">About</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 flex justify-center w-full">
                <TabGroup title={"About"} navItems={aboutNavItems} />
                              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport className={cn("transition-colors duration-300", headerBgColor)} />
      </NavigationMenu>
    </header>
  );
};
