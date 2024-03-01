"use client";
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
    <div className="mx-4">
      <h1 className="text-3xl mt-5 mb-3.5"> Frequently Asked Questions </h1>
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
    </div>
  );
}
