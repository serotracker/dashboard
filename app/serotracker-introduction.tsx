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
            ? 'SARS-CoV-2 (COVID-19 virus), MERS (Middle East Respiratory Syndrome coronavirus), and Arbovirus'
            : 'SARS-CoV-2 (COVID-19 virus) and Arbovirus'
          } seroprevalence studies worldwide. Seroprevalence studies are population-based studies that test for antibodies in blood or serum samples. Serological research studies help public health professionals and the public understand underlying rates of infection that may have been missed by routine testing, indicators of exposure and humoral immunity in risk groups, and can also help inform vaccination strategies. In some of our dashboards, i.e. MERSTracker, we also collect data on viral prevalence studies, and include research in multiple species.`}
        </p>
        <p className=" w-fit mb-2">
          We conduct regularly updated systematic reviews to comprehensively track existing research results around the world. We collect and standardize the data we extract from these studies, provide useful analytics on the data, and share insights relating to trends and patterns on our interactive, centralized, and open-access dashboards. 
        </p>
        <p>Check our dashboards using the buttons {(isEqualToOrLargerThanMdBreakpoint === true || isBreakpointFunctionError(isEqualToOrLargerThanMdBreakpoint)) ? 'to the right' : 'below'} or view our short tutorial on how to use our ArboTracker dashboard! See our About tab for more information our data, protocols, team, and how to cite us. </p>
      </div>
    </>
  )
}