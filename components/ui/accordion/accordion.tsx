import {
  Root as AccordionRoot,
  Item as AccordionItem,
  Content as AccordionContent,
  Trigger as AccordionTrigger,
  Header as AccordionHeader,
} from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import "./accordion-styles.css";

interface AccordionOption<TAccordionOptionId extends string> {
  id: TAccordionOptionId;
  label: string;
  content: JSX.Element;
}

interface AccordionProps<TAccordionOptionId extends string> {
  defaultOption: TAccordionOptionId | undefined;
  options: AccordionOption<TAccordionOptionId>[];
}

export const Accordion = <TAccordionOptionId extends string>(props: AccordionProps<TAccordionOptionId>) => (
  <AccordionRoot type="single" defaultValue={props.defaultOption} collapsible>
    {props.options.map((option) => (
      <AccordionItem key={option.id} value={option.id} className="border rounded-l">
        <AccordionHeader>
          <AccordionTrigger className="accordion-trigger w-full">
            <div className="flex py-2 w-full">
              <ChevronDown aria-hidden={true} className="accordion-chevron mx-2"/>
              <p className="font-bold"> {option.label} </p>
            </div>
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          <div className="py-2 px-4 border-t-2"> {option.content} </div>
        </AccordionContent>
      </AccordionItem>
    ))}
  </AccordionRoot>
);
