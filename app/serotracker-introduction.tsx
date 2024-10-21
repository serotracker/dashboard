"use client";

import { Breakpoint, useBreakpoint } from "@/hooks/useBreakpoint";

export const SeroTrackerIntroduction = () => {
  const { 
    currentBreakpoint,
    isGreaterThanOrEqualToBreakpoint,
    isBreakpointFunctionError
  } = useBreakpoint();

  const isEqualToOrLargerThanMdBreakpoint = isGreaterThanOrEqualToBreakpoint(currentBreakpoint, Breakpoint.MD)
  
  return (
    <>
      <h1 className=" w-fit p-2 rounded-md">SeroTracker</h1>
        <h3 className="rounded-md p-2">
          {process.env.NEXT_PUBLIC_MERS_TRACKER_ENABLED === 'true'
            ? 'Your Go-To Source for COVID-19, MERS, and Arbovirus Seroprevalence Data'
            : 'Your Go-To Source for COVID-19 and Arbovirus Seroprevalence Data'
          }
        </h3>
      <div className="p-2 rounded-md">
        <p className=" w-fit mb-2">
          {`We synthesize findings from thousands of ${process.env.NEXT_PUBLIC_MERS_TRACKER_ENABLED === 'true'
            ? 'COVID-19, MERS, and Arbovirus'
            : 'COVID-19 and Arbovirus'
          } seroprevalence studies worldwide, collect and
          standardize the data we extract from them, provide useful
          analytics on the data and extract monthly insights relating to
          trends and patterns we find in the data`}
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