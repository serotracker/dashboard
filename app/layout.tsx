import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/customs/header";
import React from "react";
import clsx from "clsx";
import "mapbox-gl/dist/mapbox-gl.css";
import { ThemeProvider } from "@/contexts/theme-provider";
import { AppHeaderAndMain } from "./app-header-and-main";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SeroTracker",
  description:
    "A collection of dashboards tracking global seroprevalence data for mutliple pathogens.",
  icons: {
    icon: '/SerotrackerLogo.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>SeroTracker</title>
        <link rel="icon" type="image/svg+xml" href="/SerotrackerLogo.svg" />
        <link rel="alternate icon" href="/SerotrackerLogo.png" />{" "}
        {/* Fallback for older browsers */}
      </head>
      <body className={clsx(inter.className, "text-black no-scrollbar overflow-y-hidden")}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
