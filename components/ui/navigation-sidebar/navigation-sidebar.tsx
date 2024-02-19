"use client";
import React from "react";

import {
  Root as NavigationMenuRoot,
  List as NavigationMenuList,
  Item as NavigationMenuItem,
  Content as NavigationMenuContent,
  Trigger as NavigationMenuTrigger,
  Link as NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavigationSidebarOptionData<TSidebarValue extends string> {
  route: string;
  label: string;
  value: TSidebarValue;
}

interface NavigationMenuProps<TSidebarValue extends string> {
  options: Array<NavigationSidebarOptionData<TSidebarValue>>;
  selectedValue: TSidebarValue | undefined;
}

interface NavigationSidebarOptionProps<TSidebarValue extends string> {
  option: NavigationSidebarOptionData<TSidebarValue>;
  isSelected: boolean;
}

export const NavigationSidebarOption = <TSidebarValue extends string>(
  props: NavigationSidebarOptionProps<TSidebarValue>
): React.ReactNode => {
  return (
    <div className={cn("w-full p-4 flex rounded-lg", props.isSelected ? 'bg-gray-300' : 'hover:bg-gray-100')}>
      <p className="ml-auto"> {props.option.label} </p>
    </div>
  );
}

export const NavigationSidebar = <TSidebarValue extends string>(
  props: NavigationMenuProps<TSidebarValue>
): React.ReactNode => {
  const router = useRouter();

  return (
    <NavigationMenuRoot orientation="vertical">
      <NavigationMenuList>
        {props.options.map((option) => (
          <NavigationMenuItem key={option.value} className="m-4">
            <NavigationMenuTrigger
              className="w-full"
            >
              <NavigationMenuLink
                className="w-full"
                onSelect={() => router.push(option.route)}
              >
                <NavigationSidebarOption
                  option={option}
                  isSelected={props.selectedValue === option.value}
                />
              </NavigationMenuLink>
            </NavigationMenuTrigger>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenuRoot>
  );
};
