"use client";

import { Breakpoint, useBreakpoint } from "@/hooks/useBreakpoint";
import { useEffect } from "react";

export const SeroTrackerIntroduction = () => {
  const { 
    currentBreakpoint,
    isGreaterThanOrEqualToBreakpoint,
    isBreakpointFunctionError
  } = useBreakpoint();

  const isEqualToOrLargerThanMdBreakpoint = isGreaterThanOrEqualToBreakpoint(currentBreakpoint, Breakpoint.MD)
  
  useEffect(() => {
    console.log(currentBreakpoint)
  }, [currentBreakpoint])

  return (
    <>
      <h1 className=" w-fit p-2 rounded-md">SeroTracker</h1>
        <h3 className="rounded-md p-2">
          Your Go to Source for COVID-19 and Arbovirus Seroprevalence Data
        </h3>
      <div className="p-2 rounded-md">
        <p className=" w-fit mb-2">
          We synthesize findings from thousands of COVID-19 and
          Arbovirus seroprevalence studies worldwide, collect and
          standardize the data we extract from them, provide useful
          analytics on the data and extract monthly insights relating to
          trends and patterns we find in the data
        </p>
        <p className=" w-fit mb-2">
          We conduct an ongoing systematic review to track serosurveys
          (antibody testing-based surveillance efforts) around the world
          and visualize findings on this dashboard.
        </p>
        <p>Check our dashboards using the buttons {(isEqualToOrLargerThanMdBreakpoint === true || isBreakpointFunctionError(isEqualToOrLargerThanMdBreakpoint)) ? 'to the right' : 'below'} or view our short tutorial on how to use our ArboTracker dashboard!</p>
      </div>
    </>
  )
}