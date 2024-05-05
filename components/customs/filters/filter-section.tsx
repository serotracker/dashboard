import { PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { ArbovirusEstimate } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";
import SectionHeader from "../SectionHeader";
import React from "react";
import { FieldInformation } from "./available-filters";
import { SendFilterChangeDispatch } from "../filters";


export interface FilterSectionProps {
  headerText: string;
  headerTooltipText: string;
  state: PathogenContextType<ArbovirusEstimate>;
  allFieldInformation: FieldInformation[];
  filters: any;
  data: any;
  sendFilterChangeDispatch: SendFilterChangeDispatch;
}

export const FilterSection = (props: FilterSectionProps) => (
  <div className="p-0">
    <SectionHeader
      header_text={props.headerText}
      tooltip_text={props.headerTooltipText}
    />
    <div className="flex flex-row lg:flex-col flex-wrap">
    {props.allFieldInformation.map((fieldInformation) => (
      <fieldInformation.filterRenderingFunction
        key={fieldInformation.field}
        filter={fieldInformation.field}
        placeholder={fieldInformation.label}
        state={props.state}
        filterOptions={props.filters[fieldInformation.field] ?? []}
        data={props.data ? props.data.arbovirusEstimates : []}
        optionToLabelMap={fieldInformation.valueToLabelMap}
        renderTooltipContent={fieldInformation.renderTooltipContent}
        sendFilterChangeDispatch={props.sendFilterChangeDispatch}
      />
    ))}
    </div>
  </div>
);