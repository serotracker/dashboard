import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/customs/header";
import React from "react";
import clsx from "clsx";
import "mapbox-gl/dist/mapbox-gl.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SeroTracker",
  description:
    "A collection of dashboards tracking global seroprevalence data for mutliple pathogens.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
<<<<<<< HEAD
<<<<<<< HEAD
        <title>SeroTracker</title>
=======
        <title>SeroTracker</title> {/* Make this responsive to the arbo sc2 sero etc */}
>>>>>>> 57a39e1 (Updated the favicon as well as added a title for the website)
=======
        <title>SeroTracker</title>
>>>>>>> 19e7c4d (Made some small changes to improv how it all looks)
        <link rel="icon" type="image/svg+xml" href="/SerotrackerLogo.svg" />
        <link rel="alternate icon" href="/SerotrackerLogo.png" /> {/* Fallback for older browsers */}
      </head>
      <body className={clsx(inter.className, "text-black no-scrollbar")}>
        <Header />
        <main className={"h-full-screen w-screen bg-foreground"}>
          {children}
        </main>
      </body>
    </html>
  );
}
