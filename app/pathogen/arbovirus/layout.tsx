import React from "react";
import Filters from "@/app/pathogen/arbovirus/dashboard/filters";

export default function ArboLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        "grid gap-4 grid-cols-12 grid-rows-2 grid-flow-col w-full h-full overflow-scroll"
      }
    >
      {children}
    </div>
  );
}
