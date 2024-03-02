"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
<<<<<<< HEAD
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import ListItem from "@/components/customs/list-item";
=======
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import ListItem from "@/components/customs/list-item";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> c08bad2 (Added in conditional styling to the header)
=======

>>>>>>> 45c0b9c (Merged conmflicts and fixed color)
import { ArbovirusPageSectionId } from "@/app/constants";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavMenuItem = {
  title: string;
  href: string;
  description: string;
};

<<<<<<< HEAD
const serotrackerNavItems: NavMenuItem[] = [
=======
const serotrackerNavItems: navMenuItem[] = [
>>>>>>> a564c99 (Updated header style a little bit and also extracted a reusable segment of code)
  {
    title: "Dashboard",
    href: "/pathogen/sarscov2/dashboard",
    description: "A dashboard for Sars Cov 2 seroprevalence data",
  },
  {
    title: "Analysis",
    href: "/pathogen/sarscov2/analyze",
    description:
      "A collection of visualizations and tabular data tools for our collection of SarsCov2 data",
  },
];

<<<<<<< HEAD
const arbotrackerNavitems: NavMenuItem[] = [
=======
const arbotrackerNavitems: navMenuItem[] = [
>>>>>>> a564c99 (Updated header style a little bit and also extracted a reusable segment of code)
  {
    title: "Dashboard",
    href: `/pathogen/arbovirus/dashboard#${ArbovirusPageSectionId.MAP}`,
    description: "A dashboard for arbovirus seroprevalence data",
  },
  {
    title: "Analysis",
    href: `/pathogen/arbovirus/dashboard#${ArbovirusPageSectionId.TABLE}`,
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
    title: "Data",
<<<<<<< HEAD
    href: "/pathogen/arbovirus/dashboard",
>>>>>>> 3e60d6d (Updated the header to have the tracker and about tabs with subtabs)
=======
    href: "/pathogen/arbovirus/dashboard/#TABLE",
>>>>>>> 04e95cb (Updated the links to work)
>>>>>>> 7280c8c (Updated the links to work)
=======
>>>>>>> 45c0b9c (Merged conmflicts and fixed color)
    description:
      "A collection of visualizations and tabular data tools for our collection of arbovirus data",
  },
<<<<<<< HEAD
=======
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
>>>>>>> a564c99 (Updated header style a little bit and also extracted a reusable segment of code)
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
<<<<<<< HEAD
  const pathname = usePathname();
  const [titleSuffix, setTitleSuffix] = useState("Sero");
  const [titleSuffixColor, setTitleSuffixColor] = useState("text-background");
  const [headerBgColor, setHeaderBgColor] = useState("bg-background");

  // I wonder if there is a better way to do this without the useEffect.
  // Will come back to it because I have spent too much time here already
  useEffect(() => {
    if (pathname.includes("arbovirus")) {
      setTitleSuffix("Arbo");
      setTitleSuffixColor("text-arbovirus");
      setHeaderBgColor("bg-arbovirus delay-150");
    } else if (pathname.includes("sarscov2")) {
      setTitleSuffix("SC2");
      setTitleSuffixColor("text-sc2virus");
      setHeaderBgColor("bg-sc2virus delay-150");
=======

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
<<<<<<< HEAD
      setTitleSuffixColor("text-blue-500");
      setHeaderBgColor("bg-blue-500 delay-150");
>>>>>>> c08bad2 (Added in conditional styling to the header)
=======
      setTitleSuffixColor("text-sc2");
      setHeaderBgColor("bg-sc2 delay-150");
>>>>>>> 45c0b9c (Merged conmflicts and fixed color)
    } else {
      setTitleSuffix("Sero");
      setTitleSuffixColor("text-background");
      setHeaderBgColor("bg-background");
    }
<<<<<<< HEAD
  }, [pathname]);

  return (
    <header className="bg-background flex items-center justify-between h-12 w-screen px-2">
      <div className="cursor-pointer py-5 pl-2">
        <Link href={"/"} className="flex items-center">
          <Image
            src={"/SerotrackerLogo.svg"}
            alt={"Serotracker Logo"}
            width={23}
            height={23}
          />
=======
  }, [pathname])

  return (
    <header className={cn("flex items-center justify-between transition-colors duration-300 h-14 w-screen px-2 text-white border-b-4 border-white overflow-hidden", headerBgColor)}>
      <div className="cursor-pointer pl-2">
        <Link href={"/"} className="flex items-center text-h1">
          <h2>
            <span className={cn("p-1 mr-1 bg-white rounded-md transition-colors duration-300", titleSuffixColor)}>{titleSuffix}</span>
            Tracker
<<<<<<< HEAD
          </h1>
>>>>>>> c08bad2 (Added in conditional styling to the header)
=======
          </h2>
>>>>>>> 45c0b9c (Merged conmflicts and fixed color)
        </Link>
      </div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem hidden={!process.env.SARS_COV_2_TRACKER_ENABLED}>
            <NavigationMenuTrigger>SeroTracker</NavigationMenuTrigger>
            <NavigationMenuContent>
<<<<<<< HEAD
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {serotracker.map((page) => (
                  <ListItem
                    key={page.title}
                    title={page.title}
                    href={page.href}
                  >
                    {page.description}
                  </ListItem>
                ))}
              </ul>
=======
              <div className="p-4 flex justify-center w-full">
                {process.env.SARS_COV_2_TRACKER_ENABLED &&
                  <TabGroup title={"SC2Tracker"} navItems={serotrackerNavItems}                />
                }
<<<<<<< HEAD
                <div className="flex flex-col w-2/4 px-2">
                  <h2 className="mb-2">ArboTracker</h2>
                  <ul className="flex flex-row space-x-2">
                  {arbotracker.map((arboItem: navMenuItem) => (
                    <ListItem title={arboItem.title} href={arboItem.href}>
                      {arboItem.description}
                      </ListItem>
                  ))}
                  </ul>
                </div>
              </div>
>>>>>>> c08bad2 (Added in conditional styling to the header)
=======
                <TabGroup title={"Arbotracker"} navItems={arbotrackerNavitems} />
                              </div>
>>>>>>> a564c99 (Updated header style a little bit and also extracted a reusable segment of code)
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>ArboTracker</NavigationMenuTrigger>
            <NavigationMenuContent>
<<<<<<< HEAD
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {arbotracker.map((page) => (
                  <ListItem
                    key={page.title}
                    title={page.title}
                    href={page.href}
                  >
                    {page.description}
                  </ListItem>
                ))}
              </ul>
=======
              <div className="p-4 flex justify-center w-full">
                <TabGroup title={"About"} navItems={aboutNavItems} />
                              </div>
>>>>>>> a564c99 (Updated header style a little bit and also extracted a reusable segment of code)
            </NavigationMenuContent>
          </NavigationMenuItem>
          {/*
          <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Documentation
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/about" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                About
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          */}
        </NavigationMenuList>
<<<<<<< HEAD
<<<<<<< HEAD
        <NavigationMenuViewport
          className={cn("transition-colors duration-300", headerBgColor)}
        />
=======
        <NavigationMenuViewport className={cn("transition-colors duration-300", headerBgColor)}/>
>>>>>>> c08bad2 (Added in conditional styling to the header)
=======
        <NavigationMenuViewport className={cn("transition-colors duration-300", headerBgColor)} />
>>>>>>> a564c99 (Updated header style a little bit and also extracted a reusable segment of code)
      </NavigationMenu>
    </header>
  );
};
