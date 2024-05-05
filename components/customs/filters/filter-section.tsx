import { FilterableField, SendFilterChangeDispatch } from "@/app/pathogen/arbovirus/dashboard/filters";
import { PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { ArbovirusEstimate } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";
import SectionHeader from "../SectionHeader";
import React from "react";

interface FieldInformation {
  field: FilterableField;
  label: string;
  valueToLabelMap: Record<string, string | undefined>;
  tooltipContent?: React.ReactNode;
  filterRenderingFunction: FilterRenderingFunction;
}

interface FilterRenderingFunctionInput {
  filter: string;
  placeholder: string;
  state: PathogenContextType<ArbovirusEstimate>;
  filterOptions: string[];
  data: any;
  optionToLabelMap: Record<string, string | undefined>;
  tooltipContent: React.ReactNode | undefined;
  sendFilterChangeDispatch: SendFilterChangeDispatch;
}

type FilterRenderingFunction = (input: FilterRenderingFunctionInput) => React.ReactNode;

interface FilterSectionProps {
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
        filter={fieldInformation.field}
        placeholder={fieldInformation.label}
        state={props.state}
        filterOptions={props.filters[fieldInformation.field]}
        data={props.data ? props.data.arbovirusEstimates : []}
        optionToLabelMap={fieldInformation.valueToLabelMap}
        tooltipContent={fieldInformation.tooltipContent}
        sendFilterChangeDispatch={props.sendFilterChangeDispatch}
      />
    ))}
    </div>
  </div>
);