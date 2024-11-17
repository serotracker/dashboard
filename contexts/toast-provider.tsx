"use client"
import React, { useState, useCallback, createContext } from "react";
import { typedObjectEntries, typedObjectFromEntries } from "@/lib/utils";
import * as RadixUIToast from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";
import { Toast } from "@/components/customs/toast";
import { Breakpoint, useBreakpoint } from "@/hooks/useBreakpoint";
import { ArboTrackerCitationToastMessage } from "@/app/pathogen/arbovirus/arbotracker-citations";
import { MERSTrackerCitationToastMessage } from "@/app/pathogen/mers/merstracker-citations";

export enum ToastId {
  ARBOTRACKER_DOWNLOAD_CSV_CITATION_TOAST = "ARBOTRACKER_DOWNLOAD_CSV_CITATION_TOAST",
  MERSTRACKER_DOWNLOAD_CSV_CITATION_TOAST = "MERSTRACKER_DOWNLOAD_CSV_CITATION_TOAST"
}

interface ToastInformation {
  openByDefault: boolean;
  title: React.ReactNode;
  message: React.ReactNode;
}

const toastInformation: Record<ToastId, ToastInformation> = {
  [ToastId.ARBOTRACKER_DOWNLOAD_CSV_CITATION_TOAST]: {
    openByDefault: false,
    title: <p className="font-bold mb-2"> Citation Copied!</p>,
    message: <ArboTrackerCitationToastMessage />
  },
  [ToastId.MERSTRACKER_DOWNLOAD_CSV_CITATION_TOAST]: {
    openByDefault: false,
    title: <p className="font-bold mb-2"> Citation Copied!</p>,
    message: <MERSTrackerCitationToastMessage />
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
