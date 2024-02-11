"use client";
import { useContext, useEffect } from "react";
import {
  AboutPageSidebarOption,
  aboutPageSidebarContext,
} from "../about-page-context";

export default function TeamPage() {
  const { setCurrentSidebarOption } = useContext(aboutPageSidebarContext);

  useEffect(() => {
    setCurrentSidebarOption(AboutPageSidebarOption.THE_TEAM);
  }, [setCurrentSidebarOption]);

  return <p> the team page </p>;
}
