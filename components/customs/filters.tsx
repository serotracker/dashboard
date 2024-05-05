import { PathogenContextActionType, PathogenContextType } from "@/contexts/pathogen-context/pathogen-context";
import { ResetFiltersButton } from "./filters/reset-filters-button";
import { FilterableField, availableFilters } from "./filters/available-filters";
import { FilterSection } from "./filters/filter-section";

interface SendFilterChangeDispatchInput<TEstimate extends Record<string, unknown>> {
  value: string[],
  newFilter: string,
  state: PathogenContextType<TEstimate>,
  data: any
}

export type SendFilterChangeDispatch = <TEstimate extends Record<string, unknown>>(
  input: SendFilterChangeDispatchInput<TEstimate>
) => void;

/**
 * Function to add or update filters with multiple values
 * 
 */
const sendFilterChangeDispatch = <TEstimate extends Record<string, unknown>>(
  input: SendFilterChangeDispatchInput<TEstimate>
) => {
  input.state.dispatch({
    type: PathogenContextActionType.UPDATE_FILTER,
    payload: {
      filter: input.newFilter,
      value: input.value,
      data: input.data ? input.data : [],
    },
  });
};

interface FilterSectionConfiguration {
  headerText: string;
  headerTooltipText: string;
  includedFilters: FilterableField[];
}

interface FiltersProps<TEstimate extends Record<string, unknown>> {
  includedFilters: FilterableField[];
  filterSections: FilterSectionConfiguration[]
  state: PathogenContextType<TEstimate>;
  filterData: any;
  data: any;
  resetAllFiltersButtonEnabled: boolean;
  className?: string;
}

export const Filters = <TEstimate extends Record<string, unknown>>(props: FiltersProps<TEstimate>) => (
  <div className={props.className}>
    {props.includedFilters.map((includedFilter) => {
      const fieldInformation = availableFilters[includedFilter];

      return (
        <fieldInformation.filterRenderingFunction
          key={fieldInformation.field}
          filter={fieldInformation.field}
          placeholder={fieldInformation.label}
          state={props.state}
          filterOptions={props.filterData[fieldInformation.field] ?? []}
          data={props.data ? props.data.arbovirusEstimates : []}
          optionToLabelMap={fieldInformation.valueToLabelMap}
          renderTooltipContent={fieldInformation.renderTooltipContent}
          sendFilterChangeDispatch={sendFilterChangeDispatch}
        />
      )
    })}
    {props.filterSections.map((filterSection) => {
      return (
        <FilterSection
          key={filterSection.headerText}
          headerText={filterSection.headerText}
          headerTooltipText={filterSection.headerTooltipText}
          allFieldInformation={filterSection.includedFilters.map((filter) => availableFilters[filter])}
          state={props.state}
          filters={props.filterData.arbovirusFilterOptions}
          sendFilterChangeDispatch={sendFilterChangeDispatch}
          data={props.data}
        />
      )
    })}
    <ResetFiltersButton
      hidden={!props.resetAllFiltersButtonEnabled}
      state={props.state}
      data={props.data}
    />
  </div>
)