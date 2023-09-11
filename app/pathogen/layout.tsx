import React from "react";

export default function PathogensLayout({
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
