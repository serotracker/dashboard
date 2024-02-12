"use client";
import { useContext, useEffect } from "react";
import {
  AboutPageSidebarOption,
  aboutPageSidebarContext,
} from "../about-page-context";
import { Accordion } from "@/components/ui/accordion/accordion";
import { FAQPageOptionId, faqPageText } from "./text";

export default function FAQPage() {
  const { setCurrentSidebarOption } = useContext(aboutPageSidebarContext);

  useEffect(() => {
    setCurrentSidebarOption(AboutPageSidebarOption.FAQ);
  }, [setCurrentSidebarOption]);

  const options = Object.values(FAQPageOptionId).map((optionId) => ({
    id: optionId,
    label: faqPageText[optionId].label,
    content: faqPageText[optionId].content
  }));

  return (
    <div className="mx-4">
      <h1 className="text-3xl mt-5 mb-3.5"> Frequently Asked Questions </h1>
      <Accordion
        defaultOption={undefined}
        options={options}
      />
    </div>
  );
}
