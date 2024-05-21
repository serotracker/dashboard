"use client";
import { useState, useEffect } from "react";

export enum Breakpoint {
  "XS" = "XS",
  "SM" = "SM",
  "MD" = "MD",
  "LG" = "LG",
  "XL" = "XL",
  "2XL" = "2XL",
  "UNKNOWN" = "UNKNOWN",
}

interface BreakpointFunctionError {
  breakpointFunctionError: true
}

export const useBreakpoint = () => {
  const getCurrentBreakpoint = () => {
    if(typeof window === 'undefined') {
      return Breakpoint.UNKNOWN;
    }

    if(!window?.innerWidth) {
      return Breakpoint.UNKNOWN;
    }

    if (!window.innerWidth) {
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

  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>(getCurrentBreakpoint());

  useEffect(() => {
    window.addEventListener('resize', () => setCurrentBreakpoint(getCurrentBreakpoint()));
    return () => window.removeEventListener('resize', () => setCurrentBreakpoint(getCurrentBreakpoint()));
  }, []);

  const breakpointSizeRanking = {
    [Breakpoint.XS]: 1,
    [Breakpoint.SM]: 2,
    [Breakpoint.MD]: 3,
    [Breakpoint.LG]: 4,
    [Breakpoint.XL]: 5,
    [Breakpoint["2XL"]]: 6
  } as const;

  const isGreaterThanOrEqualToBreakpoint = (breakpointA: Breakpoint, breakpointB: Breakpoint): boolean | BreakpointFunctionError => {
    if(breakpointA === Breakpoint.UNKNOWN || breakpointB === Breakpoint.UNKNOWN) {
      return {
        breakpointFunctionError: true
      }
    }

    return (breakpointSizeRanking[breakpointA] - breakpointSizeRanking[breakpointB]) >= 0 ? true : false
  }

  const isBreakpointFunctionError = (input: boolean | BreakpointFunctionError): input is BreakpointFunctionError => {
    if (typeof input === 'boolean') {
      return false
    }

    return true
  }

  return {
    getCurrentBreakpoint: () => currentBreakpoint,
    currentBreakpoint,
    isGreaterThanOrEqualToBreakpoint,
    isBreakpointFunctionError
  }
};
