"use client"
import React, { useState, useCallback, createContext } from "react";
import { typedObjectEntries, typedObjectFromEntries } from "@/lib/utils";
import * as RadixUIToast from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";
import { Toast } from "@/components/customs/toast";
import { Breakpoint, useBreakpoint } from "@/hooks/useBreakpoint";

export enum ToastId {
  DOWNLOAD_CSV_CITATION_TOAST = "DOWNLOAD_CSV_CITATION_TOAST",
}

interface ToastInformation {
  openByDefault: boolean;
  title: React.ReactNode;
  message: React.ReactNode;
}

const toastInformation: Record<ToastId, ToastInformation> = {
  [ToastId.DOWNLOAD_CSV_CITATION_TOAST]: {
    openByDefault: false,
    title: <p className="font-bold mb-2"> Citation Copied!</p>,
    message: (
      <>
        <p className="inline">Our suggested citation for the CSV file has been copied to your clipboard (</p>
        <p className="inline italic">Harriet Ware, Mairead Whelan, Anabel Selemon, Emilie Toews, Shaila Akter, Niklas Bobrovitz, Rahul Arora, Yannik Roell, Thomas Jaenisch. A living systematic review of arbovirus seroprevalence studies. PROSPERO 2024 CRD42024551000 Available from: https://www.crd.york.ac.uk/prospero/display_record.php?ID=CRD42024551000</p>
        <p className="inline">).</p>
      </>
    )
  },
};

interface ToastContextType {
  openToast: (input: {toastId: ToastId}) => void;
  closeToast: (input: {toastId: ToastId}) => void;
}

const initialToastContext = {
  openToast: () => {},
  closeToast: () => {}
}

export const ToastContext = createContext<ToastContextType>(initialToastContext);

interface ToastState {
  open: boolean;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { getCurrentBreakpoint } = useBreakpoint();

  const [allToastStates, setAllToastStates] = React.useState<
    Record<ToastId, ToastState>
  >(
    typedObjectFromEntries(
      typedObjectEntries(toastInformation).map(
        ([toastId, toastInformation]) => [
          toastId,
          { open: toastInformation.openByDefault },
        ]
      )
    )
  );

  const openToast = useCallback(
    (input: { toastId: ToastId }) => {
      setAllToastStates((allToastStates) => ({
        ...allToastStates,
        [input.toastId]: {
          ...allToastStates[input.toastId],
          open: true,
        },
      }));
    },
    [setAllToastStates]
  );

  const closeToast = useCallback(
    (input: { toastId: ToastId }) => {
      setAllToastStates((allToastStates) => ({
        ...allToastStates,
        [input.toastId]: {
          ...allToastStates[input.toastId],
          open: false,
        },
      }));
    },
    [setAllToastStates]
  );

  return (
    <ToastContext.Provider
      value={{
        openToast,
        closeToast
      }}
    >
      <RadixUIToast.Provider
        swipeDirection= {[Breakpoint.XS, Breakpoint.SM, Breakpoint.MD].includes(getCurrentBreakpoint()) ? "down" : "right"}
      >
        {children}
        {typedObjectEntries(allToastStates).map(([toastId, toastState]) => (
          <Toast
            key={toastId}
            open={toastState.open}
            setOpen={(input: boolean) => {
              input ? openToast({ toastId }) : closeToast({ toastId });
            }}
            title={toastInformation[toastId].title}
            message={toastInformation[toastId].message}
          />
        ))}
      </RadixUIToast.Provider>
    </ToastContext.Provider>
  );
}
