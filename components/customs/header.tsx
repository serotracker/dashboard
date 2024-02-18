"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import ListItem from "@/components/customs/list-item";
<<<<<<< HEAD
import { ArbovirusPageSectionId } from "@/app/constants";
=======
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
>>>>>>> 3e60d6d (Updated the header to have the tracker and about tabs with subtabs)

type navMenuItem = {
  title: string;
  href: string;
  description: string;
};

const serotracker: navMenuItem[] = [
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

const arbotracker: navMenuItem[] = [
  {
    title: "Dashboard",
    href: `/pathogen/arbovirus/dashboard#${ArbovirusPageSectionId.MAP}`,
    description: "A dashboard for Arbovirus seroprevalence data",
  },
  {
<<<<<<< HEAD
    title: "Analysis",
    href: `/pathogen/arbovirus/dashboard#${ArbovirusPageSectionId.TABLE}`,
=======
    title: "Data",
    href: "/pathogen/arbovirus/dashboard",
>>>>>>> 3e60d6d (Updated the header to have the tracker and about tabs with subtabs)
    description:
      "A collection of visualizations and tabular data tools for our collection of arbovirus data",
  },
  {
    title: "Visualizations",
    href: "/pathogen/arbovirus/dashboard",
    description:
      "A collection of visualizations and tabular data tools for our collection of arbovirus data",
  },
];

const about: navMenuItem[] = [
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

export const Header = () => {
  const [language, setLanguage] = useState<"en" | "fr" | "de">("en");

  return (
    <header className="bg-background flex items-center justify-between h-12 w-screen px-2 text-white border-b-4 border-zinc-100">
      <div className="cursor-pointer py-5 pl-2">
        <Link href={"/"} className="flex items-center text-h1">
          SeroTracker
        </Link>
      </div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent">Trackers</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 flex justify-center w-full">
                {process.env.SARS_COV_2_TRACKER_ENABLED && 
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
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent">About</NavigationMenuTrigger>
            <NavigationMenuContent>
            <div className="p-4 flex justify-center w-full">
                <div className="flex flex-col w-2/4 px-2">
                  <h2 className="mb-2">About</h2>
                  <ul className="flex flex-row space-x-2">
                  {about.map((arboItem: navMenuItem) => (
                    <ListItem title={arboItem.title} href={arboItem.href}>
                      {arboItem.description}
                      </ListItem>
                  ))}
                  </ul>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
