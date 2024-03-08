import { cn } from "@/lib/utils";
import React from "react";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import Link from "next/link";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li className="flex-1">
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors bg-white/10 hover:bg-white/30 hover:text-accent-foreground focus:bg-white/30 focus:text-accent-foreground",
            className,
          )}
          href={href ?? "/error"}
          {...props}
        >
          <div className="text-sm text-foreground font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-foreground/50">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default ListItem;
