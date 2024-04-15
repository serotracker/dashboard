import { cn } from "@/lib/utils";
import * as RadixUIToast from "@radix-ui/react-toast";

interface ToastProps {
  open: boolean;
  setOpen: (input: boolean) => void;
  title: React.ReactNode;
  message: React.ReactNode;
}

export const Toast = (props: ToastProps) => {
  return (
    <>
      <RadixUIToast.Root
        open={props.open}
        onOpenChange={props.setOpen}
        className={cn(
          "data-[state=open]:animate-toast-slide-in-bottom",
          "lg:data-[state=open]:animate-toast-slide-in-right",
          "data-[state=closed]:animate-toast-hide",
          "data-[swipe=end]:animate-toast-swipe-out-y",
          "lg:data-[swipe=end]:animate-toast-swipe-out-x",
          "bg-white border-solid border-2 p-4",
          "data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)]",
          "lg:data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
        )}
      >
        <RadixUIToast.Title asChild>
          {props.title}
        </RadixUIToast.Title>
        <RadixUIToast.Description asChild>
          {props.message}
        </RadixUIToast.Description>
      </RadixUIToast.Root>
      <RadixUIToast.Viewport className="fixed lg:right-2 sm:max-md:left-0 right-0 bottom-2 lg:max-w-md w-full"/>
    </>
  )
}