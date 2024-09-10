import React from "react";
import { FAQPageOptionId } from "./text";
import { FaqAccordion } from "./faq-accordion";
import { cn } from "@/lib/utils";

export default function FAQPage() {
  return (
    <>
      <FaqAccordion
        headerClassName="mb-4"
        header="SeroTracker"
        optionIds={[
          FAQPageOptionId.HOW_DOES_SEROTRACKER_COLLECT_THEIR_DATA,
          FAQPageOptionId.HOW_OFTEN_IS_SEROTRACKER_DATA_UPDATED,
          FAQPageOptionId.CAN_I_PARTNER_WITH_SEROTRACKER
        ]}
      />
      <FaqAccordion
        headerClassName="mt-8 mb-2"
        header="ArboTracker"
        optionIds={[
          FAQPageOptionId.WHERE_DOES_ARBOTRACKER_DATA_COME_FROM,
          FAQPageOptionId.HOW_IS_THE_DATA_EXTRACTED_FROM_THE_SOURCES,
          FAQPageOptionId.HOW_OFTEN_IS_ARBOTRACKER_DATA_UPDATED,
          FAQPageOptionId.HOW_DOES_ARBOTRACKER_DATA_SHOW_UP_ON_THE_MAP,
          FAQPageOptionId.CAN_I_DOWNLOAD_ARBOTRACKER_DATA_FOR_MY_OWN_ANALYSIS
        ]}
      />
    </>
  );
}
