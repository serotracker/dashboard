"use client";
import { useContext, useEffect } from "react";
import {
  AboutPageSidebarOption,
  aboutPageSidebarContext,
} from "../about-page-context";

export default function DataExtractionPage() {
  const { setCurrentSidebarOption } = useContext(aboutPageSidebarContext);

  useEffect(() => {
    setCurrentSidebarOption(AboutPageSidebarOption.DATA_EXTRACTION);
  }, [setCurrentSidebarOption]);

  return <p> data extraction page </p>;
}
