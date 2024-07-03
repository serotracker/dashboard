'use client'

import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const pathname = usePathname();

  useEffect(() => {
    const style = getComputedStyle(document.body);

    if (pathname.includes("arbovirus")) {
      document.documentElement.style.setProperty('--background', style.getPropertyValue('--arbo'));
      document.documentElement.style.setProperty('--background-hover',  style.getPropertyValue('--arbo-hover'));
    } else if (pathname.includes("sarscov2")) {
      document.documentElement.style.setProperty('--background', style.getPropertyValue('--sc2'));
      document.documentElement.style.setProperty('--background-hover', style.getPropertyValue('--sc2-hover'));
    } else if (pathname.includes("mers")) {
      document.documentElement.style.setProperty('--background', style.getPropertyValue('--mers'));
      document.documentElement.style.setProperty('--background-hover', style.getPropertyValue('--mers-hover'));
    } else {
      document.documentElement.style.setProperty('--background', style.getPropertyValue('--sero'));
      document.documentElement.style.setProperty('--background-hover', style.getPropertyValue('--sero-hover'));
    }
  }, [pathname]);
  
  return (
    <div>
      {children}
    </div>
  )
}

