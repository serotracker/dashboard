"use client";
import {
  Root as NavigationMenuRoot,
  List as NavigationMenuList,
  Item as NavigationMenuItem,
  Content as NavigationMenuContent,
  Trigger as NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";

export default function About() {
  return (
    <NavigationMenuRoot orientation="vertical">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Item one</NavigationMenuTrigger>
          <NavigationMenuContent>Item one content</NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Item two</NavigationMenuTrigger>
          <NavigationMenuContent>Item Two content</NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenuRoot>
  )
}