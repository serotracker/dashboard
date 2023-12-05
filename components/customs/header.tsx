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
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import ListItem from "@/components/customs/list-item";

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
    title: "Analysis",
    href: "/pathogen/sarscov2/analyze",
    description:
      "A collection of visualizations and tabular data tools for our collection of SarsCov2 data",
  },
];

const arbotracker: navMenuItem[] = [
  {
    title: "Dashboard",
    href: "/pathogen/arbovirus/dashboard",
    description: "A dashboard for Arbovirus seroprevalence data",
  },
  {
    title: "Analysis",
    href: "/pathogen/arbovirus/analyze",
    description:
      "A collection of visualizations and tabular data tools for our collection of arbovirus data",
  },
];

export const Header = () => {
  const [language, setLanguage] = useState<"en" | "fr" | "de">("en");

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
        </Link>
      </div>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            {process.env.SARS_COV_2_TRACKER_ENABLED && (
              <NavigationMenuTrigger>Serotracker</NavigationMenuTrigger>
            )}
            <NavigationMenuContent>
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
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Arbotracker</NavigationMenuTrigger>
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
      </NavigationMenu>

      <div
        className={
          "text-md font-header non-italic text-white h-100 flex justify-end items-center cursor-pointer"
        }
      >
      {/* TODO: Need to incorporate language switching
        <Select
          defaultValue={language}
          onValueChange={(value) => setLanguage(value as "en" | "fr" | "de")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="EN" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">EN</SelectItem>
            <SelectItem value="fr">FR</SelectItem>
            <SelectItem value="de">DE</SelectItem>
          </SelectContent>
        </Select>
      */}
      </div>

    </header>
  );
};
