"use client"
import React, { useState, useCallback, createContext } from "react";
import { typedObjectEntries, typedObjectFromEntries } from "@/lib/utils";
import * as RadixUIToast from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";

export enum ToastId {
  DOWNLOAD_CSV_CITATION_TOAST = "DOWNLOAD_CSV_CITATION_TOAST",
}

interface ToastInformation {
  openByDefault: boolean;
  title: string;
  message: string;
}

const toastInformation: Record<ToastId, ToastInformation> = {
  [ToastId.DOWNLOAD_CSV_CITATION_TOAST]: {
    openByDefault: false,
    title: "Citation Copied!",
    message:
      "Our suggested citation for the CSV file has been copied to your clipboard.",
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

interface ToastProps {
  open: boolean;
  setOpen: (input: boolean) => void;
  title: string;
  message: string;
}

export const Toast = (props: ToastProps) => {
  return (
    <>
      <RadixUIToast.Root
        open={props.open}
        onOpenChange={props.setOpen}
        className="data-[state=open]:animate-toast-slide-in-right data-[state=closed]:animate-toast-hide bg-white border-solid border-2 p-4"
        //className={cn(
        //  "data-[state=open]:animate-toast-slide-in-right",
        //  "data-[state=closed]:animate-toast-hide",
        //  "bg-white border-solid border-2 p-4"
        //  // "data-[swipe=move]:animate-toast-swipe-out-x",
        //  // "data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:duration-200 data-[swipe=cancel]:ease-[ease]",
        //)}
      >
        <RadixUIToast.Title> {props.title} </RadixUIToast.Title>
        <RadixUIToast.Description asChild>
          <p> {props.message} </p>
        </RadixUIToast.Description>
      </RadixUIToast.Root>
      <RadixUIToast.Viewport className="fixed right-2 bottom-2"/>
    </>
  )
}


interface ToastState {
  open: boolean;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
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
        swipeDirection="right"
        duration={3000}
      >
        {children}
        {typedObjectEntries(allToastStates).map(([toastId, toastState]) => (
          <Toast
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
