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
>>>>>>> c08bad2 (Added in conditional styling to the header)
import { ArbovirusPageSectionId } from "@/app/constants";
=======
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
>>>>>>> 3e60d6d (Updated the header to have the tracker and about tabs with subtabs)
=======
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
>>>>>>> 8af1dec (Added in conditional styling to the header)

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
    title: "Analysis",
    href: "/pathogen/sarscov2/analyze",
    description:
      "A collection of visualizations and tabular data tools for our collection of SarsCov2 data",
  },
];

const arbotrackerNavitems: NavMenuItem[] = [
  {
    title: "Dashboard",
    href: `/pathogen/arbovirus/dashboard#${ArbovirusPageSectionId.MAP}`,
    description: "A dashboard for arbovirus seroprevalence data",
  },
  {
    title: "Analysis",
    href: `/pathogen/arbovirus/dashboard#${ArbovirusPageSectionId.TABLE}`,
    description:
      "A collection of visualizations and tabular data tools for our collection of arbovirus data",
  },
];

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
  const [prevTitleSuffix, setPrevTitleSuffix] = useState("");
  const [titleSuffixColor, setTitleSuffixColor] = useState("text-background");
  const [headerBgColor, setHeaderBgColor] = useState("bg-background")


  useEffect(() => {
    setPrevTitleSuffix(titleSuffix);
    if (pathname.includes('arbovirus')) {
      setTitleSuffix("Arbo");
      setTitleSuffixColor("text-green-500");
      setHeaderBgColor("bg-green-500 delay-150");
    } else if (pathname.includes('sarscov2')) {
      setTitleSuffix("SC2");
      setTitleSuffixColor("text-blue-500");
      setHeaderBgColor("bg-blue-500 delay-150");
>>>>>>> c08bad2 (Added in conditional styling to the header)
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
    <header className={cn("flex items-center justify-between transition-colors duration-300 h-12 w-screen px-2 text-white border-b-4 border-zinc-100", headerBgColor)}>
      <div className="cursor-pointer py-5 pl-2">
        <Link href={"/"} className="flex items-center text-h1">
          <h1>
          <span className={cn("p-1 mr-1 bg-white rounded-md transition-colors duration-300", titleSuffixColor)}>{titleSuffix}</span>
          Tracker
          </h1>
>>>>>>> c08bad2 (Added in conditional styling to the header)
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
                {!process.env.SARS_COV_2_TRACKER_ENABLED && 
                <div className="flex flex-col w-2/4 px-2">
                  <h2 className="mb-2">SC2Tracker</h2>
                  <ul className="flex flex-row space-x-2">
                  {serotracker.map((sc2Item: navMenuItem) => (
                    <ListItem title={sc2Item.title} href={sc2Item.href}>
                      {sc2Item.description}
                    </ListItem>
                  ))}
                  </ul>
                </div>
                }
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
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>ArboTracker</NavigationMenuTrigger>
            <NavigationMenuContent>
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
        <NavigationMenuViewport
          className={cn("transition-colors duration-300", headerBgColor)}
        />
=======
        <NavigationMenuViewport className={cn("transition-colors duration-300", headerBgColor)}/>
>>>>>>> c08bad2 (Added in conditional styling to the header)
      </NavigationMenu>
    </header>
  );
};
