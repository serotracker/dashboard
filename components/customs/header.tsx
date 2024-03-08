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

type NavMenuItem = {
  title: string;
  href: string;
  description: string;
};

const serotrackerNavItems: NavMenuItem[] = [
  {
    title: "Dashboard",
    href: "/pathogen/sarscov2/dashboard",
    description: "A dashboard for Sars Cov 2 seroprevalence data",
  },
  {
    title: "Data",
    href: "/pathogen/sarscov2/dashboard",
    description: "View or download our entire Sars Cov 2 dataset",

  },
  {
    title: "Visualizations",
    href: "/pathogen/sarscov2/dashboard",
    description: "A collection of visualizations for our Sars Cov 2 dataset",
  },
];

const arbotrackerNavitems: NavMenuItem[] = [
  {
    title: "Dashboard",
    href: `/pathogen/arbovirus/dashboard#${ArbovirusPageSectionId.MAP}`,
    description: "A dashboard for arbovirus seroprevalence data",
  },
  {
    title: "Data",
    href: `/pathogen/arbovirus/dashboard#${ArbovirusPageSectionId.TABLE}`,
    description: "View or download our entire arbovirus dataset",
  },
  {
    title: "Visualizations",
    href: `/pathogen/arbovirus/dashboard#${ArbovirusPageSectionId.VISUALIZATIONS}`,
    description: "A collection of visualizations for our arbovirus dataset",
  },
];

const about: NavMenuItem[] = [
  {
    title: "Our Team",
    href: "/pathogen/TODO",
    description: "A list of our team members, alumni, stakeholders and other partners",
  },
  {
    title: "Data Extraction",
    href: "/pathogen/TODO",
    description:
      "The process used while extracted data",
  },
  {
    title: "FAQ",
    href: "/pathogen/TODO",
    description:
      "A list of frequently asked questions regarding the data, systematic review and organization",
  },
];

const aboutNavItems: NavMenuItem[] = [
  {
    title: "Data Extraction",
    href: "/about/data-extraction",
    description: "The process used to extract the data",
  },
  {
    title: "FAQ",
    href: "/about/faq",
    description:
      "A list of frequently asked questions regarding the data, systematic review and organization",
  },
  {
    title: "Our Team",
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
    <div className="flex flex-col w-2/4 md:2/5 px-2">
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

export const Header = () => {
  const pathname = usePathname();
  const [titleSuffix, setTitleSuffix] = useState("Sero");
  const [titleSuffixColor, setTitleSuffixColor] = useState("text-background");
  const [headerBgColor, setHeaderBgColor] = useState("bg-background delay-150");

  // I wonder if there is a better way to do this without the useEffect.
  // Will come back to it because I have spent too much time here already
  useEffect(() => {
    if (pathname.includes("arbovirus")) {
      setTitleSuffix("Arbo");
    } else if (pathname.includes("sarscov2")) {
      setTitleSuffix("SC2");
    } else {
      setTitleSuffix("Sero");
    }
  }, [pathname]);

  return (
    <header
      className={cn(
        "flex items-center  justify-between transition-colors duration-300 h-14 w-screen px-2 text-white border-b-4 border-white overflow-hidden",
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
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent">
              Trackers
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 flex justify-center w-full">
                {process.env.NEXT_PUBLIC_SARS_COV_2_TRACKER_ENABLED && (
                  <TabGroup
                    title={"SC2Tracker"}
                    navItems={serotrackerNavItems}
                  />
                )}
                <TabGroup
                  title={"Arbotracker"}
                  navItems={arbotrackerNavitems}
                />
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {process.env.NEXT_PUBLIC_ABOUT_PAGE_ENABLED && <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent">
              About
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 flex justify-center w-full">
                <TabGroup title={"About"} navItems={aboutNavItems} />
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>}
        </NavigationMenuList>
        <NavigationMenuViewport
          className={cn("transition-colors duration-300", headerBgColor)}
        />
      </NavigationMenu>
    </header>
  );
};
