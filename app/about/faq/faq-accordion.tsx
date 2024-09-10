import { useMemo } from 'react';
import { FAQPageOptionId, faqPageText } from "./text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export interface FAQAccordionProps {
  header: string;
  headerClassName?: string;
  optionIds: FAQPageOptionId[]
}

export const FaqAccordion = (
  props: FAQAccordionProps
) => {
  const { header, headerClassName, optionIds } = props;

  const options = useMemo(() => {
    return optionIds.map((optionId) => ({
      id: optionId,
      label: faqPageText[optionId].label,
      content: faqPageText[optionId].content
    }))
  }, [ optionIds ]);

  return (
    <>
      <h2 className={headerClassName ?? ''}> {header} </h2>
      <Accordion type="single" collapsible={true}>
        {options.map((option) => (
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