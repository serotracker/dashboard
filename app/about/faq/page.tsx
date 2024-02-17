"use client";
import { Accordion } from "@/components/ui/accordion/accordion";
import { FAQPageOptionId, faqPageText } from "./text";

export default function FAQPage() {
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
