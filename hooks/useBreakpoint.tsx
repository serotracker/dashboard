"use client";
import { useMemo } from "react";

export enum Breakpoint {
  "XS" = "XS",
  "SM" = "SM",
  "MD" = "MD",
  "LG" = "LG",
  "XL" = "XL",
  "2XL" = "2XL",
  "UNKNOWN" = "UNKNOWN",
}

export const useBreakpoint = () => {
  const getCurrentBreakpoint = () => {
    if(typeof window === 'undefined') {
      return Breakpoint.UNKNOWN;
    }

    if (!window?.innerWidth) {
      return Breakpoint.UNKNOWN;
    }

    if (window.innerWidth >= 1536) {
      return Breakpoint["2XL"];
    }

    if (window.innerWidth >= 1280) {
      return Breakpoint.XL;
    }

    if (window.innerWidth >= 1024) {
      return Breakpoint.LG;
    }

    if (window.innerWidth >= 768) {
      return Breakpoint.MD;
    }

    if (window.innerWidth >= 640) {
      return Breakpoint.SM;
    }

    return Breakpoint.XS;
  };

  return {
    getCurrentBreakpoint
  }
};
