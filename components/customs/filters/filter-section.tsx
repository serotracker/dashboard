import { PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import SectionHeader from "../SectionHeader";
import React from "react";
import { FieldInformation } from "./available-filters";
import { SendFilterChangeDispatch } from "../filters";

export interface FilterSectionProps<TEstimate extends Record<string, unknown>> {
  headerText: string;
  headerTooltipText: string;
  state: PathogenContextType<TEstimate>;
  allFieldInformation: FieldInformation[];
  filters: any;
  data: TEstimate[];
  sendFilterChangeDispatch: SendFilterChangeDispatch;
}

export const FilterSection = <TEstimate extends Record<string, unknown>>(props: FilterSectionProps<TEstimate>) => (
  <div className="p-0">
    <SectionHeader
      headerText={props.headerText}
      tooltipText={props.headerTooltipText}
    />
    <div className="flex flex-row lg:flex-col flex-wrap">
    {props.allFieldInformation.map((fieldInformation) => (
      <fieldInformation.filterRenderingFunction
        key={fieldInformation.field}
        filter={fieldInformation.field}
        placeholder={fieldInformation.label}
        state={props.state}
        filterOptions={props.filters[fieldInformation.field] ?? []}
        data={props.data ? props.data : []}
        optionToLabelMap={fieldInformation.valueToLabelMap}
        renderTooltipContent={fieldInformation.renderTooltipContent}
        sendFilterChangeDispatch={props.sendFilterChangeDispatch}
        optionSortingFunction={fieldInformation.optionSortingFunction}
        optionToColourClassnameMap={fieldInformation.optionToColourClassnameMap ?? {}}
        clearAllButtonText={fieldInformation.clearAllButtonText ?? 'Clear all'}
      />
    ))}
    </div>
  </div>
);