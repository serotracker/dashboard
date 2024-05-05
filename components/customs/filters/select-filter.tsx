import { SendFilterChangeDispatch } from "@/app/pathogen/arbovirus/dashboard/filters";
import { Select } from "@/components/customs/select";
import { PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { ArbovirusEstimate } from "@/contexts/pathogen-context/pathogen-contexts/arbo-context";
import { GenericFilter } from "./generic-filter";
import { TooltipContentRenderingFunction } from "./available-filters";

export enum SelectFilterType {
  SINGLE_SELECT = 'SINGLE_SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
}

export interface SelectFilterProps {
  filter: string;
  placeholder: string;
  renderTooltipContent: TooltipContentRenderingFunction | undefined;
  sendFilterChangeDispatch: SendFilterChangeDispatch;
  state: PathogenContextType<ArbovirusEstimate>;
  data: any;
  selectFilterType: SelectFilterType;
  filterOptions: Array<string | undefined | null>;
  optionToLabelMap: Record<string, string | undefined>;
}

export const SelectFilter = (props: SelectFilterProps) => (
  <GenericFilter
    filter={props.filter}
    renderTooltipContent={props.renderTooltipContent}
  >
    <Select
      handleOnChange={(value) => props.sendFilterChangeDispatch({
        value,
        newFilter: props.filter,
        state: props.state,
        data: props.data
      })}
      heading={props.placeholder}
      selected={props.state.selectedFilters[props.filter] ?? []}
      options={props.filterOptions
        .filter(<T extends unknown>(filterOption: T | undefined | null): filterOption is T => filterOption !== undefined && filterOption !== null)
        .sort()
      }
      optionToLabelMap={props.optionToLabelMap}
      singleSelect={props.selectFilterType === SelectFilterType.SINGLE_SELECT}
    />
  </GenericFilter>
)