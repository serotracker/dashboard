import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { FAQPageOptionId, faqPageText } from "./text";

export default function FAQPage() {
  const options = Object.values(FAQPageOptionId).map((optionId) => ({
    id: optionId,
    label: faqPageText[optionId].label,
    content: faqPageText[optionId].content
  }));

  return (
    <>
      <h2 className="mb-4"> Frequently Asked Questions </h2>
      <Accordion type="single" collapsible={true}>
        {options.map((option) => (
          <AccordionItem key={option.id} value={option.id} >
            <AccordionTrigger>
              {option.label}
            </AccordionTrigger>
            <AccordionContent>
              {option.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
