"use client";
import { useContext, useEffect } from "react";
import {
  AboutPageSidebarOption,
  aboutPageSidebarContext,
} from "../about-page-context";

export default function FAQPage() {
  const { setCurrentSidebarOption } = useContext(aboutPageSidebarContext);

  useEffect(() => {
    setCurrentSidebarOption(AboutPageSidebarOption.FAQ);
  }, [setCurrentSidebarOption]);

  return <p> Faq page </p>;
}
