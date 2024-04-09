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
      <h2 className="mb-4"> SeroTracker </h2>
      <Accordion type="single" collapsible={true}>
        {options.filter((option) => [
          FAQPageOptionId.HOW_DOES_SEROTRACKER_COLLECT_THEIR_DATA,
          FAQPageOptionId.HOW_OFTEN_IS_SEROTRACKER_DATA_UPDATED,
          FAQPageOptionId.CAN_I_PARTNER_WITH_SEROTRACKER
        ].includes(option.id)).map((option) => (
          <AccordionItem key={option.id} value={option.id} >
            <AccordionTrigger className="text-left">
              {option.label}
            </AccordionTrigger>
            <AccordionContent>
              {option.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <h2 className="mt-8 mb-2"> ArboTracker </h2>
      <Accordion type="single" collapsible={true}>
        {options.filter((option) => [
          FAQPageOptionId.WHERE_DOES_ARBOTRACKER_DATA_COME_FROM,
          FAQPageOptionId.HOW_IS_THE_DATA_EXTRACTED_FROM_THE_SOURCES,
          FAQPageOptionId.HOW_OFTEN_IS_ARBOTRACKER_DATA_UPDATED,
          FAQPageOptionId.HOW_DOES_ARBOTRACKER_DATA_SHOW_UP_ON_THE_MAP,
          // FAQPageOptionId.CAN_I_DOWNLOAD_ARBOTRACKER_DATA_FOR_MY_OWN_ANALYSIS
        ].includes(option.id)).map((option) => (
          <AccordionItem key={option.id} value={option.id} >
            <AccordionTrigger className="text-left">
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
