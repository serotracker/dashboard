"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useState } from "react";

export enum AboutPageSidebarOption {
  DATA_EXTRACTION = "DATA_EXTRACTION",
  FAQ = "FAQ",
  THE_TEAM = "THE_TEAM",
}

interface AboutPageSidebarContext {
  currentSidebarOption: AboutPageSidebarOption | undefined,
  setCurrentSidebarOption: (route: AboutPageSidebarOption) => void
}

const initialAboutPageSidebarContext: AboutPageSidebarContext = {
  currentSidebarOption: undefined,
  setCurrentSidebarOption: () => {}
}

export const aboutPageSidebarContext = createContext<AboutPageSidebarContext>(initialAboutPageSidebarContext);

const AboutPageSidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  const [currentSidebarOption, setCurrentSidebarOption] = useState<AboutPageSidebarOption | undefined>(undefined);
  
  return (
    <aboutPageSidebarContext.Provider value={{
      currentSidebarOption,
      setCurrentSidebarOption
    }}>
      {children}
    </aboutPageSidebarContext.Provider>
  );
};

export const AboutPageProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 86400000, // One day
        cacheTime: 86400000, // One day
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AboutPageSidebarProvider>
        {children}
      </AboutPageSidebarProvider>
    </QueryClientProvider>
  );
};
