"use client";
import { createContext, useState } from "react";

interface HelpModalContextType {
  helpModalTitle: string;
  setHelpModalTitle: (input: string) => void;
}

const initialHelpModalContext = {
  helpModalTitle: 'Help',
  setHelpModalTitle: () => {}
}

export const HelpModalContext = createContext<HelpModalContextType>(initialHelpModalContext);

interface HelpModalProviderProps {
  children: React.ReactNode;
}

export const HelpModalProvider = (props: HelpModalProviderProps) => {
  const [ helpModalTitle, setHelpModalTitle ] = useState<string>('Help');

  return (
    <HelpModalContext.Provider
      value={{
        helpModalTitle,
        setHelpModalTitle
      }}
    >
      {props.children}
    </HelpModalContext.Provider>
  );
}
